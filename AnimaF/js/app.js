// Главный файл приложения
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех модулей
    console.log('Initializing app...');
    console.log('MagnetManager:', typeof MagnetManager);
    console.log('ElementTypes:', ElementTypes);
    
    // Даем время на регистрацию элементов
    setTimeout(() => {
        console.log('ElementTypes after delay:', Object.keys(ElementTypes));
        
        ScreensManager.init();
        ElementsManager.init();
        
        setTimeout(() => {
            GridManager.init();
            DragDropManager.init();
            EditorManager.init();
            
            console.log('All managers initialized');
            
            // Проверить размеры после загрузки
            setTimeout(() => {
                const canvas = document.getElementById('appCanvas');
                console.log('Final canvas size:', canvas.offsetWidth, 'x', canvas.offsetHeight);
            }, 100);
        }, 100);
    }, 100);

    setupControlButtons();
});

function setupControlButtons() {
    // Основные кнопки управления
    document.getElementById('saveBtn').addEventListener('click', () => {
        alert('Проект сохранен!');
    });

    document.getElementById('previewBtn').addEventListener('click', () => {
        alert('Функция предпросмотра в разработке');
    });

    document.getElementById('exportBtn').addEventListener('click', () => {
        alert('Функция экспорта в разработке');
    });

    // Кнопки для работы с контрактами SDUI
    document.getElementById('exportContractBtn').addEventListener('click', () => {
        const contractJSON = ContractManager.exportToJSON();
        
        // Создаем blob для скачивания
        const blob = new Blob([contractJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'project-contract.json';
        a.click();
        
        URL.revokeObjectURL(url);
        
        // Показываем контракт в консоли для отладки
        console.log('SDUI Contract:', JSON.parse(contractJSON));
    });

    document.getElementById('importContractBtn').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const success = ContractManager.importFromJSON(event.target.result);
                if (success) {
                    alert('Проект успешно импортирован из контракта!');
                } else {
                    alert('Ошибка при импорте проекта');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    });

    // Кнопка добавления экрана
    document.getElementById('addScreenBtn').addEventListener('click', function() {
        // Обработчик уже есть в ScreensManager, но дублируем для надежности
        const screenName = prompt('Введите название нового экрана:', 'Новый экран');
        if (screenName) {
            ScreensManager.addScreen(screenName);
        }
    });

    // Кнопка применения сетки
    document.getElementById('applyGrid').addEventListener('click', function() {
        // Обработчик уже есть в GridManager, но дублируем для надежности
        GridManager.updateGrid();
    });

    // Кнопка переключения видимости сетки
    document.getElementById('toggleGrid').addEventListener('click', function() {
        // Обработчик уже есть в GridManager, но дублируем для надежности
        GridManager.toggleVisibility();
    });
}

// Глобальные функции для отладки (можно использовать в консоли браузера)
window.debugApp = {
    // Показать текущее состояние
    showState: function() {
        console.log('=== APP DEBUG INFO ===');
        console.log('Current screen:', ScreensManager.getCurrentScreen());
        console.log('All screens:', ScreensManager.screens);
        console.log('ElementTypes:', ElementTypes);
        console.log('Grid settings:', {
            cols: GridManager.cols,
            rows: GridManager.rows,
            cellSize: GridManager.cellWidth + 'x' + GridManager.cellHeight
        });
        console.log('=====================');
    },
    
    // Экспорт контракта в консоль
    exportContract: function() {
        const contract = ContractManager.exportToJSON();
        console.log('SDUI Contract:', JSON.parse(contract));
        return contract;
    },
    
    // Сбросить приложение
    resetApp: function() {
        if (confirm('Вы уверены, что хотите сбросить все данные?')) {
            ScreensManager.screens = [
                { id: 1, name: 'Главная', elements: [], navIcon: '🏠' },
                { id: 2, name: 'Магазин', elements: [], navIcon: '🛍️' },
                { id: 3, name: 'Профиль', elements: [], navIcon: '👤' }
            ];
            ScreensManager.currentScreenId = 1;
            ScreensManager.renderScreensList();
            ScreensManager.renderNavigation();
            ElementsManager.renderScreenContent();
            EditorManager.clearSelection();
        }
    }
};

// Обработчики ошибок
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Сохранение состояния при закрытии страницы
window.addEventListener('beforeunload', function(e) {
    // Можно добавить автосохранение здесь
    // const autoSaveData = ContractManager.exportToJSON();
    // localStorage.setItem('animaConstruct_autoSave', autoSaveData);
});