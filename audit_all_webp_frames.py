import cv2
import numpy as np
import glob

files = sorted(glob.glob("public/frames/*.webp"))
print(f"Auditing {len(files)} WebP frames...")

dirty_frames = []

for f in files:
    img = cv2.imread(f, cv2.IMREAD_UNCHANGED)
    if img is None:
        continue
        
    h, w, c = img.shape
    if c != 4:
        print(f"{f} HAS NO ALPHA CHANNEL! Shape={img.shape}")
        dirty_frames.append(f)
        continue
        
    alpha = img[:, :, 3]
    bgr = img[:, :, :3]
    
    # Check top-left 30x30 corner alpha & BGR
    tl_alpha = alpha[0:30, 0:30]
    tl_bgr = bgr[0:30, 0:30]
    
    # Is top-left opaque? (alpha > 50)
    opaque_bg_pixels = (tl_alpha > 50).sum()
    if opaque_bg_pixels > 0:
        mean_bgr = tl_bgr.mean(axis=(0,1))
        print(f"{f}: {opaque_bg_pixels} top-left pixels are OPAQUE! Mean BGR={mean_bgr}")
        dirty_frames.append(f)

print(f"\nTotal dirty frames found: {len(dirty_frames)}")
