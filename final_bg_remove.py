"""
FINAL background removal using HSV saturation + flood fill hybrid:
- Background: S < threshold (near-white/gray)
- Person: S >= threshold (colored skin, hair, clothing)
- Hole filling to handle white clothing interior
"""

import cv2
import numpy as np
import os

INPUT_DIR = "public/frames"
OUTPUT_DIR = "public/frames_alpha"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def fill_mask_holes(mask):
    """Fill all interior holes in a binary mask."""
    h, w = mask.shape
    inv = (255 - mask).astype(np.uint8)
    flood = inv.copy()
    seed_mask = np.zeros((h + 2, w + 2), dtype=np.uint8)
    cv2.floodFill(flood, seed_mask, (0, 0), 128)
    # Pixels that stayed 255 in flood = interior holes
    interior = (flood == 255).astype(np.uint8) * 255
    return np.maximum(mask, interior)


def remove_bg_hsv(img_bgr, fname=""):
    h, w = img_bgr.shape[:2]
    
    # === Step 1: HSV saturation-based foreground detection ===
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    s_channel = hsv[:, :, 1]
    v_channel = hsv[:, :, 2]
    
    # Background: very white = high V, very low S
    # Threshold: S < 20 AND V > 200 → background
    is_bg_hsv = (s_channel < 20) & (v_channel > 180)
    
    # Also detect off-white/slightly colored backgrounds using luminance
    b = img_bgr[:,:,0].astype(float)
    g = img_bgr[:,:,1].astype(float)
    r = img_bgr[:,:,2].astype(float)
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    is_bg_lum = lum > 235  # Very bright = background
    
    # Combined background detection (either condition)
    # But use only connected background (flood fill from edges)
    is_bg_initial = (is_bg_hsv | is_bg_lum).astype(np.uint8) * 255
    
    # === Step 2: Flood fill from all edges to find CONNECTED background only ===
    # This prevents removing bright areas inside the person
    bg_flood = is_bg_initial.copy()
    seed_mask = np.zeros((h + 2, w + 2), dtype=np.uint8)
    step = 5
    
    for x in range(0, w, step):
        cv2.floodFill(bg_flood, seed_mask, (min(x, w-1), 0), 128,
                      loDiff=10, upDiff=10)
        cv2.floodFill(bg_flood, seed_mask, (min(x, w-1), h-1), 128,
                      loDiff=10, upDiff=10)
    for y in range(0, h, step):
        cv2.floodFill(bg_flood, seed_mask, (0, min(y, h-1)), 128,
                      loDiff=10, upDiff=10)
        cv2.floodFill(bg_flood, seed_mask, (w-1, min(y, h-1)), 128,
                      loDiff=10, upDiff=10)
    
    connected_bg = (bg_flood == 128).astype(np.uint8) * 255
    
    # Foreground = NOT connected background
    fg_initial = 255 - connected_bg
    
    # === Step 3: Morphological closing to bridge gaps in hair/clothing ===
    # Use moderate kernel (30px) - enough to bridge fine hair strands
    kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (30, 30))
    fg_closed = cv2.morphologyEx(fg_initial, cv2.MORPH_CLOSE, kernel_close, iterations=2)
    
    # === Step 4: Fill interior holes (white clothing/skin areas inside person) ===
    fg_filled = fill_mask_holes(fg_closed)
    
    # === Step 5: Keep only largest component (the person) ===
    n_labels, labels, stats, _ = cv2.connectedComponentsWithStats(fg_filled, connectivity=8)
    if n_labels > 1:
        areas = stats[1:, cv2.CC_STAT_AREA]
        # Keep largest blob
        largest = np.argmax(areas) + 1
        fg_person = (labels == largest).astype(np.uint8) * 255
        
        # Also keep blobs that are > 5% of largest (might be hair strands)
        max_area = areas[largest - 1]
        for label in range(1, n_labels):
            if label != largest and stats[label, cv2.CC_STAT_AREA] > max_area * 0.1:
                fg_person = np.maximum(fg_person, (labels == label).astype(np.uint8) * 255)
    else:
        fg_person = fg_filled
    
    # Another round of hole filling after blob selection
    fg_person = fill_mask_holes(fg_person)
    
    # === Step 6: Create smooth alpha using distance transform + edge matting ===
    # Distance transform gives how far each fg pixel is from the boundary
    dist = cv2.distanceTransform(fg_person, cv2.DIST_L2, 5)
    
    # Smooth transition at edges (feather over 6 pixels)
    edge_feather = 6.0
    alpha_from_dist = np.clip(dist / edge_feather, 0, 1)
    
    # At the very edge, also use saturation to preserve hair (high S) and remove white fringe (low S)
    edge_zone = (dist < edge_feather * 1.5) & (fg_person > 0)
    
    # In the edge zone: high S = keep (hair), low S = remove (white fringe)
    s_norm = np.clip(s_channel.astype(float) / 40.0, 0, 1)  # 0-40 saturation = 0-1 alpha weight
    
    final_alpha = alpha_from_dist.copy()
    final_alpha[edge_zone] = np.minimum(alpha_from_dist[edge_zone], 
                                         np.maximum(s_norm[edge_zone], 0.3))
    
    # Smooth the alpha
    final_alpha = cv2.GaussianBlur(final_alpha.astype(np.float32), (5, 5), 1.0)
    final_alpha = np.clip(final_alpha, 0, 1)
    
    # === Step 7: Create BGRA output ===
    img_rgba = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2BGRA)
    img_rgba[:, :, 3] = (final_alpha * 255).astype(np.uint8)
    
    fg_pct = np.mean(final_alpha > 0.5) * 100
    return img_rgba, fg_pct


def process_all():
    files = sorted([f for f in os.listdir(INPUT_DIR) 
                   if f.endswith('.webp') and not f.startswith('test_')])
    print(f"Processing {len(files)} frames with HSV-based BG removal...")
    
    for i, fname in enumerate(files):
        in_path = os.path.join(INPUT_DIR, fname)
        out_path = os.path.join(OUTPUT_DIR, fname)
        
        img = cv2.imread(in_path, cv2.IMREAD_COLOR)
        if img is None:
            print(f"  !! Can't read: {fname}")
            continue
        
        rgba, fg_pct = remove_bg_hsv(img, fname)
        cv2.imwrite(out_path, rgba, [cv2.IMWRITE_WEBP_QUALITY, 92])
        
        if i % 10 == 0 or fg_pct < 3:
            print(f"  [{i+1}/{len(files)}] {fname} - fg={fg_pct:.1f}%")
    
    print(f"\nDone! Saved to {OUTPUT_DIR}/")


if __name__ == '__main__':
    process_all()
