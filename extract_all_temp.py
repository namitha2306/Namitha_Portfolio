import cv2
import os

os.makedirs("temp_frames", exist_ok=True)
cap = cv2.VideoCapture("public/character.mp4")

frame_idx = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break
    # Save every frame or save every 2nd frame
    # Let's save all frames to temp_frames/frame_XXX.jpg (or webp)
    cv2.imwrite(f"temp_frames/frame_{frame_idx:03d}.jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
    frame_idx += 1

cap.release()
print(f"Extracted {frame_idx} frames to temp_frames/")
