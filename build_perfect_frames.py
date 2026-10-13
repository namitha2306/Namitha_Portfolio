import cv2
import numpy as np
import math
import os

os.makedirs("public/frames", exist_ok=True)

# 1. Read character.mp4
cap = cv2.VideoCapture("public/character.mp4")
frames = []
while True:
    ret, f = cap.read()
    if not ret:
        break
    frames.append(f)
cap.release()

total_frames = len(frames)
print(f"Total video frames: {total_frames}")

# Background BGR ~ [7.5, 11.0, 239.0] -> RGB: #EF0B07
bg_bgr = np.array([7.5, 11.0, 239.0], dtype=float)

# Save center.webp (frame 239 is neutral pose looking directly forward)
center_frame_num = 239
cv2.imwrite("public/frames/center.webp", frames[center_frame_num], [cv2.IMWRITE_WEBP_QUALITY, 96])
print(f"Saved center.webp from frame {center_frame_num}")

# Measure head orientation for each frame 0..239
# Head crop box: y: 150..550, x: 400..850
frame_data = []

for idx, f in enumerate(frames):
    crop = f[150:550, 400:850]
    diff = np.abs(crop.astype(float) - bg_bgr).sum(axis=2)
    fg_mask = (diff > 45).astype(np.uint8)
    
    # Head outline moments
    m_fg = cv2.moments(fg_mask)
    if m_fg["m00"] > 0:
        head_cx = m_fg["m10"] / m_fg["m00"]
        head_cy = m_fg["m01"] / m_fg["m00"]
    else:
        head_cx, head_cy = 225.0, 200.0
        
    # Dark facial features
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
    
    # Standard screen angle in degrees [0, 360)
    # dx > 0 is RIGHT, dy > 0 is DOWN
    rad = math.atan2(dy, dx)
    deg = (math.degrees(rad)) % 360.0
    
    mag = math.hypot(dx, dy)
    frame_data.append({
        'frame': idx,
        'dx': dx, 'dy': dy,
        'deg': deg,
        'mag': mag
    })

# Identify 8 compass directions
compass_targets = {
    'RIGHT': 0.0,
    'DOWN-RIGHT': 45.0,
    'DOWN': 90.0,
    'DOWN-LEFT': 135.0,
    'LEFT': 180.0,
    'UP-LEFT': 225.0,
    'UP': 270.0,
    'UP-RIGHT': 315.0
}

print("\n--- 8 Compass Direction Frame Identification ---")
compass_frames = {}
for direction, target_deg in compass_targets.items():
    best_item = min(frame_data, key=lambda d: abs((d['deg'] - target_deg + 180) % 360 - 180))
    compass_frames[direction] = best_item['frame']
    print(f"{direction:<12} (Target {target_deg:>5.1f}°): Frame {best_item['frame']:>3} (Actual angle {best_item['deg']:>5.1f}°, dx={best_item['dx']:+5.1f}, dy={best_item['dy']:+5.1f})")

# Generate 64 WebP frames corresponding to 64 equidistant angles around 360 degrees
print("\nExtracting 64 WebP frames...")
for i in range(64):
    target_deg = (i * 360.0 / 64.0) % 360.0
    # Find frame closest to target_deg
    best_item = min(frame_data, key=lambda d: abs((d['deg'] - target_deg + 180) % 360 - 180))
    img = frames[best_item['frame']]
    filepath = f"public/frames/frame_{i}.webp"
    cv2.imwrite(filepath, img, [cv2.IMWRITE_WEBP_QUALITY, 95])

print("Completed extracting 64 WebP frames and center.webp successfully!")
