import cv2
import numpy as np

# Load video
cap = cv2.VideoCapture("public/character.mp4")
frames = []
while True:
    ret, f = cap.read()
    if not ret:
        break
    frames.append(f)
cap.release()

# Background color sampling
bg_bgr = np.array([6, 10, 242], dtype=float)

# We want to measure the nose tip / face center relative to head center for all 240 frames
# Let's write a script that outputs the exact head orientation trajectory
analysis = []

for idx, f in enumerate(frames):
    crop = f[150:550, 400:850] # 400x450 head region
    diff = np.abs(crop.astype(float) - bg_bgr).sum(axis=2)
    fg = (diff > 50).astype(np.uint8)
    
    # Left hair/ear vs Right hair/ear width to detect head turn left vs right
    left_half = fg[:, :225]
    right_half = fg[:, 225:]
    left_area = left_half.sum()
    right_area = right_half.sum()
    
    # Top vs Bottom area
    top_half = fg[:200, :]
    bottom_half = fg[200:, :]
    top_area = top_half.sum()
    bottom_area = bottom_half.sum()
    
    # Face skin center (R high, B low)
    skin = ((crop[:,:,2] > 150) & (crop[:,:,0] < 150)).astype(np.uint8)
    m_skin = cv2.moments(skin)
    if m_skin["m00"] > 0:
        sx = m_skin["m10"] / m_skin["m00"]
        sy = m_skin["m01"] / m_skin["m00"]
    else:
        sx, sy = 225.0, 200.0
        
    # Dark features (eyes, nose, mouth) inside skin
    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    dark = ((gray < 100) & (skin > 0)).astype(np.uint8)
    m_dark = cv2.moments(dark)
    if m_dark["m00"] > 0:
        dx = m_dark["m10"] / m_dark["m00"]
        dy = m_dark["m01"] / m_dark["m00"]
    else:
        dx, dy = sx, sy
        
    rel_x = dx - sx
    rel_y = dy - sy
    
    analysis.append((idx, rel_x, rel_y, left_area, right_area))

# Print key frame poses
print("Frame | rel_x (Left < 0 < Right) | rel_y (Up < 0 < Down)")
print("-" * 55)
for a in analysis[::12]:
    print(f"Frame {a[0]:03d}: rel_x = {a[1]:+6.2f}, rel_y = {a[2]:+6.2f} | L/R area ratio = {a[3]/max(1,a[4]):.2f}")

