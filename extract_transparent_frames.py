import cv2
import numpy as np
import glob
import os

# Target background color in BGR: [7.5, 11.0, 239.0]
bg_bgr = np.array([7.5, 11.0, 239.0], dtype=float)

def convert_to_transparent(filepath):
    img = cv2.imread(filepath, cv2.IMREAD_COLOR)
    if img is None:
        return
        
    h, w, c = img.shape
    
    # Calculate color distance to background color
    diff = np.abs(img.astype(float) - bg_bgr).sum(axis=2)
    
    # Create smooth alpha mask:
    # diff <= 30 => alpha = 0 (background)
    # diff >= 70 => alpha = 255 (foreground)
    # 30 < diff < 70 => smooth transition for anti-aliasing
    alpha = np.clip((diff - 30.0) / (70.0 - 30.0), 0.0, 1.0) * 255.0
    alpha = alpha.astype(np.uint8)
    
    # Combine BGR + Alpha -> BGRA
    bgra = np.zeros((h, w, 4), dtype=np.uint8)
    bgra[:, :, 0:3] = img
    bgra[:, :, 3] = alpha
    
    # Save as transparent WebP
    cv2.imwrite(filepath, bgra, [cv2.IMWRITE_WEBP_QUALITY, 95])

print("Converting WebP frames to transparent BGRA...")
frame_files = glob.glob("public/frames/*.webp")
for f in frame_files:
    convert_to_transparent(f)

print(f"Successfully converted {len(frame_files)} WebP frames to transparent background!")
