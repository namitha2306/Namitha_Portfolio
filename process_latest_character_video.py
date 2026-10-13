import cv2
import numpy as np
import math
import os

print("Step 1: Inspecting latest character.mp4 video...")
cap = cv2.VideoCapture("public/character.mp4")
fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

frames = []
bg_colors = []
while True:
    ret, f = cap.read()
    if not ret:
        break
    frames.append(f)
    if len(bg_colors) < 20:
        tl = f[0:15, 0:15].mean(axis=(0,1))
        bg_colors.append(tl)

cap.release()

avg_bg_bgr = np.mean(bg_colors, axis=0)
print(f"Video Info: {total_frames} frames, {fps} FPS, {width}x{height}")
print(f"Detected Background BGR: {avg_bg_bgr}")

os.makedirs("public/frames", exist_ok=True)

# Neutral frame is looking directly at camera at the end
neutral_frame_idx = total_frames - 1
print(f"Using frame {neutral_frame_idx} for center.webp")

# Measure head angle for all frames
frame_data = []

for idx, f in enumerate(frames):
    crop = f[120:580, 380:880]
    b_crop = crop[:, :, 0].astype(float)
    g_crop = crop[:, :, 1].astype(float)
    r_crop = crop[:, :, 2].astype(float)
    
    # Non-destructive threshold for dark red background
    bg_mask = (b_crop < 55) & (g_crop < 55) & (r_crop > 100)
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

print("Step 2: Mapping 64 circular trajectory frames + center.webp...")
frames_to_save = {}
frames_to_save['center.webp'] = frames[neutral_frame_idx]

for i in range(64):
    target_deg = (i * 360.0 / 64.0) % 360.0
    best_item = min(frame_data, key=lambda d: abs((d['deg'] - target_deg + 180) % 360 - 180))
    frames_to_save[f"frame_{i}.webp"] = frames[best_item['frame']]

print("Step 3: Performing non-destructive background keying (preserving 100% hair, skin, clothes)...")
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))

for filename, frame in frames_to_save.items():
    b = frame[:, :, 0].astype(float)
    g = frame[:, :, 1].astype(float)
    r = frame[:, :, 2].astype(float)
    
    # Background threshold
    bg_mask = (b < 55) & (g < 55) & (r > 100)
    fg_mask = (~bg_mask).astype(np.uint8) * 255
    
    # Clean noise inside subject
    fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_CLOSE, kernel)
    
    # Smooth edge slightly
    alpha = cv2.GaussianBlur(fg_mask, (3, 3), 0)
    
    # Merge BGRA
    bgra = cv2.merge([frame[:, :, 0], frame[:, :, 1], frame[:, :, 2], alpha])
    cv2.imwrite(f"public/frames/{filename}", bgra, [cv2.IMWRITE_WEBP_QUALITY, 96])

print("Completed processing new video into 65 transparent frames!")
