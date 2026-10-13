import cv2
import numpy as np

cap = cv2.VideoCapture("public/character.mp4")
ret, frame = cap.read()
cap.release()

# Background is checkerboard pattern (top-left 50x50)
bg_sample = frame[0:50, 0:50]
print("Checkerboard min BGR:", bg_sample.min(axis=(0,1)))
print("Checkerboard max BGR:", bg_sample.max(axis=(0,1)))
print("Checkerboard mean BGR:", bg_sample.mean(axis=(0,1)))

# Sample subject face, hair, cream sweater
h, w, _ = frame.shape
face = frame[int(h*0.3):int(h*0.5), int(w*0.5):int(w*0.8)]
hair = frame[int(h*0.1):int(h*0.4), int(w*0.4):int(w*0.7)]
sweater = frame[int(h*0.7):int(h*0.9), int(w*0.4):int(w*0.8)]

print("Face min BGR:", face.min(axis=(0,1)), "mean BGR:", face.mean(axis=(0,1)))
print("Hair min BGR:", hair.mean(axis=(0,1)), "mean BGR:", hair.mean(axis=(0,1)))
print("Sweater mean BGR:", sweater.mean(axis=(0,1)))
