const GridManager = {
    cols: 4,
    rows: 8,
    cellWidth: 0,
    cellHeight: 0,
    isVisible: true,

    init: function() {
        this.calculateCellSize();
        this.renderGrid();
        this.setupEventListeners();
        console.log('GridManager initialized');
    },

    calculateCellSize: function() {
        const canvas = document.getElementById('appCanvas');
        console.log('Canvas size:', canvas.offsetWidth, 'x', canvas.offsetHeight); // ДОБАВЬТЕ
        this.cellWidth = canvas.offsetWidth / this.cols;
        this.cellHeight = canvas.offsetHeight / this.rows;
        console.log('Cell size:', this.cellWidth, 'x', this.cellHeight); // ДОБАВЬТЕ
    },

    renderGrid: function() {
        const canvas = document.getElementById('appCanvas');
        const oldGrid = canvas.querySelector('.grid-lines');
        if (oldGrid) oldGrid.remove();
        
        if (!this.isVisible) return;
        
        this.calculateCellSize();
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid-lines';
        
        for (let i = 1; i < this.cols; i++) {
            const line = document.createElement('div');
            line.className = 'grid-line vertical';
            line.style.left = (i * this.cellWidth) + 'px';
            gridContainer.appendChild(line);
        }
        
        for (let i = 1; i < this.rows; i++) {
            const line = document.createElement('div');
            line.className = 'grid-line horizontal';
            line.style.top = (i * this.cellHeight) + 'px';
            gridContainer.appendChild(line);
        }
        
        canvas.appendChild(gridContainer);
    },

    setupEventListeners: function() {
        document.getElementById('applyGrid').addEventListener('click', () => {
            this.updateGrid();
        });
        
        document.getElementById('toggleGrid').addEventListener('click', () => {
            this.toggleVisibility();
        });
    },

    updateGrid: function() {
        const newCols = parseInt(document.getElementById('gridCols').value);
        const newRows = parseInt(document.getElementById('gridRows').value);
        
        this.cols = Math.max(2, Math.min(12, newCols));
        this.rows = Math.max(2, Math.min(20, newRows));
        
        this.renderGrid();
        
        // Анимация подтверждения
        const applyBtn = document.getElementById('applyGrid');
        applyBtn.innerHTML = '<span>✓</span> Применено!';
        setTimeout(() => {
            applyBtn.innerHTML = '<span>✓</span> Применить';
        }, 1000);
    },

    toggleVisibility: function() {
        this.isVisible = !this.isVisible;
        const button = document.getElementById('toggleGrid');
        button.innerHTML = this.isVisible ? '<span>👁️</span> Скрыть' : '<span>👁️</span> Показать';
        button.classList.toggle('grid-btn-toggle', true);
        this.renderGrid();
    },

    snapToGrid: function(x, y) {
        console.log('=== GRID SNAP DEBUG ===');
        console.log('Input coordinates:', x, y);
        console.log('Cell size:', this.cellWidth, 'x', this.cellHeight);
        console.log('Grid dimensions:', this.cols, 'cols x', this.rows, 'rows');
        
        const col = Math.round(x / this.cellWidth);
        const row = Math.round(y / this.cellHeight);
        
        console.log('Grid position (col, row):', col, row);
        
        const clampedCol = Math.max(0, Math.min(col, this.cols - 1));
        const clampedRow = Math.max(0, Math.min(row, this.rows - 1));
        
        const snappedX = clampedCol * this.cellWidth;
        const snappedY = clampedRow * this.cellHeight;
        
        console.log('Snapped coordinates:', snappedX, snappedY);
        console.log('=====================');
        
        return {
            x: snappedX,
            y: snappedY
        };
    }
};