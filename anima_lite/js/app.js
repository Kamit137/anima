class App {
    constructor() {
        this.currentTab = 'cart';
        this.init();
    }

    init() {
        // Инициализируем табы
        tabsManager.init();
        
        // Загружаем настройки корзины
        cartSettingsManager.loadSettings();
        cartFormHandler.renderControls();
        
        // Загружаем настройки чекаута
        checkoutSettingsManager.loadSettings();
        checkoutFormHandler.renderControls();
        
        console.log('Приложение инициализировано');
    }

    saveCurrentSettings() {
        if (this.currentTab === 'cart') {
            cartSettingsManager.saveSettings();
        } else {
            checkoutSettingsManager.saveSettings();
        }
    }

    resetCurrentSettings() {
        if (this.currentTab === 'cart') {
            cartSettingsManager.resetSettings();
        } else {
            checkoutSettingsManager.resetSettings();
        }
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});