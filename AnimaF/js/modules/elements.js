const ElementsManager = {
    init: function() {
        this.renderElementsPanel();
    },

    renderElementsPanel: function() {
        const elementsPanel = document.getElementById('elementsPanel');
        elementsPanel.innerHTML = '';

        // Отладочный вывод
        console.log('ElementTypes:', ElementTypes);

        // Если ElementTypes пуст, используем временный список
        const elementsToRender = Object.keys(ElementTypes).length > 0 ? 
            Object.values(ElementTypes) : 
            this.getFallbackElements();

        elementsToRender.forEach(ElementClass => {
            let element;
            if (typeof ElementClass === 'function') {
                element = new ElementClass();
            } else {
                // Если это уже объект (временный случай)
                element = ElementClass;
            }
            
            const elementDiv = document.createElement('div');
            elementDiv.className = 'element';
            elementDiv.draggable = true;
            elementDiv.innerHTML = `
                <div style="font-size:24px;margin-bottom:5px;">${element.icon}</div>
                <div>${element.name}</div>
            `;

            elementDiv.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', element.type);
                DragDropManager.showElementPreview(element.html);
            });

            elementsPanel.appendChild(elementDiv);
        });
    },

    getFallbackElements: function() {
        // Возвращаем массив с базовыми элементами для теста
        return [
            {
                type: 'text',
                name: 'Текст',
                icon: 'T',
                html: '<div contenteditable="true" style="padding: 8px; min-width: 100px; border: 1px dashed #ccc; border-radius: 4px;">Текст элемента</div>'
            },
            {
                type: 'button',
                name: 'Кнопка',
                icon: 'B',
                html: '<button class="app-button">Кнопка</button>'
            }
        ];
    },

    createElementOnCanvas: function(element, index) {
        const ElementClass = ElementTypes[element.type];
        if (!ElementClass) return null;
        
        const elementInstance = new ElementClass();
        const elementDiv = elementInstance.createElement(element.x, element.y, index);
        
        // ПРИМЕНЯЕМ РАЗМЕРЫ ЕСЛИ ОНИ ЕСТЬ
        if (element.width) {
            elementDiv.style.width = element.width;
        }
        if (element.height) {
            elementDiv.style.height = element.height;
        }
        
        // ВОССТАНАВЛИВАЕМ КОНТЕНТ ПЕРЕД настройкой элемента
        if (element.content && (element.type === 'text' || element.type === 'button')) {
            if (element.type === 'text') {
                const textElement = elementDiv.querySelector('[contenteditable="true"]');
                if (textElement) {
                    textElement.textContent = element.content;
                }
            } else if (element.type === 'button') {
                const buttonElement = elementDiv.querySelector('.app-button');
                if (buttonElement) {
                    buttonElement.textContent = element.content;
                }
            }
        }
        
        // Настройка элемента
        elementInstance.setupElement(elementDiv, index);
        
        // Обработчики выбора и перетаскивания
        elementDiv.addEventListener('click', (e) => {
            console.log('Element clicked:', index, element.type);
            
            // Игнорируем клики по специальным элементам управления
            const ignoredClasses = [
                'element-action', 'image-upload-btn', 'image-remove-btn',
                'gallery-prev', 'gallery-next', 'add-product-btn', 
                'product-edit', 'product-delete', 'back-icon', 'back-title',
                'app-button', 'buy-button', 'checkout-button', 'cart-checkbox',
                'counter-decrease', 'counter-increase', 'counter-value'
            ];
            
            const shouldIgnore = ignoredClasses.some(className => 
                e.target.classList.contains(className)
            );
            
            if (!shouldIgnore && e.target !== elementDiv.querySelector('.element-actions')) {
                console.log('Selecting element for editing');
                EditorManager.selectElement(elementDiv, index);
            }
        });
        
        DragDropManager.makeElementDraggable(elementDiv, index);
        
        document.getElementById('appCanvas').appendChild(elementDiv);
        return elementDiv;
    },

    deleteElement: function(index) {
        const currentScreen = ScreensManager.getCurrentScreen();
        currentScreen.elements.splice(index, 1);
        this.renderScreenContent();
        EditorManager.clearSelection();
    },

    renderScreenContent: function() {
        const appCanvas = document.getElementById('appCanvas');
        const currentScreen = ScreensManager.getCurrentScreen();
        
        appCanvas.innerHTML = '';
        
        if (currentScreen.elements.length === 0) {
            appCanvas.innerHTML = '<div class="welcome-message">Перетащите элементы с панели выше</div>';
        } else {
            currentScreen.elements.forEach((element, index) => {
                this.createElementOnCanvas(element, index);
            });
        }
    },

    addElement: function(type, x, y) {
        const ElementClass = ElementTypes[type];
        if (!ElementClass) return;
        
        const elementInstance = new ElementClass();
        const currentScreen = ScreensManager.getCurrentScreen();
        const elementIndex = currentScreen.elements.length;
        
        // СОХРАНЯЕМ ВСЕ ДАННЫЕ ЭЛЕМЕНТА
        currentScreen.elements.push({
            type: type,
            html: elementInstance.html,
            x: x,
            y: y,
            content: elementInstance.defaultText, // Сохраняем начальный текст
            width: null,
            height: null,
            data: {}
        });
        
        this.createElementOnCanvas(currentScreen.elements[elementIndex], elementIndex);
        
        // Убираем приветственное сообщение
        const welcomeMsg = document.querySelector('.welcome-message');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }
    },

    updateElementPosition: function(index, x, y) {
        const currentScreen = ScreensManager.getCurrentScreen();
        if (currentScreen.elements[index]) {
            currentScreen.elements[index].x = x;
            currentScreen.elements[index].y = y;
        }
    }
};