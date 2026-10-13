import cv2
import numpy as np

cap = cv2.VideoCapture("public/character.mp4")
ret, frame = cap.read()
cap.release()

print("Top-Left 20x20 BGR mean:", frame[0:20, 0:20].mean(axis=(0,1)))
print("Top-Right 20x20 BGR mean:", frame[0:20, -20:].mean(axis=(0,1)))
print("Bottom-Left 20x20 BGR mean:", frame[-20:, 0:20].mean(axis=(0,1)))
print("Bottom-Right 20x20 BGR mean:", frame[-20:, -20:].mean(axis=(0,1)))

# Sample subject face, hair, shirt
face = frame[250:350, 600:680]
hair = frame[150:220, 550:650]
shirt = frame[500:600, 550:700]

print("Face BGR mean:", face.mean(axis=(0,1)))
print("Hair BGR mean:", hair.mean(axis=(0,1)))
print("Shirt BGR mean:", shirt.mean(axis=(0,1)))
