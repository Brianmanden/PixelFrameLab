// main.js for PixelFrameLab
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    
    // UI Elements
    const pixelCanvas = document.getElementById('pixel-canvas');
    const animationPreviewCanvas = document.getElementById('animation-preview-canvas');
    const toolSelector = document.getElementById('tool-selector');
    const penToolBtn = document.getElementById('pen-tool');
    const eraserToolBtn = document.getElementById('eraser-tool');
    const fillToolBtn = document.getElementById('fill-tool');
    const colorPicker = document.getElementById('color-picker');
    const palette = document.getElementById('palette');
    const framesContainer = document.getElementById('frames-container');
    const addFrameBtn = document.getElementById('add-frame');
    const duplicateFrameBtn = document.getElementById('duplicate-frame'); // New button
    const deleteFrameBtn = document.getElementById('delete-frame');
    const animationSpeedInput = document.getElementById('animation-speed');
    const speedDisplay = document.getElementById('speed-display');
    const importImageInput = document.getElementById('import-image');
    const exportImageBtn = document.getElementById('export-image');

    // Canvas Contexts
    const pixelCtx = pixelCanvas.getContext('2d');
    const animationPreviewCtx = animationPreviewCanvas.getContext('2d');

    // Configuration
    const PIXEL_SIZE = 10; // Size of each pixel on the canvas
    const CANVAS_WIDTH_PIXELS = 32; // Width in pixels (e.g., 32x32 image)
    const CANVAS_HEIGHT_PIXELS = 32; // Height in pixels
    const THUMBNAIL_SIZE = 60; // Size of frame thumbnails, used for styling, not canvas size

    pixelCanvas.width = CANVAS_WIDTH_PIXELS * PIXEL_SIZE;
    pixelCanvas.height = CANVAS_HEIGHT_PIXELS * PIXEL_SIZE;
    animationPreviewCanvas.width = CANVAS_WIDTH_PIXELS * PIXEL_SIZE;
    animationPreviewCanvas.height = CANVAS_HEIGHT_PIXELS * PIXEL_SIZE;

    // Application State
    let activeTool = 'pen';
    let currentColor = colorPicker.value;
    // frames will store an array of 2D arrays, each representing a frame's pixel data
    let frames = [];
    let currentFrameIndex = 0;
    let animationInterval = null; // For animation preview
    let currentAnimationFrameIndex = 0; // Tracks the frame currently shown in animation preview
    let animationSpeed = 1000 / animationSpeedInput.value; // Milliseconds per frame, default 5 (200ms)

    const defaultPalette = [
        '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF',
        '#C0C0C0', '#808080', '#800000', '#808000', '#008000', '#800080', '#008080', '#000080'
    ];

    // --- Functions ---

    function createEmptyPixelData() {
        const data = [];
        for (let y = 0; y < CANVAS_HEIGHT_PIXELS; y++) {
            data.push(Array(CANVAS_WIDTH_PIXELS).fill('#FFFFFF')); // Default to white
        }
        return data;
    }

    function initializeCanvasAndFrame() {
        if (frames.length === 0) {
            frames.push(createEmptyPixelData());
        }
        currentFrameIndex = Math.max(0, Math.min(currentFrameIndex, frames.length - 1)); // Ensure index is valid
        renderPixelCanvas();
        renderFramesContainer();
        startAnimation(); // Start animation on initialization
    }

    function drawGrid(ctx, width, height) {
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= width; i += PIXEL_SIZE) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
        for (let i = 0; i <= height; i += PIXEL_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
    }

    function renderPixelCanvas() {
        pixelCtx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
        drawGrid(pixelCtx, pixelCanvas.width, pixelCanvas.height);

        if (frames.length > 0) {
            const currentPixelData = frames[currentFrameIndex];
            for (let y = 0; y < CANVAS_HEIGHT_PIXELS; y++) {
                for (let x = 0; x < CANVAS_WIDTH_PIXELS; x++) {
                    const color = currentPixelData[y][x];
                    if (color && color !== '#FFFFFF') { // Only draw if not default white
                        pixelCtx.fillStyle = color;
                        pixelCtx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
                    }
                }
            }
        }
    }

    function renderFramesContainer() {
        framesContainer.innerHTML = ''; // Clear existing thumbnails

        frames.forEach((frameData, index) => {
            const frameThumbnail = document.createElement('div');
            frameThumbnail.classList.add('frame-thumbnail');
            if (index === currentFrameIndex) {
                frameThumbnail.classList.add('active');
            }
            frameThumbnail.dataset.index = index;

            // Create a mini canvas for each thumbnail
            const thumbCanvas = document.createElement('canvas');
            thumbCanvas.width = CANVAS_WIDTH_PIXELS;
            thumbCanvas.height = CANVAS_HEIGHT_PIXELS;
            const thumbCtx = thumbCanvas.getContext('2d');

            // Draw the frame data onto the thumbnail canvas
            for (let y = 0; y < CANVAS_HEIGHT_PIXELS; y++) {
                for (let x = 0; x < CANVAS_WIDTH_PIXELS; x++) {
                    const color = frameData[y][x];
                    thumbCtx.fillStyle = color;
                    thumbCtx.fillRect(x, y, 1, 1);
                }
            }

            frameThumbnail.appendChild(thumbCanvas);

            const frameNumber = document.createElement('span');
            frameNumber.textContent = index + 1;
            frameThumbnail.appendChild(frameNumber);


            frameThumbnail.addEventListener('click', () => {
                selectFrame(index);
            });
            framesContainer.appendChild(frameThumbnail);
        });
        // startAnimation(); // Restart animation to reflect frame changes, but startAnimation is now called from initializeCanvasAndFrame
    }

    function selectFrame(index) {
        if (index >= 0 && index < frames.length) {
            currentFrameIndex = index;
            renderPixelCanvas();
            renderFramesContainer(); // Re-render to update active class
        }
    }

    function addFrame() {
        // Add a new empty frame
        frames.push(createEmptyPixelData());
        selectFrame(frames.length - 1); // Select the new frame
    }

    function duplicateFrame() {
        if (frames.length === 0) return;
        const currentPixelData = frames[currentFrameIndex];
        // Deep copy the current frame's pixel data
        const duplicatedData = currentPixelData.map(row => [...row]);
        frames.splice(currentFrameIndex + 1, 0, duplicatedData);
        selectFrame(currentFrameIndex + 1); // Select the duplicated frame
    }

    function deleteFrame() {
        if (frames.length <= 1) {
            // Cannot delete the last frame, clear it instead
            frames[0] = createEmptyPixelData();
            currentFrameIndex = 0;
        } else {
            frames.splice(currentFrameIndex, 1);
            // Adjust currentFrameIndex if needed
            if (currentFrameIndex >= frames.length) {
                currentFrameIndex = frames.length - 1;
            }
        }
        initializeCanvasAndFrame(); // Re-render everything
    }

    function drawAnimationFrame(frameData) {
        animationPreviewCtx.clearRect(0, 0, animationPreviewCanvas.width, animationPreviewCanvas.height);
        // Draw directly without grid for animation preview
        for (let y = 0; y < CANVAS_HEIGHT_PIXELS; y++) {
            for (let x = 0; x < CANVAS_WIDTH_PIXELS; x++) {
                const color = frameData[y][x];
                animationPreviewCtx.fillStyle = color;
                animationPreviewCtx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        }
    }

    function startAnimation() {
        stopAnimation(); // Clear any existing animation
        if (frames.length > 0) {
            animationInterval = setInterval(() => {
                currentAnimationFrameIndex = (currentAnimationFrameIndex + 1) % frames.length;
                drawAnimationFrame(frames[currentAnimationFrameIndex]);
            }, animationSpeed);
        }
    }

    function stopAnimation() {
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
    }

    function setupEventListeners() {
        // Tool selection
        penToolBtn.addEventListener('click', () => { activeTool = 'pen'; updateToolSelection(); });
        eraserToolBtn.addEventListener('click', () => { activeTool = 'eraser'; updateToolSelection(); });
        fillToolBtn.addEventListener('click', () => { activeTool = 'fill'; updateToolSelection(); });

        // Color picker
        colorPicker.addEventListener('input', (event) => {
            currentColor = event.target.value;
            // Potentially update active swatch or UI
        });

        // Palette selection
        palette.addEventListener('click', (event) => {
            if (event.target.classList.contains('color-swatch')) {
                const selectedColor = event.target.dataset.color;
                currentColor = selectedColor;
                colorPicker.value = selectedColor; // Update color picker to reflect selection
            }
        });

        // Pixel canvas drawing
        pixelCanvas.addEventListener('mousedown', handleCanvasInteraction);
        pixelCanvas.addEventListener('mousemove', handleCanvasInteraction);
        pixelCanvas.addEventListener('mouseup', handleCanvasInteraction);
        pixelCanvas.addEventListener('mouseleave', () => { isDrawing = false; }); // Stop drawing when mouse leaves

        // Frame management
        addFrameBtn.addEventListener('click', addFrame);
        duplicateFrameBtn.addEventListener('click', duplicateFrame); // New event listener
        deleteFrameBtn.addEventListener('click', deleteFrame);

        // Animation speed
        animationSpeedInput.addEventListener('input', (event) => {
            speedDisplay.textContent = `Speed: ${event.target.value}`;
            animationSpeed = 1000 / event.target.value; // Update animation speed (e.g., 1 to 10 means 1000ms to 100ms)
            startAnimation(); // Restart animation with new speed
        });

        // Import/Export
        importImageInput.addEventListener('change', handleImageImport);
        exportImageBtn.addEventListener('click', handleImageExport);
    }

    function handleImageImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = CANVAS_WIDTH_PIXELS;
                tempCanvas.height = CANVAS_HEIGHT_PIXELS;

                // Draw image scaled down to fit pixel grid
                tempCtx.drawImage(img, 0, 0, CANVAS_WIDTH_PIXELS, CANVAS_HEIGHT_PIXELS);

                const imageData = tempCtx.getImageData(0, 0, CANVAS_WIDTH_PIXELS, CANVAS_HEIGHT_PIXELS).data;
                const newPixelData = createEmptyPixelData();

                let dataIndex = 0;
                for (let y = 0; y < CANVAS_HEIGHT_PIXELS; y++) {
                    for (let x = 0; x < CANVAS_WIDTH_PIXELS; x++) {
                        const r = imageData[dataIndex++];
                        const g = imageData[dataIndex++];
                        const b = imageData[dataIndex++];
                        const a = imageData[dataIndex++]; // Alpha channel, ignore for now or handle transparency
                        newPixelData[y][x] = `rgb(${r}, ${g}, ${b})`;
                    }
                }
                
                frames[currentFrameIndex] = newPixelData;
                renderPixelCanvas();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function handleImageExport() {
        const dataURL = pixelCanvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = 'pixelart_frame.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function updateToolSelection() {
        document.querySelectorAll('#tool-selector button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${activeTool}-tool`).classList.add('active');
    }

    function populatePalette() {
        defaultPalette.forEach(color => {
            const swatch = document.createElement('div');
            swatch.classList.add('color-swatch');
            swatch.style.backgroundColor = color;
            swatch.dataset.color = color;
            palette.appendChild(swatch);
        });
    }

    let isDrawing = false;
    function handleCanvasInteraction(event) {
        if (event.type === 'mousedown') {
            isDrawing = true;
            if (activeTool === 'fill') {
                fillArea(event);
            } else {
                drawPixel(event);
            }
        } else if (event.type === 'mouseup') {
            isDrawing = false;
        }

        if (event.type === 'mousemove' && isDrawing && activeTool !== 'fill') {
            drawPixel(event);
        }
    }

    function drawPixel(event) {
        const rect = pixelCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const pixelX = Math.floor(x / PIXEL_SIZE);
        const pixelY = Math.floor(y / PIXEL_SIZE);

        if (pixelX >= 0 && pixelX < CANVAS_WIDTH_PIXELS && pixelY >= 0 && pixelY < CANVAS_HEIGHT_PIXELS) {
            let colorToApply = currentColor;
            if (activeTool === 'eraser') {
                colorToApply = '#FFFFFF'; // Erase with white
            }
            if (frames[currentFrameIndex][pixelY][pixelX] !== colorToApply) { // Only update if color changes
                frames[currentFrameIndex][pixelY][pixelX] = colorToApply;
                renderPixelCanvas();
            }
        }
    }

    function fillArea(event) {
        const rect = pixelCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const startPixelX = Math.floor(x / PIXEL_SIZE);
        const startPixelY = Math.floor(y / PIXEL_SIZE);

        if (startPixelX < 0 || startPixelX >= CANVAS_WIDTH_PIXELS ||
            startPixelY < 0 || startPixelY >= CANVAS_HEIGHT_PIXELS) {
            return; // Clicked outside canvas
        }

        const targetColor = frames[currentFrameIndex][startPixelY][startPixelX];
        if (targetColor === currentColor) {
            return; // Already the same color, no fill needed
        }

        const queue = [{ x: startPixelX, y: startPixelY }];
        const visited = new Set(); // To prevent infinite loops and redundant processing

        while (queue.length > 0) {
            const { x: px, y: py } = queue.shift();
            const key = `${px},${py}`;

            if (px < 0 || px >= CANVAS_WIDTH_PIXELS ||
                py < 0 || py >= CANVAS_HEIGHT_PIXELS ||
                frames[currentFrameIndex][py][px] !== targetColor ||
                visited.has(key)) {
                continue;
            }

            frames[currentFrameIndex][py][px] = currentColor;
            visited.add(key);

            // Add neighbors to the queue
            queue.push({ x: px + 1, y: py });
            queue.push({ x: px - 1, y: py });
            queue.push({ x: px, y: py + 1 });
            queue.push({ x: px, y: py - 1 });
        }
        renderPixelCanvas(); // Re-render after fill operation
    }


    // --- Initialization ---
    initializeCanvasAndFrame();
    // initializeCanvas(animationPreviewCtx, animationPreviewCanvas.width, animationPreviewCanvas.height); // Removed: Function no longer exists and its purpose is covered by startAnimation()
    setupEventListeners();
    updateToolSelection(); // Set initial active tool button
    populatePalette();

    console.log('PixelFrameLab loaded and UI initialized!');
});