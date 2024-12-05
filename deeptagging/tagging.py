import cv2, json, sys
from classifier import initialize

image  = 'deeptagging/test-images/test6.jpg'
gendata = initialize(image)

json.dump(gendata, sys.stdout)