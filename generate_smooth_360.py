import cv2
import numpy as np
import math

# Read video frames
cap = cv2.VideoCapture("public/character.mp4")
frames = []
while True:
    ret, f = cap.read()
    if not ret:
        break
    frames.append(f)
cap.release()

bg_bgr = np.array([7.5, 11.0, 239.0], dtype=float)

# We want 64 frames covering target angles [0, 5.625, 11.25, ..., 354.375]
# Let's map key video frames to exact angles:
# Angle 0°   (RIGHT):      Frame 44
# Angle 45°  (DOWN-RIGHT): Frame 47
# Angle 90°  (DOWN):       Frame 50
# Angle 135° (DOWN-LEFT):  Frame 52
# Angle 180° (LEFT):       Frame 54
# Angle 225° (UP-LEFT):    Frame 76
# Angle 270° (UP):         Frame 121
# Angle 315° (UP-RIGHT):   Frame 170
# Angle 360° (RIGHT):      Frame 44

key_points = [
    (0.0, 44),
    (45.0, 47),
    (90.0, 50),
    (135.0, 52),
    (180.0, 54),
    (225.0, 76),
    (270.0, 121),
    (315.0, 170),
    (360.0, 44 + len(frames)) # wrap around
]

def get_interpolated_frame(angle_deg):
    angle_deg = angle_deg % 360.0
    
    # Find segment in key_points
    for i in range(len(key_points) - 1):
        a1, f1 = key_points[i]
        a2, f2 = key_points[i+1]
        
        if a1 <= angle_deg <= a2:
            t = (angle_deg - a1) / (a2 - a1)
            # Frame position
            f_pos = f1 + t * (f2 - f1)
            idx1 = int(math.floor(f_pos)) % len(frames)
            idx2 = int(math.ceil(f_pos)) % len(frames)
            alpha = f_pos - math.floor(f_pos)
            
            if idx1 == idx2 or alpha < 0.01:
                return frames[idx1]
            elif alpha > 0.99:
                return frames[idx2]
            else:
                # Smooth alpha blend between adjacent video frames
                img1 = frames[idx1].astype(float)
                img2 = frames[idx2].astype(float)
                blended = (1.0 - alpha) * img1 + alpha * img2
                return np.clip(blended, 0, 255).astype(np.uint8)
                
    return frames[key_points[0][1] % len(frames)]

print("Generating 64 smooth WebP frames with interpolated trajectory...")
for i in range(64):
    target_angle = i * 360.0 / 64.0
    frame_img = get_interpolated_frame(target_angle)
    cv2.imwrite(f"public/frames/frame_{i}.webp", frame_img, [cv2.IMWRITE_WEBP_QUALITY, 95])

print("Done generating 64 smooth frames!")
