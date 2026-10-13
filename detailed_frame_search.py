import cv2
import numpy as np

# Load frames and compute face center, nose position, eye line, and head bounding box
# Let's inspect the entire video frame by frame

cap = cv2.VideoCapture("public/character.mp4")
frames = []
while True:
    ret, frame = cap.read()
    if not ret:
        break
    frames.append(frame)
cap.release()

print(f"Loaded {len(frames)} frames.")

# Let's analyze nose tip / face center relative to head background
# Red background color is around BGR: B=6, G=10, R=242
bg_bgr = np.array([6, 10, 242], dtype=float)

# Compute character mask for each frame
masks = []
head_crops = []
for idx, frame in enumerate(frames):
    diff = np.abs(frame.astype(float) - bg_bgr).sum(axis=2)
    mask = (diff > 50).astype(np.uint8)
    masks.append(mask)
    # Head region y: 150..550, x: 400..850
    head_crops.append(frame[150:550, 400:850])

# Let's track face features: nose/mouth/eyes using OpenCV or template matching
# Let's find neutral center frame (where head looks straight forward at camera)
# Neutral frame is described as "with a neutral pose looking directly at the camera at the end"
# Let's inspect frames 200..239 (the end of the video) vs frames 0..200

# Let's save a summary image with frame indices 0, 10, 20, ..., 230 to inspect exact frame contents
for f in [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 239]:
    print(f"Frame {f}: shape={frames[f].shape}")
