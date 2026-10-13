import cv2
import numpy as np

# Read frame 239 of new video
cap = cv2.VideoCapture("public/character.mp4")
total_f = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
cap.set(cv2.CAP_PROP_POS_FRAMES, total_f - 1)
ret, frame = cap.read()
cap.release()

b = frame[:, :, 0].astype(float)
g = frame[:, :, 1].astype(float)
r = frame[:, :, 2].astype(float)

# Black background threshold: sum(BGR) < 35
bg_mask = (b + g + r) < 35.0

# Subject mask is everywhere NOT bg_mask
fg_mask = (~bg_mask).astype(np.uint8) * 255

# Fill holes inside subject
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_CLOSE, kernel)

alpha = cv2.GaussianBlur(fg_mask, (3, 3), 0)

bgra = cv2.merge([frame[:, :, 0], frame[:, :, 1], frame[:, :, 2], alpha])
cv2.imwrite("public/frames/test_black_center.webp", bgra, [cv2.IMWRITE_WEBP_QUALITY, 96])
print("Saved test_black_center.webp successfully!")
