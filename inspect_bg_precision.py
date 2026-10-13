import cv2
import numpy as np

img = cv2.imread("public/frames/center.webp", cv2.IMREAD_COLOR)

# Sample corner pixels (background)
tl = img[0:20, 0:20].mean(axis=(0,1))
tr = img[0:20, -20:].mean(axis=(0,1))
bl = img[-20:, 0:20].mean(axis=(0,1))
br = img[-20:, -20:].mean(axis=(0,1))

bg_avg = (tl + tr + bl + br) / 4.0
print(f"Top-Left corner BGR: {tl}")
print(f"Top-Right corner BGR: {tr}")
print(f"Bottom-Left corner BGR: {bl}")
print(f"Bottom-Right corner BGR: {br}")
print(f"Average BG BGR: {bg_avg}")

# Sample hair, skin, shirt pixels from subject
# Head is around y: 150..450, x: 500..780
face_sample = img[250:350, 600:680]
hair_sample = img[150:220, 550:650]
shirt_sample = img[500:600, 550:700]

print("Face sample avg BGR:", face_sample.mean(axis=(0,1)))
print("Hair sample avg BGR:", hair_sample.mean(axis=(0,1)))
print("Shirt sample avg BGR:", shirt_sample.mean(axis=(0,1)))
