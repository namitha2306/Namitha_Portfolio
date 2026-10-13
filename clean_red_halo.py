import cv2
import numpy as np
import glob

def remove_red_fringe(filepath):
    # Read BGRA image
    img = cv2.imread(filepath, cv2.IMREAD_UNCHANGED)
    if img is None or img.shape[2] != 4:
        return
        
    b, g, r, a = cv2.split(img)
    
    # Red background color was B=7.5, G=11, R=239
    # Red spill condition: high red relative to blue & green
    # e.g., R > G + 40 and R > B + 40
    red_spill_mask = (r.astype(int) > g.astype(int) + 35) & (r.astype(int) > b.astype(int) + 35)
    
    # For semi-transparent edge pixels (alpha < 240) where red spill occurs:
    # Reduce alpha or desaturate red channel so edge matches natural hair/skin/dark theme
    edge_spill = red_spill_mask & (a > 0) & (a < 235)
    
    # Adjust edge alpha: tighten boundary
    a[edge_spill] = np.clip(a[edge_spill].astype(float) * 0.4, 0, 255).astype(np.uint8)
    
    # Also desaturate red channel on edge spill pixels: set R to max(G, B)
    r[edge_spill] = np.maximum(g[edge_spill], b[edge_spill])
    
    # Also fix full opaque pixels right on the border that still have bright red spill
    border_red = red_spill_mask & (a >= 235) & (g < 100) & (b < 100)
    # Reduce alpha of these pure background bleed pixels
    a[border_red] = 0
    
    cleaned = cv2.merge([b, g, r, a])
    cv2.imwrite(filepath, cleaned, [cv2.IMWRITE_WEBP_QUALITY, 96])

print("Cleaning red fringe and red shadow bleed from WebP frames...")
files = glob.glob("public/frames/*.webp")
for f in files:
    remove_red_fringe(f)

print(f"Cleaned {len(files)} WebP frames successfully!")
