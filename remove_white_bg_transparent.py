import cv2
import numpy as np
import os

INPUT_DIR = "public/frames"
OUTPUT_DIR = "public/frames_alpha"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def remove_white_background(img_bgr):
    """
    Remove white/near-white background from an image.
    Uses a combination of:
    1. FloodFill from image corners to identify background
    2. Color threshold to refine edges
    3. Morphological operations for clean edges
    """
    h, w = img_bgr.shape[:2]
    
    # Convert to float for processing
    img_float = img_bgr.astype(np.float32)
    
    # Create RGBA output
    img_rgba = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2BGRA)
    
    # Step 1: Create a mask using floodfill from all 4 corners
    # This identifies the outer white background
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    
    # Flood fill mask
    flood_mask = np.zeros((h + 2, w + 2), dtype=np.uint8)
    flood_copy = img_bgr.copy()
    
    # Fill from all 4 corners with a loose threshold
    tolerance = 25
    cv2.floodFill(flood_copy, flood_mask, (0, 0), (0, 255, 0), 
                  loDiff=(tolerance, tolerance, tolerance), 
                  upDiff=(tolerance, tolerance, tolerance))
    cv2.floodFill(flood_copy, flood_mask, (w-1, 0), (0, 255, 0),
                  loDiff=(tolerance, tolerance, tolerance),
                  upDiff=(tolerance, tolerance, tolerance))
    cv2.floodFill(flood_copy, flood_mask, (0, h-1), (0, 255, 0),
                  loDiff=(tolerance, tolerance, tolerance),
                  upDiff=(tolerance, tolerance, tolerance))
    cv2.floodFill(flood_copy, flood_mask, (w-1, h-1), (0, 255, 0),
                  loDiff=(tolerance, tolerance, tolerance),
                  upDiff=(tolerance, tolerance, tolerance))
    
    # Extract the flood fill mask (background pixels)
    bg_mask = flood_mask[1:-1, 1:-1]
    
    # Step 2: Also detect near-white pixels as potential background
    # White background: all channels very bright
    b, g, r = img_bgr[:,:,0].astype(float), img_bgr[:,:,1].astype(float), img_bgr[:,:,2].astype(float)
    
    # Near-white detection: all channels > 200 AND low saturation
    brightness = (b + g + r) / 3.0
    sat_diff = np.maximum(np.maximum(np.abs(b-g), np.abs(g-r)), np.abs(b-r))
    
    near_white = ((brightness > 210) & (sat_diff < 25)).astype(np.uint8) * 255
    
    # Combine flood fill bg mask with near-white mask
    combined_bg = np.maximum(bg_mask * 255, near_white)
    
    # Step 3: Refine - dilate to close small gaps at edges
    kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    combined_bg = cv2.morphologyEx(combined_bg, cv2.MORPH_CLOSE, kernel_close, iterations=1)
    
    # Erode slightly to not bite into the subject
    kernel_erode = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2, 2))
    combined_bg = cv2.erode(combined_bg, kernel_erode, iterations=1)
    
    # Step 4: Create soft alpha from the foreground (inverted background)
    fg_mask = 255 - combined_bg
    
    # Step 5: Apply Gaussian blur at the edge for soft transition
    # Find edges of the mask
    edge = cv2.Canny(fg_mask, 50, 150)
    edge_dilated = cv2.dilate(edge, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (4, 4)), iterations=1)
    
    # Smooth the alpha at edges
    alpha = fg_mask.astype(np.float32) / 255.0
    alpha_blurred = cv2.GaussianBlur(alpha, (5, 5), 0)
    
    # Use blurred alpha only at edges, sharp alpha elsewhere
    edge_weight = edge_dilated.astype(np.float32) / 255.0
    final_alpha = alpha * (1 - edge_weight * 0.5) + alpha_blurred * (edge_weight * 0.5)
    final_alpha = np.clip(final_alpha, 0, 1)
    
    # Apply alpha channel
    img_rgba[:, :, 3] = (final_alpha * 255).astype(np.uint8)
    
    return img_rgba


def process_frames():
    files = sorted([f for f in os.listdir(INPUT_DIR) if f.endswith('.webp')])
    print(f"Found {len(files)} frames to process")
    
    for i, fname in enumerate(files):
        if fname.startswith('test_'):
            continue
        
        input_path = os.path.join(INPUT_DIR, fname)
        output_path = os.path.join(OUTPUT_DIR, fname)
        
        # Read the image
        img = cv2.imread(input_path, cv2.IMREAD_COLOR)
        if img is None:
            print(f"  Could not read {fname}, skipping")
            continue
        
        # Remove background
        rgba = remove_white_background(img)
        
        # Save as WebP with alpha channel
        # WebP supports BGRA natively
        cv2.imwrite(output_path, rgba, [cv2.IMWRITE_WEBP_QUALITY, 95])
        
        if i % 10 == 0:
            print(f"  Processed {i+1}/{len(files)}: {fname}")
    
    print(f"\nDone! {len(files)} frames saved to {OUTPUT_DIR}/")


if __name__ == '__main__':
    process_frames()
