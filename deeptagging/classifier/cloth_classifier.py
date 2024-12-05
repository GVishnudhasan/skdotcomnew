import torch
from torchvision import transforms
from torch.autograd import Variable
from PIL import Image
import torch.nn as nn
import numpy as np
import tensorflow as tf
import os

dirname = os.path.dirname(__file__)

MODEL_PATH = "models/stage-1_resnet34.pkl"
CLASSES_PATH = "models/classes.txt"

MODEL_PATH = os.path.join(dirname, MODEL_PATH)
CLASSES_PATH = os.path.join(dirname, CLASSES_PATH)

class ClothesClassifier:

    def __init__(self,iamge_path, eval=False):
        self.image_path = iamge_path
        self.model = torch.load(MODEL_PATH)
        self.model = nn.Sequential(self.model)
        
        self.labels = open(CLASSES_PATH, 'r').read().splitlines()
        
        if eval:
           self. model.eval()
    
    def predict(self):
        """here we do the predict of the image
        - image path : str (nfs path of the image)

        return 
        - multiplae lables : list
        """
        
        device = torch.device("cpu")
        img = Image.open(self.image_path).convert('RGB')
        test_transforms = transforms.Compose([transforms.Resize(224),
                                      transforms.ToTensor(),
                                      transforms.Normalize([0.485, 0.456, 0.406],
                                                           [0.229, 0.224, 0.225])
                                     ])
        
        image_tensor = test_transforms(img).float()
        image_tensor = image_tensor.unsqueeze_(0)
        inp = Variable(image_tensor)
        inp = inp.to(device)
        output = self.model(inp)
        index = output.data.cpu()
        ar = tf.nn.softmax(index[0])
        top_values= [i for i in np.argsort(ar)[-3:]]
        multilables = [self.labels[indx] for indx in top_values]
        return multilables #self.labels[index]
