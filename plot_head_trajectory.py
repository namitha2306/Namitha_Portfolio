import cv2
import numpy as np
import math

# Load all frames, extract facial region and find feature displacement
# Let's use template matching of nose/mouth/eyes from a neutral frame, or optical flow / skin centroid vs dark feature centroid

frames_info = []

# Baseline neutral frame center of dark features (eyes, eyebrows, mouth)
# Let's inspect frame by frame
for f in range(240):
    img = cv2.imread(f"temp_frames/frame_{f:03d}.jpg")
    head_crop = img[150:550, 400:850] # 400x450
    
    # Red background mask
    # Background color ~ BGR [6, 10, 242]
    diff_bg = np.abs(head_crop.astype(float) - np.array([6, 10, 242])).sum(axis=2)
    fg_mask = (diff_bg > 50).astype(np.uint8) * 255
    
    # Face skin mask: high G/R relative to B, low B
    # Skin area: B < 150, G < 200, R > 150
    skin_mask = ((head_crop[:,:,0] < 160) & (head_crop[:,:,1] > 60) & (head_crop[:,:,2] > 140)).astype(np.uint8) * 255
    
    # Moments of skin mask
    m_skin = cv2.moments(skin_mask)
    if m_skin["m00"] > 0:
        skin_x = m_skin["m10"] / m_skin["m00"]
        skin_y = m_skin["m01"] / m_skin["m00"]
    else:
        skin_x, skin_y = 225, 200
        
    # Moments of facial dark features (eyes, nostrils, mouth) inside skin area
    gray = cv2.cvtColor(head_crop, cv2.COLOR_BGR2GRAY)
    dark_in_skin = ((gray < 100) & (skin_mask > 0)).astype(np.uint8) * 255
    m_dark = cv2.moments(dark_in_skin)
    if m_dark["m00"] > 0:
        dark_x = m_dark["m10"] / m_dark["m00"]
        dark_y = m_dark["m01"] / m_dark["m00"]
    else:
        dark_x, dark_y = skin_x, skin_y
        
    frames_info.append({
        'frame': f,
        'skin_x': skin_x, 'skin_y': skin_y,
        'dark_x': dark_x, 'dark_y': dark_y
    })

# Compute reference center (average across frames or neutral frame)
avg_skin_x = np.mean([info['skin_x'] for info in frames_info])
avg_skin_y = np.mean([info['skin_y'] for info in frames_info])

for info in frames_info:
    # Displacement of face features relative to head skin center
    dx = info['dark_x'] - info['skin_x']
    dy = info['dark_y'] - info['skin_y']
    # Calculate angle in degrees [-180, 180]
    angle_rad = math.atan2(dy, dx)
    angle_deg = math.degrees(angle_rad)
    info['dx'] = dx
    info['dy'] = dy
    info['angle_deg'] = angle_deg

# Print frame summary every 5 frames
print(f"Index |  dx   |  dy   | Angle (deg)")
print("-----------------------------------")
for info in frames_info[::5]:
    print(f"{info['frame']:03d}   | {info['dx']:+5.1f} | {info['dy']:+5.1f} | {info['angle_deg']:+7.1f}°")
