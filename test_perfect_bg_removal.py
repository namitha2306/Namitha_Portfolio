import cv2
import numpy as np

# Load original video frame 239
cap = cv2.VideoCapture("public/character.mp4")
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
cap.set(cv2.CAP_PROP_POS_FRAMES, total_frames - 1)
ret, frame = cap.read()
cap.release()

h, w, _ = frame.shape

# Background is dark red where B < 55 and G < 55 and R > 100
# Let's inspect B and G channels
b = frame[:, :, 0].astype(float)
g = frame[:, :, 1].astype(float)
r = frame[:, :, 2].astype(float)

# Background mask: low blue and low green
# Skin/hair/clothing have G >= 65 or B >= 55
bg_mask = (b < 55) & (g < 55) & (r > 100)

# Create solid subject mask: subject is everywhere NOT bg_mask
fg_mask = (~bg_mask).astype(np.uint8) * 255

# Apply 3x3 morphology close/open to ensure subject interior has 0 holes
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_CLOSE, kernel)

# Smooth border slightly with GaussianBlur only on the edge
alpha = cv2.GaussianBlur(fg_mask, (3, 3), 0)

# Create transparent BGRA
bgra = cv2.merge([frame[:, :, 0], frame[:, :, 1], frame[:, :, 2], alpha])

cv2.imwrite("public/frames/test_perfect_center.webp", bgra, [cv2.IMWRITE_WEBP_QUALITY, 96])
print("Saved test_perfect_center.webp!")
