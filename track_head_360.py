import cv2
import numpy as np
import math

# Load all 240 frames
cap = cv2.VideoCapture("public/character.mp4")
frames = []
while True:
    ret, f = cap.read()
    if not ret:
        break
    frames.append(f)
cap.release()

total_f = len(frames)

# In frame 239 (near end), let's inspect where nose/eyes/mouth are.
# Head box: y: 180..520, x: 420..840
# Neutral pose looking straight at camera:
# Let's measure similarity of head crop to frame 239 to find neutral center frame.

neutral_crop = frames[239][200:500, 450:830]

diffs_with_neutral = []
for i in range(total_f):
    crop = frames[i][200:500, 450:830]
    diff = np.mean(np.abs(crop.astype(float) - neutral_crop.astype(float)))
    diffs_with_neutral.append(diff)

min_diff_idx = np.argmin(diffs_with_neutral)
print(f"Frame most similar to end frame 239: Frame {min_diff_idx} (diff={diffs_with_neutral[min_diff_idx]:.2f})")

# Let's inspect the frame diffs for the end section (frames 200..239)
end_diffs = diffs_with_neutral[200:]
print("End section diffs with frame 239:")
for idx, d in enumerate(end_diffs, start=200):
    print(f"Frame {idx}: diff={d:.2f}")

