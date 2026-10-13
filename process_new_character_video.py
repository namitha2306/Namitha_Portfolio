import cv2
import numpy as np
import math
import os
import glob

print("Step 1: Inspecting new character.mp4 video...")
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
neutral_frame_idx = len(frames) - 1
print(f"Using frame {neutral_frame_idx} for center.webp")

# Measure head angle for all frames
# Head crop box: y: 120..580, x: 380..880
frame_data = []

for idx, f in enumerate(frames):
    crop = f[120:580, 380:880]
    diff = np.abs(crop.astype(float) - avg_bg_bgr).sum(axis=2)
    fg_mask = (diff > 45).astype(np.uint8)
    
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

print("Step 2: Mapping 64 circular trajectory frames...")
# Generate 64 WebP frames
frames_to_save = {}
# Center image
frames_to_save['center.webp'] = frames[neutral_frame_idx]

for i in range(64):
    target_deg = (i * 360.0 / 64.0) % 360.0
    best_item = min(frame_data, key=lambda d: abs((d['deg'] - target_deg + 180) % 360 - 180))
    frames_to_save[f"frame_{i}.webp"] = frames[best_item['frame']]

print("Step 3: Keying out background & removing edge halo...")
for filename, img_bgr in frames_to_save.items():
    h, w, c = img_bgr.shape
    
    # Distance to background color
    diff = np.abs(img_bgr.astype(float) - avg_bg_bgr).sum(axis=2)
    
    # Smooth alpha mask
    alpha = np.clip((diff - 35.0) / (75.0 - 35.0), 0.0, 1.0) * 255.0
    alpha = alpha.astype(np.uint8)
    
    b, g, r = cv2.split(img_bgr)
    
    # Red background spill removal
    red_spill = (r.astype(int) > g.astype(int) + 30) & (r.astype(int) > b.astype(int) + 30)
    
    # Adjust alpha on edge spill
    edge_spill = red_spill & (alpha > 0) & (alpha < 235)
    alpha[edge_spill] = np.clip(alpha[edge_spill].astype(float) * 0.3, 0, 255).astype(np.uint8)
    r[edge_spill] = np.maximum(g[edge_spill], b[edge_spill])
    
    # Border bleed
    border_red = red_spill & (alpha >= 235) & (g < 100) & (b < 100)
    alpha[border_red] = 0
    
    bgra = cv2.merge([b, g, r, alpha])
    cv2.imwrite(f"public/frames/{filename}", bgra, [cv2.IMWRITE_WEBP_QUALITY, 96])

print(f"Successfully processed and generated all 65 transparent frames into public/frames/!")
