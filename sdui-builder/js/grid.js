class GridSystem {
    constructor() {
        this.gridType = 'columns';
        this.columns = 3;
        this.rows = 6;
        this.gap = 8;
        this.cells = [];
        this.container = null;
        this.screenSize = { width: 375, height: 667 };
    }

    init(containerId, screenWidth, screenHeight) {
        this.container = document.getElementById(containerId);
        this.screenSize = { width: screenWidth, height: screenHeight };
        this.renderGrid();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Слушатели изменений настроек сетки
        document.querySelectorAll('input[name="gridType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.gridType = e.target.value;
                this.renderGrid();
            });
        });

        document.getElementById('gridColumns').addEventListener('input', (e) => {
            this.columns = parseInt(e.target.value);
            this.renderGrid();
        });

        document.getElementById('gridRows').addEventListener('input', (e) => {
            this.rows = parseInt(e.target.value);
            this.renderGrid();
        });

        document.getElementById('gridGap').addEventListener('input', (e) => {
            this.gap = parseInt(e.target.value);
            document.getElementById('gapValue').textContent = this.gap + 'px';
            this.renderGrid();
        });

        // Изменение размера экрана
        document.getElementById('screenSize').addEventListener('change', (e) => {
            const size = Utils.parseScreenSize(e.target.value);
            this.screenSize = size;
            this.updateScreenSize();
            this.renderGrid();
        });
    }

    updateScreenSize() {
        const mobileFrame = document.getElementById('mobileFrame');
        mobileFrame.style.width = this.screenSize.width + 'px';
        mobileFrame.style.height = this.screenSize.height + 'px';
    }

    renderGrid() {
        if (!this.container) return;

        this.container.innerHTML = '';
        this.cells = [];
        
        const availableWidth = this.screenSize.width;
        const availableHeight = this.screenSize.height;

        let cellWidth, cellHeight;

        if (this.gridType === 'columns') {
            cellWidth = (availableWidth - (this.gap * (this.columns - 1))) / this.columns;
            cellHeight = availableHeight;
            this.rows = 1;
        } else if (this.gridType === 'rows') {
            cellWidth = availableWidth;
            cellHeight = (availableHeight - (this.gap * (this.rows - 1))) / this.rows;
            this.columns = 1;
        } else { // matrix
            cellWidth = (availableWidth - (this.gap * (this.columns - 1))) / this.columns;
            cellHeight = (availableHeight - (this.gap * (this.rows - 1))) / this.rows;
        }

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                const x = col * (cellWidth + this.gap);
                const y = row * (cellHeight + this.gap);
                
                cell.style.width = cellWidth + 'px';
                cell.style.height = cellHeight + 'px';
                cell.style.left = x + 'px';
                cell.style.top = y + 'px';

                cell.textContent = `${row + 1}-${col + 1}`;

                this.container.appendChild(cell);
                this.cells.push({
                    element: cell,
                    row: row,
                    col: col,
                    x: x,
                    y: y,
                    width: cellWidth,
                    height: cellHeight
                });
            }
        }

        this.container.className = `grid-overlay grid-${this.gridType}`;
    }

    findNearestCell(x, y, elementWidth, elementHeight) {
        let bestCell = null;
        let minDistance = Infinity;

        for (const cell of this.cells) {
            const centerX = cell.x + cell.width / 2;
            const centerY = cell.y + cell.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                bestCell = cell;
            }
        }

        return bestCell;
    }

    getConfig() {
        return {
            type: this.gridType,
            columns: this.columns,
            rows: this.rows,
            gap: this.gap,
            screenSize: this.screenSize
        };
    }
}