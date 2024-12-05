from tensorflow.keras.preprocessing.image import img_to_array  # type: ignore
from tensorflow.keras.models import load_model # type: ignore
import numpy as np
import cv2, os
import cvlib as cv


dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, 'models/algo_model.model')
model = load_model(filename)
classes = ['men','women']


class GenderClassifer:

    def __init__(self, image_path):
        """
        """
        self.frame = cv2.imread(image_path)
        if self.frame is None: raise ValueError("can not read the image file for gender classification")

    def gender_lable(self):
        """ Get gender lables for the image

        Return
        - lables : list (lables for the all faces in the image)
        """
        lables = []
        face, confidence = cv.detect_face(self.frame)
        
        for idx, f in enumerate(face):
            (startX, startY) = f[0], f[1]
            (endX, endY) = f[2], f[3]

            cv2.rectangle(self.frame, (startX,startY), (endX,endY), (0,255,0), 2)
            face_crop = np.copy(self.frame[startY:endY,startX:endX])

            if (face_crop.shape[0]) < 10 or (face_crop.shape[1]) < 10: continue

            lable = self.confidence_level(face_crop)
            lables.append(lable)
        return lables
        
    
    def confidence_level(self, face_crop):
        """ Get confidence level of face_crop 
        - face_copt : np.array (face object croped from the image)

        Return
        - lable : str (lable for the specific face)
        """

        face_crop = cv2.resize(face_crop, (96,96))
        face_crop = face_crop.astype("float") / 255.0
        face_crop = img_to_array(face_crop)
        face_crop = np.expand_dims(face_crop, axis=0)

        conf = model.predict(face_crop)[0] 
        idx = np.argmax(conf)
        label = classes[idx]
        return label