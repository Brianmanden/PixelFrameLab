# Manual Testing Instructions for PixelFrameLab

To manually test the functionalities of PixelFrameLab, follow these steps:

## Setup
1. Open the `index.html` file in your web browser.

## Core Functionalities

### 1. Pixel Editing (Pen, Eraser)
- **Select Pen Tool**: Click on the "Pen" button in the "Tools" section.
- **Select a Color**: Use the color picker or click on a color swatch in the palette.
- **Draw on Canvas**: Click and drag your mouse on the "Pixel Editor" canvas. You should see individual pixels change to the selected color.
- **Select Eraser Tool**: Click on the "Eraser" button.
- **Erase on Canvas**: Click and drag on the canvas. Pixels should turn white (erased).

### 2. Fill Tool
- **Select Fill Tool**: Click on the "Fill" button.
- **Select a Color**: Choose a color.
- **Fill an Area**: Click inside an enclosed area of pixels of the same color on the canvas. The entire contiguous area should change to the selected color. Test with different shapes and colors.

### 3. Frame Management
- **Add Frame**: Click the "Add Frame" button. A new empty frame thumbnail should appear, and the editor canvas should clear (showing the new empty frame).
- **Duplicate Frame**: Draw something on the current frame. Click the "Duplicate Frame" button. A new frame thumbnail identical to the current one should appear, and the editor should switch to the duplicated frame.
- **Select Frame**: Click on different frame thumbnails. The "Pixel Editor" canvas should update to show the content of the selected frame, and the active frame thumbnail should be highlighted.
- **Delete Frame**: Select a frame and click the "Delete Frame" button. The frame should be removed.
    - *Note*: If only one frame remains, deleting it should clear its content instead of removing the frame entirely.

### 4. Animation Preview
- **Create Multiple Frames**: Use the "Add Frame" or "Duplicate Frame" buttons to create at least two distinct frames. Draw different patterns on them.
- **Observe Animation**: The "Animation Preview" canvas should automatically cycle through your frames.
- **Adjust Speed**: Drag the "animation-speed" slider. The speed of the animation in the preview should change accordingly. The "Speed" display should also update.

### 5. Image Import
- **Import an Image**: Click the "Choose File" button next to "Import/Export". Select a small image file (e.g., PNG, JPG).
- **Observe Canvas**: The current frame in the "Pixel Editor" should be replaced with a pixelated version of the imported image.

### 6. Image Export
- **Export Current Frame**: Draw something on the canvas or import an image. Click the "Export" button.
- **Check Download**: Your browser should download a `pixelart_frame.png` file. Open it to verify that it matches the content of your current editor frame.

---
Please report any unexpected behavior or issues.