class ZoomManager {
    constructor() {
        this.zoomLevel = 1;
        this.minZoom = 0.5;
        this.maxZoom = 2;
        this.zoomStep = 0.1;
        this.container = null;
        this.mobileScreen = null;
        this.init();
    }

    init() {
        this.container = document.getElementById('mobileFrameContainer');
        this.mobileScreen = document.getElementById('mobileScreen');
        this.setupEventListeners();
        this.updateZoomDisplay();
        this.updateScrollIndicator();
    }

    setupEventListeners() {
        // Слушатель скролла внутри мобильного экрана
        this.mobileScreen.addEventListener('scroll', () => {
            this.updateScrollIndicator();
        });

        // Слушатель изменения размера экрана
        document.getElementById('screenSize').addEventListener('change', (e) => {
            setTimeout(() => this.updateScreenSizeInfo(), 100);
        });

        // Горячие клавиши для зума
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === '=' || e.key === '+') {
                    e.preventDefault();
                    this.zoomIn();
                } else if (e.key === '-') {
                    e.preventDefault();
                    this.zoomOut();
                } else if (e.key === '0') {
                    e.preventDefault();
                    this.resetZoom();
                }
            }
        });
    }

    zoomIn() {
        if (this.zoomLevel < this.maxZoom) {
            this.zoomLevel = Math.min(this.zoomLevel + this.zoomStep, this.maxZoom);
            this.applyZoom();
        }
    }

    zoomOut() {
        if (this.zoomLevel > this.minZoom) {
            this.zoomLevel = Math.max(this.zoomLevel - this.zoomStep, this.minZoom);
            this.applyZoom();
        }
    }

    resetZoom() {
        this.zoomLevel = 1;
        this.applyZoom();
    }

    applyZoom() {
        this.container.style.transform = `scale(${this.zoomLevel})`;
        this.updateZoomDisplay();
        this.updateScreenSizeInfo();
    }

    updateZoomDisplay() {
        document.getElementById('zoomLevel').textContent = Math.round(this.zoomLevel * 100) + '%';
    }

    updateScrollIndicator() {
        const scrollableHeight = this.mobileScreen.scrollHeight - this.mobileScreen.clientHeight;
        const scrollPercentage = scrollableHeight > 0 
            ? Math.round((this.mobileScreen.scrollTop / scrollableHeight) * 100)
            : 0;
        
        document.getElementById('scrollIndicator').textContent = `Scroll: ${scrollPercentage}%`;
    }

    updateScreenSizeInfo() {
        const mobileFrame = document.getElementById('mobileFrame');
        const actualWidth = Math.round(mobileFrame.offsetWidth * this.zoomLevel);
        const actualHeight = Math.round(mobileFrame.offsetHeight * this.zoomLevel);
        
        document.getElementById('screenSizeInfo').textContent = 
            `${actualWidth} × ${actualHeight}`;
    }

    // Обновление размера экрана при выборе из списка
    updateScreenSize(width, height) {
        const mobileFrame = document.getElementById('mobileFrame');
        mobileFrame.style.width = width + 'px';
        mobileFrame.style.height = height + 'px';
        
        this.updateScreenSizeInfo();
        
        // Перерисовываем сетку с новым размером
        if (window.sectionManager) {
            window.sectionManager.renderGridSections();
        }
    }
}