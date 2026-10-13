import cv2
import numpy as np
import os

INPUT_DIR = "public/frames"
OUTPUT_DIR = "public/frames_alpha"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def remove_bg_grabcut(img_bgr, fname):
    """
    Better background removal using GrabCut algorithm.
    The background is a uniform white area. GrabCut will properly
    segment the character (person) from the background.
    """
    h, w = img_bgr.shape[:2]
    
    # Step 1: Create initial mask using bright pixel detection
    # Background is very white/bright with low saturation
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    
    # White background: very high V (brightness), very low S (saturation)
    # For the white studio background
    bg_mask_hsv = (hsv[:,:,1] < 30) & (hsv[:,:,2] > 200)
    
    # Also detect using luminance
    img_lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2Lab)
    # White = high L, near-zero a/b
    bg_mask_lab = (img_lab[:,:,0] > 230) & (np.abs(img_lab[:,:,1].astype(int) - 128) < 8) & (np.abs(img_lab[:,:,2].astype(int) - 128) < 8)
    
    # Combined initial background mask
    bg_initial = (bg_mask_hsv | bg_mask_lab).astype(np.uint8)
    
    # Step 2: Use floodfill from corners to identify the contiguous background
    flood_img = img_bgr.copy()
    flood_mask = np.zeros((h+2, w+2), dtype=np.uint8)
    
    # Sample the corner background color
    corner_pixels = [
        img_bgr[0, 0], img_bgr[0, w-1], img_bgr[h-1, 0], img_bgr[h-1, w-1],
        img_bgr[0, w//2], img_bgr[h-1, w//2]
    ]
    
    for pt in [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1), (w//2, 0), (w//2, h-1), (0, h//2), (w-1, h//2)]:
        cv2.floodFill(flood_img, flood_mask, pt, (0, 200, 0),
                      loDiff=(20, 20, 20), upDiff=(20, 20, 20),
                      flags=cv2.FLOODFILL_MASK_ONLY | (255 << 8))
    
    connected_bg = flood_mask[1:-1, 1:-1]
    
    # Step 3: GrabCut with the flood-fill as a hint
    # Initialize GrabCut mask
    gc_mask = np.zeros((h, w), dtype=np.uint8)
    gc_mask[:] = cv2.GC_PR_FGD  # Start with probable foreground
    
    # Mark connected background corners as definite background
    gc_mask[connected_bg > 0] = cv2.GC_BGD
    
    # Find the bounding box of the foreground region for GrabCut
    fg_region = (connected_bg == 0).astype(np.uint8)
    contours, _ = cv2.findContours(fg_region, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if contours:
        # Find largest contour (the person)
        largest = max(contours, key=cv2.contourArea)
        rx, ry, rw, rh = cv2.boundingRect(largest)
        # Add padding
        pad = 20
        rx = max(0, rx - pad)
        ry = max(0, ry - pad)
        rw = min(w - rx, rw + 2*pad)
        rh = min(h - ry, rh + 2*pad)
        rect = (rx, ry, rw, rh)
        
        # Mark inside bounding box area as probable foreground
        gc_mask[ry:ry+rh, rx:rx+rw] = cv2.GC_PR_FGD
        
        # Run GrabCut
        bgd_model = np.zeros((1, 65), dtype=np.float64)
        fgd_model = np.zeros((1, 65), dtype=np.float64)
        
        try:
            cv2.grabCut(img_bgr, gc_mask, rect, bgd_model, fgd_model, 5, cv2.GC_INIT_WITH_MASK)
        except Exception as e:
            print(f"    GrabCut failed for {fname}: {e}, using flood fill only")
            gc_mask[connected_bg > 0] = cv2.GC_BGD
            gc_mask[connected_bg == 0] = cv2.GC_PR_FGD
    
    # Convert GrabCut mask to alpha
    fg_mask = np.where((gc_mask == cv2.GC_FGD) | (gc_mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    
    # Step 4: Clean up the mask
    # Close small holes
    kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_CLOSE, kernel_close, iterations=2)
    
    # Remove small disconnected islands
    n_labels, labels, stats, _ = cv2.connectedComponentsWithStats(fg_mask, connectivity=8)
    if n_labels > 1:
        # Keep only the largest component (the person)
        areas = stats[1:, cv2.CC_STAT_AREA]
        largest_label = np.argmax(areas) + 1
        clean_mask = (labels == largest_label).astype(np.uint8) * 255
        fg_mask = clean_mask
    
    # Step 5: Refine edges - feather the alpha channel at transitions
    # Find the edge zone of the mask
    eroded = cv2.erode(fg_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)), iterations=2)
    dilated = cv2.dilate(fg_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)), iterations=2)
    edge_zone = dilated - eroded
    
    # Smooth the alpha in the edge zone
    alpha = fg_mask.astype(np.float32) / 255.0
    alpha_smooth = cv2.GaussianBlur(alpha, (7, 7), 1.5)
    
    edge_weight = np.clip(edge_zone.astype(np.float32) / 255.0, 0, 1)
    final_alpha = alpha * (1.0 - edge_weight) + alpha_smooth * edge_weight
    final_alpha = np.clip(final_alpha, 0, 1)
    
    # Create BGRA image
    img_rgba = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2BGRA)
    img_rgba[:, :, 3] = (final_alpha * 255).astype(np.uint8)
    
    return img_rgba


def process_all():
    files = sorted([f for f in os.listdir(INPUT_DIR) if f.endswith('.webp') and not f.startswith('test_')])
    print(f"Found {len(files)} frames to process with GrabCut")
    
    for i, fname in enumerate(files):
        input_path = os.path.join(INPUT_DIR, fname)
        output_path = os.path.join(OUTPUT_DIR, fname)
        
        img = cv2.imread(input_path, cv2.IMREAD_COLOR)
        if img is None:
            print(f"  !! Could not read {fname}")
            continue
        
        rgba = remove_bg_grabcut(img, fname)
        cv2.imwrite(output_path, rgba, [cv2.IMWRITE_WEBP_QUALITY, 92])
        
        if i % 5 == 0:
            print(f"  [{i+1}/{len(files)}] {fname}")
    
    print(f"\nAll done! Saved {len(files)} transparent frames to {OUTPUT_DIR}/")


if __name__ == '__main__':
    process_all()
