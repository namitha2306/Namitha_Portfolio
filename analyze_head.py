import cv2
import numpy as np

cap = cv2.VideoCapture("public/character.mp4")
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

# We can track features on the face/head or measure brightness / color distribution / optical flow
# Let's crop head region around x: 380..880, y: 100..600
frames_data = []

# First frame face bounding box center
# Let's track facial features or Template matching of face center
prev_gray = None

for i in range(total_frames):
    ret, frame = cap.read()
    if not ret:
        break
    
    # Head region
    head_crop = frame[150:550, 400:850]
    gray = cv2.cvtColor(head_crop, cv2.COLOR_BGR2GRAY)
    
    # Calculate center of mass of non-background (foreground mask)
    # Background color is reddish around BGR ~ [6, 10, 242]
    # Red channel high, Green/Blue low
    diff_bg = np.abs(head_crop.astype(float) - np.array([6, 10, 242])).sum(axis=2)
    fg_mask = (diff_bg > 60).astype(np.uint8) * 255
    
    # Find moments of foreground mask or facial skin / dark features (hair, eyes, mouth)
    # Skin / hair features diff
    moments = cv2.moments(fg_mask)
    if moments["m00"] != 0:
        cx = moments["m10"] / moments["m00"]
        cy = moments["m01"] / moments["m00"]
    else:
        cx, cy = 0, 0
        
    # Dark features inside head (eyes, eyebrows, mouth, nose shadow, hair)
    dark_mask = (gray < 80).astype(np.uint8) * 255
    dmoments = cv2.moments(dark_mask)
    if dmoments["m00"] != 0:
        dcx = dmoments["m10"] / dmoments["m00"]
        dcy = dmoments["m01"] / dmoments["m00"]
    else:
        dcx, dcy = 0, 0
        
    frames_data.append({
        'frame': i,
        'cx': cx, 'cy': cy,
        'dcx': dcx, 'dcy': dcy
    })

cap.release()

print(f"Analyzed {len(frames_data)} frames.")
for step in range(0, total_frames, 10):
    d = frames_data[step]
    print(f"Frame {d['frame']:03d}: Head FG center=({d['cx']:.1f}, {d['cy']:.1f}), Dark center=({d['dcx']:.1f}, {d['dcy']:.1f})")
