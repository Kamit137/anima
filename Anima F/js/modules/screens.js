// Управление экранами приложения
const ScreensManager = {
    screens: [
        { id: 1, name: 'Главная', elements: [], navIcon: '🏠' },
        { id: 2, name: 'Магазин', elements: [], navIcon: '🛍️' },
        { id: 3, name: 'Профиль', elements: [], navIcon: '👤' }
    ],
    
    currentScreenId: 1,

    init: function() {
        this.renderScreensList();
        this.renderNavigation();
        this.setupEventListeners();
    },

    renderScreensList: function() {
        const screensList = document.getElementById('screensList');
        screensList.innerHTML = '';
        
        this.screens.forEach(screen => {
            const screenItem = document.createElement('div');
            screenItem.className = `screen-item ${screen.id === this.currentScreenId ? 'active' : ''}`;
            screenItem.innerHTML = `
                <span>${screen.name}</span>
                <button class="delete-screen" data-id="${screen.id}">×</button>
            `;
            
            screenItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-screen')) {
                    this.switchScreen(screen.id);
                }
            });
            
            screensList.appendChild(screenItem);
        });
    },

    renderNavigation: function() {
        const navigationPanel = document.getElementById('navigationPanel');
        navigationPanel.innerHTML = '';
        
        this.screens.forEach(screen => {
            const navItem = document.createElement('div');
            navItem.className = `nav-item ${screen.id === this.currentScreenId ? 'active' : ''}`;
            navItem.innerHTML = `
                <div>${screen.navIcon}</div>
                <div>${screen.name}</div>
            `;
            
            navItem.addEventListener('click', () => {
                this.switchScreen(screen.id);
            });
            
            navigationPanel.appendChild(navItem);
        });
    },

    switchScreen: function(screenId) {
        this.saveCurrentScreenElements();
        
        this.currentScreenId = screenId;
        this.renderScreensList();
        this.renderNavigation();
        ElementsManager.renderScreenContent();
        EditorManager.clearSelection();
    },

    saveCurrentScreenElements: function() {
        const currentScreen = this.getCurrentScreen();
        if (!currentScreen) return;
        
        // Сохраняем актуальные позиции всех элементов
        currentScreen.elements.forEach((element, index) => {
            const elementDiv = document.querySelector(`.draggable-element[data-index="${index}"]`);
            if (elementDiv) {
                element.x = parseInt(elementDiv.style.left) || 0;
                element.y = parseInt(elementDiv.style.top) || 0;
                
                // Также сохраняем размеры если они были изменены
                const width = elementDiv.style.width;
                const height = elementDiv.style.height;
                if (width) element.width = width;
                if (height) element.height = height;
            }
        });
    },

    addScreen: function(name) {
        const newId = this.screens.length > 0 ? Math.max(...this.screens.map(s => s.id)) + 1 : 1;
        
        const availableIcons = Constants.navIcons.filter(icon => 
            !this.screens.some(screen => screen.navIcon === icon)
        );
        const newIcon = availableIcons.length > 0 ? 
            availableIcons[Math.floor(Math.random() * availableIcons.length)] : 
            Constants.navIcons[Math.floor(Math.random() * Constants.navIcons.length)];
        
        this.screens.push({
            id: newId,
            name: name,
            elements: [],
            navIcon: newIcon
        });
        
        this.renderScreensList();
        this.renderNavigation();
    },

    deleteScreen: function(screenId) {
        if (this.screens.length <= 1) {
            alert('Нельзя удалить последний экран!');
            return;
        }
        
        if (confirm('Вы уверены, что хотите удалить этот экран?')) {
            this.screens = this.screens.filter(s => s.id !== screenId);
            
            if (this.currentScreenId === screenId) {
                this.currentScreenId = this.screens[0].id;
            }
            
            this.renderScreensList();
            this.renderNavigation();
            ElementsManager.renderScreenContent();
            EditorManager.clearSelection();
        }
    },

    getCurrentScreen: function() {
        return this.screens.find(s => s.id === this.currentScreenId);
    },

    setupEventListeners: function() {
        document.getElementById('addScreenBtn').addEventListener('click', () => {
            const screenName = prompt('Введите название нового экрана:', 'Новый экран');
            if (screenName) {
                this.addScreen(screenName);
            }
        });
    }
};