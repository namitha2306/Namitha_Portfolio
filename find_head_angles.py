import cv2
import numpy as np
import math

# Load video
cap = cv2.VideoCapture("public/character.mp4")
frames = []
while True:
    ret, f = cap.read()
    if not ret:
        break
    frames.append(f)
cap.release()

total_f = len(frames)

# Background color in BGR: [6, 10, 242]
bg = np.array([6, 10, 242], dtype=float)

# Center frame (neutral) is frame 239
neutral_frame = frames[239]

# We track the relative position of face features (eyes, nose, mouth) relative to the head outline center.
results = []

for idx, frame in enumerate(frames):
    crop = frame[150:550, 400:850] # 400x450
    diff = np.abs(crop.astype(float) - bg).sum(axis=2)
    fg_mask = (diff > 50).astype(np.uint8)
    
    # Head outline centroid
    m_fg = cv2.moments(fg_mask)
    if m_fg["m00"] > 0:
        head_cx = m_fg["m10"] / m_fg["m00"]
        head_cy = m_fg["m01"] / m_fg["m00"]
    else:
        head_cx, head_cy = 225.0, 200.0
        
    # Dark facial features (eyes, eyebrows, nostrils, mouth) inside head mask
    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    dark_mask = ((gray < 90) & (fg_mask > 0)).astype(np.uint8)
    
    m_dark = cv2.moments(dark_mask)
    if m_dark["m00"] > 0:
        face_cx = m_dark["m10"] / m_dark["m00"]
        face_cy = m_dark["m01"] / m_dark["m00"]
    else:
        face_cx, face_cy = head_cx, head_cy
        
    # Vector from head center to face features
    dx = face_cx - head_cx
    dy = face_cy - head_cy
    
    # Standard angle atan2(dy, dx) in degrees
    # dy > 0 is DOWN in image coordinates
    # dx > 0 is RIGHT in image coordinates
    angle_rad = math.atan2(dy, dx)
    angle_deg = math.degrees(angle_rad) # [-180, 180]
    if angle_deg < 0:
        angle_deg_360 = angle_deg + 360
    else:
        angle_deg_360 = angle_deg
        
    results.append({
        'frame': idx,
        'head_cx': head_cx, 'head_cy': head_cy,
        'face_cx': face_cx, 'face_cy': face_cy,
        'dx': dx, 'dy': dy,
        'angle_deg': angle_deg,
        'angle_360': angle_deg_360,
        'mag': math.hypot(dx, dy)
    })

# Print out angle trajectory
print("Frame | dx     | dy     | Mag   | Angle (-180..180) | Angle (0..360)")
print("-" * 65)
for r in results[::10]:
    print(f"{r['frame']:03d}   | {r['dx']:+6.2f} | {r['dy']:+6.2f} | {r['mag']:5.2f} | {r['angle_deg']:+7.1f}°         | {r['angle_360']:5.1f}°")

