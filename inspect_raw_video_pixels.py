import cv2
import numpy as np

cap = cv2.VideoCapture("public/character.mp4")
ret, frame = cap.read()
cap.release()

# Let's inspect top-left 100x100 pixels of frame
top_left = frame[0:100, 0:100]

# Print unique RGB values in background area
print("Unique BGR values sample in top-left 100x100:")
unique_colors = np.unique(top_left.reshape(-1, 3), axis=0)
print(f"Number of unique colors in top-left 100x100: {len(unique_colors)}")
print("First 15 colors:\n", unique_colors[:15])

# Find average of grey squares vs white squares in checkerboard
# Grey squares: R~G~B around 200..230
# White squares: R~G~B around 240..255
bg_pixels = top_left[top_left.mean(axis=2) > 180]
print(f"Background pixels count where mean > 180: {len(bg_pixels)}")
if len(bg_pixels) > 0:
    print("Mean BGR of bright background pixels:", bg_pixels.mean(axis=0))
