import cv2
import numpy as np

img = cv2.imread("public/character.png", cv2.IMREAD_UNCHANGED)
if img is not None:
    print("character.png shape:", img.shape)
    top_left = img[0:100, 0:100]
    print("character.png top-left channels:", top_left.shape)
    if img.shape[2] == 4:
        print("character.png alpha min:", img[:,:,3].min(), "max:", img[:,:,3].max())
    # Sample top-left BGR
    print("character.png top-left mean BGR:", top_left[:,:,:3].mean(axis=(0,1)))
