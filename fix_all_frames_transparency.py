import cv2
import numpy as np
import glob

print("Fixing transparency for all WebP frames by keying out light grey background (B>200, G>200, R>200)...")

files = glob.glob("public/frames/*.webp")

kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))

for f in files:
    img = cv2.imread(f, cv2.IMREAD_COLOR)
    if img is None:
        continue
        
    b = img[:, :, 0].astype(float)
    g = img[:, :, 1].astype(float)
    r = img[:, :, 2].astype(float)
    
    # Light grey background threshold: B > 200, G > 200, R > 200
    bg_mask = (b > 200) & (g > 200) & (r > 200)
    
    # Subject mask is everywhere NOT bg_mask
    fg_mask = (~bg_mask).astype(np.uint8) * 255
    
    # Fill internal subject holes (eyes, highlights) using morphological close
    fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_CLOSE, kernel)
    
    # Gaussian blur only on border for subtle smooth anti-aliasing
    alpha = cv2.GaussianBlur(fg_mask, (3, 3), 0)
    
    # Create transparent BGRA
    bgra = cv2.merge([img[:, :, 0], img[:, :, 1], img[:, :, 2], alpha])
    cv2.imwrite(f, bgra, [cv2.IMWRITE_WEBP_QUALITY, 96])

print(f"Successfully processed {len(files)} WebP frames!")
