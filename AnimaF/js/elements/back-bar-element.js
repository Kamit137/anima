class BackBarElement extends BaseElement {
    constructor() {
        super(
            'back_bar',
            'Навигационная панель',
            '←',
            `
            <div class="back-bar" style="display:flex;align-items:center;padding:12px 16px;background:white;border-bottom:1px solid #e1e5e9;width:100%;box-sizing:border-box;">
                <div class="back-icon" style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;margin-right:12px;font-size:18px;user-select:none;">←</div>
                <div class="back-title" style="font-size:16px;font-weight:600;color:#2d3748;cursor:pointer;flex:1;" contenteditable="true">Назад</div>
            </div>
            `,
            'Назад'
        );
        this.currentIcon = '←'; // Текущая иконка
        this.isEditing = false; // Флаг редактирования текста
    }

    setupElement(elementDiv, index) {
        super.setupElement(elementDiv, index);
        
        const backIcon = elementDiv.querySelector('.back-icon');
        const backTitle = elementDiv.querySelector('.back-title');
        
        // Клик по иконке - меняем иконку (с проверкой на element-action)
        backIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            // Проверяем, что клик не по кнопке удаления
            if (!e.target.classList.contains('element-action')) {
                this.toggleIcon(backIcon, index);
            }
        });
        
        // Двойной клик по иконке - выбираем иконку
        backIcon.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            if (!e.target.classList.contains('element-action')) {
                this.selectIcon(backIcon, index);
            }
        });
        
        // Сохраняем текст при редактировании
        backTitle.addEventListener('input', () => {
            this.saveTitle(index, backTitle.textContent);
        });
        
        // Клик по заголовку - выделяем элемент (только если не редактируем)
        backTitle.addEventListener('click', (e) => {
            // Не выделяем если кликнули во время редактирования
            if (document.activeElement !== backTitle && !this.isEditing) {
                e.stopPropagation();
                EditorManager.selectElement(elementDiv, index);
            }
        });
        
        // При фокусе на редактировании текста - не выделяем элемент
        backTitle.addEventListener('focus', () => {
            this.isEditing = true;
        });
        
        backTitle.addEventListener('blur', () => {
            this.isEditing = false;
        });
    }
    
    toggleIcon(iconElement, index) {
        // Добавляем анимацию
        iconElement.classList.add('changing');
        
        // Переключаем между стрелкой и крестиком
        if (this.currentIcon === '←') {
            this.currentIcon = '×';
            iconElement.textContent = '×';
            iconElement.style.fontSize = '20px';
            iconElement.style.fontWeight = 'bold';
        } else {
            this.currentIcon = '←';
            iconElement.textContent = '←';
            iconElement.style.fontSize = '18px';
            iconElement.style.fontWeight = 'normal';
        }
        
        this.saveIcon(index, this.currentIcon);
        
        // Убираем анимацию
        setTimeout(() => {
            iconElement.classList.remove('changing');
        }, 300);
    }
    
    selectIcon(iconElement, index) {
        const newIcon = prompt('Введите иконку (например: ←, ×, ❮, ↶, ⓧ):', this.currentIcon);
        if (newIcon && newIcon.trim() !== '') {
            this.currentIcon = newIcon.trim();
            iconElement.textContent = this.currentIcon;
            
            // Настраиваем размер для разных иконок
            if (this.currentIcon === '×') {
                iconElement.style.fontSize = '20px';
                iconElement.style.fontWeight = 'bold';
            } else {
                iconElement.style.fontSize = '18px';
                iconElement.style.fontWeight = 'normal';
            }
            
            this.saveIcon(index, this.currentIcon);
        }
    }
    
    saveIcon(index, icon) {
        const currentScreen = ScreensManager.getCurrentScreen();
        if (currentScreen.elements[index]) {
            currentScreen.elements[index].icon = icon;
        }
    }
    
    saveTitle(index, title) {
        const currentScreen = ScreensManager.getCurrentScreen();
        if (currentScreen.elements[index]) {
            currentScreen.elements[index].title = title;
        }
    }

    toContract(x, y, index, width, height) {
        const contract = super.toContract(x, y, index, width, height);
        const currentScreen = ScreensManager.getCurrentScreen();
        const element = currentScreen.elements[index];
        
        contract.properties = {
            ...contract.properties,
            icon: element?.icon || '←',
            title: element?.title || 'Назад',
            background: 'white',
            show_border: true
        };
        
        return contract;
    }
    
    fromContract(contract) {
        const elementDiv = super.fromContract(contract);
        
        // Восстанавливаем иконку и заголовок
        const backIcon = elementDiv.querySelector('.back-icon');
        const backTitle = elementDiv.querySelector('.back-title');
        
        if (contract.properties.icon) {
            backIcon.textContent = contract.properties.icon;
            this.currentIcon = contract.properties.icon;
            
            if (contract.properties.icon === '×') {
                backIcon.style.fontSize = '20px';
                backIcon.style.fontWeight = 'bold';
            } else {
                backIcon.style.fontSize = '18px';
                backIcon.style.fontWeight = 'normal';
            }
        }
        
        if (contract.properties.title) {
            backTitle.textContent = contract.properties.title;
        }
        
        return elementDiv;
    }
}