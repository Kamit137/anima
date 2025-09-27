class App {
    constructor() {
        this.gridSystem = new GridSystem();
        this.sectionManager = new SectionManager(this.gridSystem);
        this.zoomManager = new ZoomManager();
        this.components = [];
        this.init();
    }

    init() {

        
        // Инициализация сетки
        this.gridSystem.init('gridOverlay', 375, 667);
        
        // Инициализация менеджера секций
        this.sectionManager.init();
        console.log('App initialized');
        
        // Настройка слушателя изменения размера экрана
        this.setupScreenSizeListener();
        
        console.log('SDUI Builder с зумом и скроллом инициализирован!');

        setTimeout(() => {
            console.log('Debug: Checking DOM elements...');
            console.log('Sections list:', document.getElementById('sectionsList'));
            console.log('Grid overlay:', document.getElementById('gridOverlay'));
            console.log('Settings inputs:', document.querySelectorAll('.setting-input').length);
        }, 1000);
    }

    setupScreenSizeListener() {
        document.getElementById('screenSize').addEventListener('change', (e) => {
            const [width, height] = e.target.value.split('x').map(Number);
            this.zoomManager.updateScreenSize(width, height);
            this.gridSystem.screenSize = { width, height };
            this.sectionManager.renderGridSections();
        });
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    window.sectionManager = app.sectionManager;
    window.zoomManager = app.zoomManager;
});