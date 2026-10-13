"""
Definitive white background removal using:
1. FloodFill from edges → finds connected background
2. Morphological CLOSE with large kernel → fills interior holes (white clothing)
3. Binary fill holes → fills any remaining interior holes  
4. Edge feathering using distance transform
"""

import cv2
import numpy as np
import os

INPUT_DIR = "public/frames"
OUTPUT_DIR = "public/frames_alpha"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def fill_holes(binary_mask):
    """Fill all interior holes in a binary mask using flood fill from exterior."""
    h, w = binary_mask.shape
    # Create inverted mask
    inv = (255 - binary_mask).astype(np.uint8)
    # Flood fill from corner of inverted mask
    flood = inv.copy()
    mask = np.zeros((h + 2, w + 2), dtype=np.uint8)
    cv2.floodFill(flood, mask, (0, 0), 0)
    # Remaining white in flood = interior holes
    interior_holes = flood
    # Add holes back to original mask
    return np.maximum(binary_mask, interior_holes)


def remove_bg(img_bgr):
    h, w = img_bgr.shape[:2]
    
    # === STEP 1: Find connected white background via flood fill from all 4 edges ===
    fill_img = img_bgr.copy()
    flood_mask = np.zeros((h + 2, w + 2), dtype=np.uint8)
    
    # Fill from dense grid of edge points
    tolerance = 22  # Allows for slight JPEG compression artifacts
    edge_points = []
    step = 5  # Dense sampling
    for x in range(0, w, step):
        edge_points += [(x, 0), (x, h-1)]
    for y in range(0, h, step):
        edge_points += [(0, y), (w-1, y)]
    
    for (px, py) in edge_points:
        px = min(px, w-1)
        py = min(py, h-1)
        cv2.floodFill(fill_img, flood_mask, (px, py), (128, 128, 128),
                      loDiff=(tolerance, tolerance, tolerance),
                      upDiff=(tolerance, tolerance, tolerance),
                      flags=cv2.FLOODFILL_MASK_ONLY | (1 << 8))
    
    # Flood mask: 1 = background, 0 = foreground or enclosed white
    connected_bg = flood_mask[1:-1, 1:-1]
    
    # Initial foreground: everything NOT connected to background
    fg_raw = ((connected_bg == 0).astype(np.uint8)) * 255
    
    # === STEP 2: Morphological operations to get solid person silhouette ===
    
    # Large close operation to bridge gaps across white clothing areas
    # Using ellipse kernel of size 80 to bridge large white shirt areas
    kernel_L = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (60, 60))
    fg_dilated = cv2.dilate(fg_raw, kernel_L, iterations=1)
    fg_closed = cv2.erode(fg_dilated, kernel_L, iterations=1)
    
    # Also do a smaller close to catch finer gaps
    kernel_S = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (20, 20))
    fg_closed = cv2.morphologyEx(fg_closed, cv2.MORPH_CLOSE, kernel_S, iterations=3)
    
    # === STEP 3: Fill ALL interior holes (white interior of clothing, etc.) ===
    fg_filled = fill_holes(fg_closed)
    
    # === STEP 4: Keep only the largest connected component (the person) ===
    n_labels, labels, stats, _ = cv2.connectedComponentsWithStats(fg_filled, connectivity=8)
    if n_labels > 1:
        areas = stats[1:, cv2.CC_STAT_AREA]
        largest = np.argmax(areas) + 1
        fg_person = (labels == largest).astype(np.uint8) * 255
    else:
        fg_person = fg_filled
    
    # === STEP 5: Refine edges using original fg_raw pixels at boundary ===
    # The person mask from closing may include a bit of background at edges
    # Erode slightly to tighten
    k_tight = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    fg_tightened = cv2.erode(fg_person, k_tight, iterations=1)
    
    # === STEP 6: Edge matting using distance transform + luminance ===
    # Compute distance from foreground edge (inward distance)
    dist_inside = cv2.distanceTransform(fg_tightened, cv2.DIST_L2, 5)
    dist_outside = cv2.distanceTransform(255 - fg_tightened, cv2.DIST_L2, 5)
    
    # Create smooth alpha using distance
    # Pixels close to the edge get gradient alpha
    edge_width = 8  # pixels of feathering
    alpha_dist = np.clip(dist_inside / edge_width, 0, 1)
    
    # === STEP 7: At the very edge, also use luminance to refine hair strands ===
    # Compute luminance
    lum = (0.299 * img_bgr[:,:,2].astype(float) + 
           0.587 * img_bgr[:,:,1].astype(float) + 
           0.114 * img_bgr[:,:,0].astype(float))
    
    # Near the edge: dark pixels (hair) should stay, bright pixels (fringe) should fade
    edge_zone = (dist_inside < edge_width) & (fg_tightened > 0)
    edge_zone = edge_zone | (dist_outside < edge_width * 0.5)
    
    # Alpha from luminance in edge zone: dark=1, bright=0
    # threshold range: 170 (dark) to 240 (bright white)
    lum_alpha = np.clip((240.0 - lum) / (240.0 - 170.0), 0, 1)
    
    # Combine: in edge zone, use minimum of distance-based and luminance-based alpha
    final_alpha = alpha_dist.copy()
    edge_zone_mask = edge_zone.astype(float)
    final_alpha = alpha_dist * (1.0 - edge_zone_mask) + \
                  np.minimum(alpha_dist, lum_alpha) * edge_zone_mask
    
    # Smooth the final alpha slightly
    final_alpha = cv2.GaussianBlur(final_alpha.astype(np.float32), (3, 3), 0.7)
    final_alpha = np.clip(final_alpha, 0, 1)
    
    # === STEP 8: Create BGRA output ===
    img_rgba = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2BGRA)
    img_rgba[:, :, 3] = (final_alpha * 255).astype(np.uint8)
    
    return img_rgba


def process_all():
    files = sorted([f for f in os.listdir(INPUT_DIR) 
                   if f.endswith('.webp') and not f.startswith('test_')])
    print(f"Processing {len(files)} frames...")
    
    for i, fname in enumerate(files):
        in_path = os.path.join(INPUT_DIR, fname)
        out_path = os.path.join(OUTPUT_DIR, fname)
        
        img = cv2.imread(in_path, cv2.IMREAD_COLOR)
        if img is None:
            print(f"  !! Can't read: {fname}")
            continue
        
        rgba = remove_bg(img)
        
        alpha = rgba[:, :, 3]
        fg_pct = np.sum(alpha > 128) / alpha.size
        
        cv2.imwrite(out_path, rgba, [cv2.IMWRITE_WEBP_QUALITY, 92])
        
        if i % 10 == 0 or fg_pct < 0.05:
            print(f"  [{i+1}/{len(files)}] {fname} - fg={fg_pct:.1%}")
    
    print(f"\nDone! Saved {len(files)} frames to {OUTPUT_DIR}/")


if __name__ == '__main__':
    process_all()
