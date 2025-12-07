# Project: PixelFrameLab

## Project Overview
PixelFrameLab is a static web application designed for pixel art creation and animation. It allows users to edit small images pixel-by-pixel and arrange them into animated sequences. The application is built using vanilla HTML, CSS, and JavaScript, emphasizing a lightweight and dependency-free approach.

**Key Features:**
*   **Pixel Editing:** Tools include a pen, eraser, and a fill (bucket) tool for detailed pixel manipulation.
*   **Color Selection:** Users can select colors using a color picker or a predefined palette of common colors.
*   **Frame Management:** Functionality to add, duplicate, delete, and select individual animation frames, displayed as thumbnails.
*   **Animation Preview:** A dedicated area to preview the animated sequence with adjustable playback speed.
*   **Image I/O:** Supports importing images (which are pixelated to fit the canvas) and exporting the current frame as a PNG image.

## Building and Running
This project is a static web application and requires no complex build steps or external dependencies.

**To Run Locally:**
1.  Navigate to the project directory.
2.  Open the `index.html` file directly in any modern web browser.

**To Deploy:**
Upload all project files (`index.html`, `style.css`, `main.js`, `TESTING.md`, `README.md`) to a static web server (e.g., Apache, Nginx, GitHub Pages, Netlify, Vercel). The application will be served directly.

## Development Conventions
*   **Technology Stack:** Vanilla JavaScript, HTML5, CSS3. No external libraries or frameworks are used.
*   **Code Structure:**
    *   `index.html`: Defines the application's structure and UI elements.
    *   `style.css`: Provides all visual styling and includes basic responsiveness via media queries.
    *   `main.js`: Contains all the core application logic, state management (using global variables), event listeners, and canvas manipulation functions.
*   **Testing:** Manual testing is outlined in `TESTING.md` due to the constraint of not using external libraries for automated testing.
*   **Styling:** CSS variables are used for consistent theming. `image-rendering: pixelated;` is applied to canvases for sharp pixel display.
*   **Responsiveness:** Basic media queries are included in `style.css` to adjust the layout for different screen sizes.
