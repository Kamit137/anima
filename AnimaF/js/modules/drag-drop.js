// Управление перетаскиванием элементов
const DragDropManager = {
    gridSize: 10,
    isDragging: false,
    dragElement: null,
    dragStartX: 0,
    dragStartY: 0,
    elementStartX: 0,
    elementStartY: 0,

    init: function() {
        this.setupCanvasEventListeners();
        this.setupGridToggle();
    },

    setupCanvasEventListeners: function() {
        const appCanvas = document.getElementById('appCanvas');
        
        appCanvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.updateElementPreviewPosition(e.clientX, e.clientY);
        });

        appCanvas.addEventListener('drop', (e) => {
            e.preventDefault();
            this.handleDrop(e);
        });
        
        appCanvas.addEventListener('click', (e) => {
            if (e.target === appCanvas) {
                EditorManager.clearSelection();
            }
        });
    },

    setupGridToggle: function() {
 //       const gridToggle = document.getElementById('gridToggle');
  //      gridToggle.addEventListener('click', () => {
  //          this.toggleGridSize();
   //     });
   },

    showElementPreview: function(html) {
        const preview = document.getElementById('elementPreview');
        preview.innerHTML = html;
        preview.style.display = 'block';
        preview.style.width = '150px';
    },

    updateElementPreviewPosition: function(x, y) {
        const preview = document.getElementById('elementPreview');
        preview.style.left = (x + 10) + 'px';
        preview.style.top = (y + 10) + 'px';
    },

    handleDrop: function(e) {
        e.preventDefault();
        const elementType = e.dataTransfer.getData('text/plain');
        const rect = document.getElementById('appCanvas').getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Привязка к сетке
        const gridPos = GridManager.snapToGrid(x, y);
        
        // Используем ElementsManager для добавления элемента
        ElementsManager.addElement(elementType, gridPos.x, gridPos.y);
        
        document.getElementById('elementPreview').style.display = 'none';
    },

    makeElementDraggable: function(element, index) {
        element.addEventListener('mousedown', (e) => {
            // ИГНОРИРУЕМ клики по специальным кнопкам
            if (e.target.classList.contains('image-upload-btn') || 
                e.target.classList.contains('image-remove-btn') ||
                e.target.classList.contains('image-upload-input') ||
                e.target.classList.contains('element-action')) {
                return;
            }
            
            this.startDrag(e, element, index);
        });
    },

    startDrag: function(e, element, index) {
        if (e.target.classList.contains('element-action')) return;
        
        this.isDragging = true;
        this.dragElement = element;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        
        const rect = element.getBoundingClientRect();
        const canvasRect = document.getElementById('appCanvas').getBoundingClientRect();
        this.elementStartX = rect.left - canvasRect.left;
        this.elementStartY = rect.top - canvasRect.top;
        
        element.classList.add('dragging');
        
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));
        
        e.preventDefault();
    },
    
    applyMagneticSnap: function(element, index, newX, newY) {
        const currentScreen = ScreensManager.getCurrentScreen();
        const currentElement = {
            x: newX,
            y: newY,
            width: element.offsetWidth,
            height: element.offsetHeight
        };
        
        const snappedPosition = MagnetManager.checkMagneticSnap(
            currentElement, 
            currentScreen.elements, 
            index
        );
        
        // Показываем индикацию прилипания
        if (snappedPosition.snapped) {
            MagnetManager.showSnapIndicator(element);
        }
        
        return snappedPosition;
    },

    drag: function(e) {
        if (!this.isDragging) return;
        
        const dx = e.clientX - this.dragStartX;
        const dy = e.clientY - this.dragStartY;
        
        const newX = this.elementStartX + dx;
        const newY = this.elementStartY + dy;
        
        // Сначала привязка к сетке
        const gridPos = GridManager.snapToGrid(newX, newY);
        
        // Затем магнитное притяжение к другим элементам
        const index = parseInt(this.dragElement.getAttribute('data-index'));
        const magneticPos = this.applyMagneticSnap(this.dragElement, index, gridPos.x, gridPos.y);
        
        const maxX = document.getElementById('appCanvas').offsetWidth - this.dragElement.offsetWidth;
        const maxY = document.getElementById('appCanvas').offsetHeight - this.dragElement.offsetHeight;
        
        const clampedX = Helpers.clamp(magneticPos.x, 0, maxX);
        const clampedY = Helpers.clamp(magneticPos.y, 0, maxY);
        
        this.dragElement.style.left = clampedX + 'px';
        this.dragElement.style.top = clampedY + 'px';
        
        this.showGridInfo(e.clientX, e.clientY, clampedX, clampedY);
    },

    stopDrag: function() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.dragElement.classList.remove('dragging');
        
        const index = parseInt(this.dragElement.getAttribute('data-index'));
        const x = parseInt(this.dragElement.style.left);
        const y = parseInt(this.dragElement.style.top);
        
        ElementsManager.updateElementPosition(index, x, y);
        
        this.hideGridInfo();
        document.removeEventListener('mousemove', this.drag);
        document.removeEventListener('mouseup', this.stopDrag);
    },

    showGridInfo: function(clientX, clientY, x, y) {
        const gridInfo = document.getElementById('gridInfo');
        gridInfo.style.display = 'block';
        gridInfo.textContent = `X: ${x}px, Y: ${y}px`;
        gridInfo.style.left = (clientX + 10) + 'px';
        gridInfo.style.top = (clientY - 30) + 'px';
    },

    hideGridInfo: function() {
        document.getElementById('gridInfo').style.display = 'none';
    },

    toggleGridSize: function() {
        if (this.gridSize === 5) {
            this.gridSize = 10;
        } else if (this.gridSize === 10) {
            this.gridSize = 20;
        } else {
            this.gridSize = 5;
        }
        
        document.getElementById('gridToggle').textContent = `Сетка: ${this.gridSize}px`;
    },
    updateGridSize: function(cellWidth, cellHeight) {
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
    }
};