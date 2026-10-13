import cv2
import numpy as np
import math
import os

print("Processing new black-background character.mp4 video into 65 transparent WebP frames...")

cap = cv2.VideoCapture("public/character.mp4")
frames = []
while True:
    ret, f = cap.read()
    if not ret:
        break
    frames.append(f)
cap.release()

total_f = len(frames)
print(f"Loaded {total_f} video frames.")

# Measure head orientation for each frame
frame_data = []

for idx, f in enumerate(frames):
    crop = f[120:580, 380:880]
    b_crop = crop[:, :, 0].astype(float)
    g_crop = crop[:, :, 1].astype(float)
    r_crop = crop[:, :, 2].astype(float)
    
    # Black background: sum(BGR) < 35
    bg_mask = (b_crop + g_crop + r_crop) < 35.0
    fg_mask = (~bg_mask).astype(np.uint8)
    
    m_fg = cv2.moments(fg_mask)
    if m_fg["m00"] > 0:
        head_cx = m_fg["m10"] / m_fg["m00"]
        head_cy = m_fg["m01"] / m_fg["m00"]
    else:
        head_cx, head_cy = 250.0, 230.0
        
    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    dark_mask = ((gray < 95) & (fg_mask > 0)).astype(np.uint8)
    m_dark = cv2.moments(dark_mask)
    if m_dark["m00"] > 0:
        face_cx = m_dark["m10"] / m_dark["m00"]
        face_cy = m_dark["m01"] / m_dark["m00"]
    else:
        face_cx, face_cy = head_cx, head_cy
        
    dx = face_cx - head_cx
    dy = face_cy - head_cy
    
    rad = math.atan2(dy, dx)
    deg = (math.degrees(rad)) % 360.0
    
    frame_data.append({
        'frame': idx,
        'dx': dx, 'dy': dy,
        'deg': deg
    })

os.makedirs("public/frames", exist_ok=True)

# Map 64 circular trajectory frames + center.webp
frames_to_save = {}
frames_to_save['center.webp'] = frames[total_f - 1]

for i in range(64):
    target_deg = (i * 360.0 / 64.0) % 360.0
    best_item = min(frame_data, key=lambda d: abs((d['deg'] - target_deg + 180) % 360 - 180))
    frames_to_save[f"frame_{i}.webp"] = frames[best_item['frame']]

kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))

for filename, frame in frames_to_save.items():
    b = frame[:, :, 0].astype(float)
    g = frame[:, :, 1].astype(float)
    r = frame[:, :, 2].astype(float)
    
    # Black background keying
    bg_mask = (b + g + r) < 35.0
    fg_mask = (~bg_mask).astype(np.uint8) * 255
    
    # Clean internal subject holes
    fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_CLOSE, kernel)
    
    # Smooth boundary
    alpha = cv2.GaussianBlur(fg_mask, (3, 3), 0)
    
    bgra = cv2.merge([frame[:, :, 0], frame[:, :, 1], frame[:, :, 2], alpha])
    cv2.imwrite(f"public/frames/{filename}", bgra, [cv2.IMWRITE_WEBP_QUALITY, 96])

print("Successfully generated all 65 clean, transparent WebP frames from new video!")
