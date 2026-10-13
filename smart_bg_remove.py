"""
Smart white background removal using multiple techniques combined:
1. Flood-fill from edges to find connected white background
2. Closing operations to fill enclosed regions (person silhouette)  
3. Matting at edges using gradient analysis
4. Preserve skin, hair, clothing colors
"""

import cv2
import numpy as np
import os

INPUT_DIR = "public/frames"
OUTPUT_DIR = "public/frames_alpha"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def smart_remove_bg(img_bgr, debug_name=""):
    h, w = img_bgr.shape[:2]
    
    # Step 1: Flood-fill from ALL boundary pixels to find connected background
    # The background is a very uniform white area connected to the edges
    
    # Create a slightly darkened gray version for flood-fill sensitivity
    # (to handle any slight brightness variation near edges)
    fill_img = img_bgr.copy()
    flood_mask = np.zeros((h + 2, w + 2), dtype=np.uint8)
    
    # Sample edge pixels to find background color
    # Fill from multiple points along all 4 edges
    edge_points = []
    step = 10
    for x in range(0, w, step):
        edge_points += [(x, 0), (x, h-1)]
    for y in range(0, h, step):
        edge_points += [(0, y), (w-1, y)]
    
    tol = 15  # How similar background pixels need to be to connect
    for pt in edge_points:
        px, py = pt
        if 0 <= px < w and 0 <= py < h:
            cv2.floodFill(fill_img, flood_mask, (px, py), (128, 128, 128),
                          loDiff=(tol, tol, tol),
                          upDiff=(tol, tol, tol),
                          flags=cv2.FLOODFILL_MASK_ONLY | (1 << 8))
    
    # The flood mask now has 1 where background is
    connected_bg = flood_mask[1:-1, 1:-1]  # Remove the border padding
    
    # Step 2: The foreground is everything NOT in the connected background
    fg_initial = (connected_bg == 0).astype(np.uint8) * 255
    
    # Step 3: Fill any holes in the foreground mask
    # (areas of white inside the person - like white clothing interior)
    # Use flood fill from the outside edges of the FOREGROUND mask to find holes
    # 
    # Better approach: Use contour filling
    # Find the outer contour of the foreground and fill it completely
    
    contours, _ = cv2.findContours(fg_initial, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        # Fallback: return original image with full opacity
        img_rgba = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2BGRA)
        return img_rgba
    
    # Sort by area, keep the largest one (the person)
    contours_by_area = sorted(contours, key=cv2.contourArea, reverse=True)
    
    # Create a mask from the largest contour(s) - fill solidly
    filled_mask = np.zeros((h, w), dtype=np.uint8)
    
    # Take top 3 contours (in case hair/clothing splits into multiple parts)
    for cnt in contours_by_area[:5]:
        area = cv2.contourArea(cnt)
        if area > 500:  # Only keep significant contours
            cv2.drawContours(filled_mask, [cnt], 0, 255, cv2.FILLED)
    
    # Step 4: Also add back the initially detected foreground pixels that might 
    # be inside white-clothing regions (they'd have subtle texture, not pure white)
    # Combine: filled contour OR initial foreground
    fg_combined = np.maximum(filled_mask, fg_initial)
    
    # Step 5: Clean up - morphological close to fill small gaps
    kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    fg_closed = cv2.morphologyEx(fg_combined, cv2.MORPH_CLOSE, kernel_close, iterations=2)
    
    # Step 6: Remove any remaining isolated small background islands inside person
    # Fill holes in the closed mask
    fg_filled = fg_closed.copy()
    h_fill, w_fill = fg_filled.shape
    flood_for_holes = np.zeros((h_fill + 2, w_fill + 2), dtype=np.uint8)
    fill_copy = (255 - fg_filled)  # Invert: holes are now foreground
    cv2.floodFill(fill_copy, flood_for_holes, (0, 0), 0)  # Fill from corner = background
    # Remaining 255 pixels are holes inside the person
    interior_holes = fill_copy
    fg_filled = np.maximum(fg_filled, interior_holes)
    
    # Step 7: Soft edge matting
    # At the boundary between fg and bg, create a gradient alpha
    # to smoothly blend hair strands into the background
    
    # Erode and dilate to find the edge transition zone
    k_edge = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    fg_eroded = cv2.erode(fg_filled, k_edge, iterations=1)
    fg_dilated = cv2.dilate(fg_filled, k_edge, iterations=1)
    edge_zone = fg_dilated - fg_eroded  # The transition zone
    
    # In the edge zone, use luminance to determine alpha
    # Very bright pixels in edge zone → more transparent
    # Darker pixels in edge zone → more opaque (they're likely hair or real foreground)
    
    # Calculate luminance
    b = img_bgr[:,:,0].astype(float)
    g = img_bgr[:,:,1].astype(float)
    r = img_bgr[:,:,2].astype(float)
    luminance = (0.299 * r + 0.587 * g + 0.114 * b)  # [0, 255]
    
    # In the edge zone:
    # lum > 240: almost certainly background → alpha = 0
    # lum < 180: likely person pixel (hair, shadow) → alpha = 1
    # In between: gradient
    edge_alpha_from_lum = np.clip((240.0 - luminance) / (240.0 - 160.0), 0, 1)
    
    # Base alpha from the filled mask
    base_alpha = fg_filled.astype(float) / 255.0
    
    # In the edge zone, blend between base alpha and luminance-based alpha
    edge_weight = edge_zone.astype(float) / 255.0
    # In edge zone: use min of base_alpha and luminance-based alpha
    # This removes near-white fringe pixels while keeping dark edge pixels
    blended_alpha = base_alpha * (1.0 - edge_weight) + \
                    np.minimum(base_alpha, edge_alpha_from_lum) * edge_weight
    
    # Step 8: Final smoothing of alpha to remove jagged edges
    blended_alpha_smooth = cv2.GaussianBlur(blended_alpha.astype(np.float32), (3, 3), 0.8)
    
    # Combine: keep strong interior pixels, smooth edge zone
    interior_zone = (fg_eroded > 0).astype(float)
    final_alpha = blended_alpha * interior_zone + blended_alpha_smooth * (1.0 - interior_zone)
    final_alpha = np.clip(final_alpha, 0, 1)
    
    # Step 9: Create output BGRA image
    img_rgba = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2BGRA)
    img_rgba[:, :, 3] = (final_alpha * 255).astype(np.uint8)
    
    return img_rgba


def process_all():
    files = sorted([f for f in os.listdir(INPUT_DIR) 
                   if f.endswith('.webp') and not f.startswith('test_')])
    print(f"Processing {len(files)} frames with smart BG removal...")
    
    failed = 0
    for i, fname in enumerate(files):
        input_path = os.path.join(INPUT_DIR, fname)
        output_path = os.path.join(OUTPUT_DIR, fname)
        
        img = cv2.imread(input_path, cv2.IMREAD_COLOR)
        if img is None:
            print(f"  !! Can't read: {fname}")
            failed += 1
            continue
        
        rgba = smart_remove_bg(img, fname)
        
        # Check if result is reasonable (should have significant foreground)
        alpha_channel = rgba[:, :, 3]
        fg_ratio = np.sum(alpha_channel > 128) / (img.shape[0] * img.shape[1])
        
        if fg_ratio < 0.02 or fg_ratio > 0.98:
            print(f"  WARNING {fname}: fg_ratio={fg_ratio:.2%} (suspicious!)")
        
        cv2.imwrite(output_path, rgba, [cv2.IMWRITE_WEBP_QUALITY, 90])
        
        if i % 10 == 0:
            print(f"  [{i+1}/{len(files)}] {fname} - fg={fg_ratio:.1%}")
    
    print(f"\nDone! {len(files) - failed} frames saved to {OUTPUT_DIR}/")


if __name__ == '__main__':
    process_all()
