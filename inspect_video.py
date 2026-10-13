import cv2
import numpy as np

cap = cv2.VideoCapture("public/character.mp4")
fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

print(f"FPS: {fps}")
print(f"Total Frames: {total_frames}")
print(f"Width x Height: {width}x{height}")

# Sample background color from top-left, top-right, bottom-left corners across first 10 frames
bg_colors = []
for i in range(min(10, total_frames)):
    ret, frame = cap.read()
    if not ret:
        break
    # Get top-left 10x10 average
    tl = frame[0:10, 0:10].mean(axis=(0,1)) # BGR
    bg_colors.append(tl)

avg_bgr = np.mean(bg_colors, axis=0)
hex_color = "#{:02x}{:02x}{:02x}".format(int(avg_bgr[2]), int(avg_bgr[1]), int(avg_bgr[0]))
print(f"Average Corner BGR: {avg_bgr}, HEX: {hex_color}")

cap.release()
