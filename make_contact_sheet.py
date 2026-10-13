import cv2
import numpy as np

# Create grid of 240 frames: 15 rows x 16 cols
# Each thumbnail 160x90
thumb_w, thumb_h = 160, 90
grid_cols = 16
grid_rows = 15

grid_img = np.zeros((grid_rows * thumb_h, grid_cols * thumb_w, 3), dtype=np.uint8)

for idx in range(240):
    img = cv2.imread(f"temp_frames/frame_{idx:03d}.jpg")
    if img is None:
        continue
    thumb = cv2.resize(img, (thumb_w, thumb_h))
    
    # Draw frame number overlay
    cv2.rectangle(thumb, (0, 0), (50, 20), (0, 0, 0), -1)
    cv2.putText(thumb, f"{idx}", (5, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    
    r = idx // grid_cols
    c = idx % grid_cols
    grid_img[r*thumb_h:(r+1)*thumb_h, c*thumb_w:(c+1)*thumb_w] = thumb

cv2.imwrite("temp_frames/contact_sheet.jpg", grid_img)
print("Saved contact_sheet.jpg")
