import cv2
import numpy as np
import math
import os

os.makedirs("public/frames", exist_ok=True)

# Load video frames
cap = cv2.VideoCapture("public/character.mp4")
frames = []
while True:
    ret, f = cap.read()
    if not ret:
        break
    frames.append(f)
cap.release()

total_f = len(frames)
print(f"Total frames loaded: {total_f}")

# Let's inspect the exact facial orientation in each frame.
# We want to identify:
# 1. 8 compass directions (UP, UP-RIGHT, RIGHT, DOWN-RIGHT, DOWN, DOWN-LEFT, LEFT, UP-LEFT)
# 2. center.webp (neutral pose looking directly at camera)
# 3. 64 WebP frames along the 360° circular head rotation trajectory (frame_0.webp .. frame_63.webp)

# Let's analyze feature tracking using optical flow / template matching of nose & eyes to get high accuracy angle.
# Let's crop head region (y: 150..550, x: 400..850)
head_crops = [f[150:550, 400:850] for f in frames]

# Neutral frame (looking straight at camera) is frame 239 or frame in range 230-239
neutral_frame_idx = 239
center_img = frames[neutral_frame_idx]

# Save center.webp
cv2.imwrite("public/frames/center.webp", center_img, [cv2.IMWRITE_WEBP_QUALITY, 95])
print(f"Saved public/frames/center.webp from frame {neutral_frame_idx}")

# Let's track face angle for all frames 0 to 239:
# Face angle theta in canvas space:
# In screen space (x right, y down):
# UP = 270° (or -90°)
# UP-RIGHT = 315° (or -45°)
# RIGHT = 0° (or 360°)
# DOWN-RIGHT = 45°
# DOWN = 90°
# DOWN-LEFT = 135°
# LEFT = 180°
# UP-LEFT = 225°

# Let's find for each frame its estimated angle in [0, 360).
bg_bgr = np.array([6, 10, 242], dtype=float)

frame_angles = []
for idx, crop in enumerate(head_crops):
    diff = np.abs(crop.astype(float) - bg_bgr).sum(axis=2)
    fg_mask = (diff > 50).astype(np.uint8)
    
    # Moments of foreground
    m_fg = cv2.moments(fg_mask)
    if m_fg["m00"] > 0:
        head_cx = m_fg["m10"] / m_fg["m00"]
        head_cy = m_fg["m01"] / m_fg["m00"]
    else:
        head_cx, head_cy = 225.0, 200.0
        
    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    dark_mask = ((gray < 90) & (fg_mask > 0)).astype(np.uint8)
    m_dark = cv2.moments(dark_mask)
    if m_dark["m00"] > 0:
        face_cx = m_dark["m10"] / m_dark["m00"]
        face_cy = m_dark["m01"] / m_dark["m00"]
    else:
        face_cx, face_cy = head_cx, head_cy
        
    dx = face_cx - head_cx
    dy = face_cy - head_cy
    
    # Angle theta in [0, 360)
    rad = math.atan2(dy, dx)
    deg = math.degrees(rad) % 360
    frame_angles.append((idx, deg, dx, dy, math.hypot(dx, dy)))

# Find best frame for each angle target 0..63 (every 5.625 degrees)
# Target angle i * (360 / 64)
extracted_frames = []
for i in range(64):
    target_deg = (i * 360.0 / 64.0) % 360.0
    
    # Find frame with smallest angular distance to target_deg, prioritizing frames with sufficient movement mag
    best_idx = 0
    best_dist = 999.0
    for idx, deg, dx, dy, mag in frame_angles:
        # Ignore neutral frame 230..239 if we want active rotation, unless it's closest
        dist = abs((deg - target_deg + 180) % 360 - 180)
        if dist < best_dist:
            best_dist = dist
            best_idx = idx
            
    img_to_save = frames[best_idx]
    filename = f"public/frames/frame_{i}.webp"
    cv2.imwrite(filename, img_to_save, [cv2.IMWRITE_WEBP_QUALITY, 92])
    extracted_frames.append((i, target_deg, best_idx, best_dist))

print("Successfully extracted 64 WebP frames!")
