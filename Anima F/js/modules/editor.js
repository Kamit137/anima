// Панель редактирования элементов
const EditorManager = {
    selectedElement: null,

    init: function() {
        this.showEditPanel(-1);
    },

    selectElement: function(elementDiv, index) {
        this.clearSelection();
        
        elementDiv.classList.add('selected');
        this.selectedElement = { element: elementDiv, index: index };
        this.showEditPanel(index);
    },

    clearSelection: function() {
        const selected = document.querySelector('.draggable-element.selected');
        if (selected) {
            selected.classList.remove('selected');
        }
        this.selectedElement = null;
        this.showEditPanel(-1);
    },

    showEditPanel: function(index) {
        const editPanel = document.getElementById('editContent');
        
        if (index === -1) {
            editPanel.innerHTML = '<div class="no-element">Выберите элемент для редактирования</div>';
            return;
        }
        
        const currentScreen = ScreensManager.getCurrentScreen();
        const element = currentScreen.elements[index];
        
        if (!element) {
            editPanel.innerHTML = '<div class="no-element">Элемент не найден</div>';
            return;
        }
        
        console.log('Editing element:', element);
        
        // Получаем текущие размеры
        let currentWidth = '';
        let currentHeight = '';
        
        if (element.width) {
            currentWidth = parseInt(element.width);
        }
        if (element.height) {
            currentHeight = parseInt(element.height);
        }
        
        // Получаем текущий текст
        let currentText = '';
        if (element.type === 'text' || element.type === 'button') {
            currentText = element.content || this.getDefaultText(element.type);
        }
        
        // РАЗДЕЛЯЕМ ЛОГИКУ ДЛЯ РАЗНЫХ ТИПОВ ЭЛЕМЕНТОВ
        
        // 1. Элементы с полным редактированием (текст, кнопка)
        if (element.type === 'text' || element.type === 'button') {
            editPanel.innerHTML = `
                <div class="edit-section">
                    <h3>Текст</h3>
                    <input type="text" class="edit-input" id="editText" value="${currentText}" placeholder="Текст элемента">
                </div>
                <div class="edit-section">
                    <h3>Цвет</h3>
                    <div class="color-picker" id="colorPicker">
                        ${this.getColorOptions()}
                    </div>
                </div>
                <div class="edit-section">
                    <h3>Размер</h3>
                    <input type="number" class="edit-input" id="editWidth" placeholder="Ширина (px)" value="${currentWidth}">
                    <input type="number" class="edit-input" id="editHeight" placeholder="Высота (px)" value="${currentHeight}">
                </div>
                <div class="edit-section">
                    <button class="btn-primary" id="applyChanges">Применить изменения</button>
                </div>
            `;
        }
        // 2. Элементы только с редактированием размера
        else if (element.type === 'image' || element.type === 'checkbox' || element.type === 'product_card' || element.type === 'cart_panel' || element.type === 'back_bar') {
            editPanel.innerHTML = `
                <div class="edit-section">
                    <h3>${this.getElementDisplayName(element.type)}</h3>
                    <div style="color:#666;font-size:12px;margin-bottom:10px;">
                        Этот элемент редактируется непосредственно на холсте
                    </div>
                </div>
                <div class="edit-section">
                    <h3>Размер</h3>
                    <input type="number" class="edit-input" id="editWidth" placeholder="Ширина (px)" value="${currentWidth}">
                    <input type="number" class="edit-input" id="editHeight" placeholder="Высота (px)" value="${currentHeight}">
                </div>
                <div class="edit-section">
                    <button class="btn-primary" id="applyChanges">Применить изменения размера</button>
                </div>
            `;
        }
        // 3. Неизвестные элементы
        else {
            editPanel.innerHTML = `
                <div class="edit-section">
                    <h3>Неизвестный элемент</h3>
                    <div style="color:#666;font-size:12px;">
                        Тип элемента: ${element.type}
                    </div>
                </div>
            `;
            return;
        }
        
        this.setupEditListeners(index);
    },
    
    getElementDisplayName: function(type) {
        const names = {
            'text': 'Текст',
            'button': 'Кнопка',
            'image': 'Изображение',
            'checkbox': 'Чекбокс',
            'product_card': 'Карточка товара',
            'cart_panel': 'Панель корзины',
            'back_bar': 'Навигационная панель'
        };
        return names[type] || 'Элемент';
    },

    getDefaultText: function(type) {
        const texts = {
            'text': 'Текст элемента',
            'button': 'Кнопка'
        };
        return texts[type] || '';
    },

    getColorOptions: function() {
        const colors = ['#6a11cb', '#2575fc', '#ff6b6b', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e74c3c'];
        return colors.map(color => 
            `<div class="color-option" style="background-color: ${color};" data-color="${color}"></div>`
        ).join('');
    },

    setupEditListeners: function(index) {
        document.getElementById('applyChanges').addEventListener('click', () => {
            this.applyElementChanges(index);
        });
        
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    },

    applyElementChanges: function(index) {
        const currentScreen = ScreensManager.getCurrentScreen();
        const element = currentScreen.elements[index];
        
        console.log('=== APPLYING CHANGES ===');
        console.log('Element before changes:', element);
        
        // БЕЗОПАСНО получаем значения (с проверкой на существование)
        const editText = document.getElementById('editText');
        const editWidth = document.getElementById('editWidth');
        const editHeight = document.getElementById('editHeight');
        const selectedColor = document.querySelector('.color-option.selected');
        
        const newText = editText ? editText.value : null;
        const newWidth = editWidth ? editWidth.value : null;
        const newHeight = editHeight ? editHeight.value : null;
        const newColor = selectedColor ? selectedColor.getAttribute('data-color') : null;
        
        console.log('Form values:', { newWidth, newHeight, newText, newColor, elementType: element.type });
        
        // ОБНОВЛЯЕМ ДАННЫЕ ЭЛЕМЕНТА БЕЗ ПОЛНОЙ ПЕРЕРИСОВКИ
        const currentElement = document.querySelector(`.draggable-element[data-index="${index}"]`);
        
        if (currentElement) {
            // 1. Обновляем размеры
            if (newWidth) {
                element.width = newWidth + 'px';
                currentElement.style.width = element.width;
                console.log('Width updated to:', element.width);
            }
            if (newHeight) {
                element.height = newHeight + 'px';
                currentElement.style.height = element.height;
                console.log('Height updated to:', element.height);
            }
            
            // 2. Обновляем текст (только для текстовых элементов и кнопок)
            if (newText !== null && (element.type === 'text' || element.type === 'button')) {
                element.content = newText;
                console.log('Content updated to:', newText);
                
                if (element.type === 'text') {
                    const textElement = currentElement.querySelector('[contenteditable="true"]');
                    if (textElement) {
                        textElement.textContent = newText;
                        console.log('Text element updated');
                    }
                } else if (element.type === 'button') {
                    const buttonElement = currentElement.querySelector('.app-button');
                    if (buttonElement) {
                        buttonElement.textContent = newText;
                        console.log('Button text updated');
                        
                        // Также обновляем HTML для сохранения
                        element.html = element.html.replace(/>[^<]*</, `>${newText}<`);
                    }
                }
            }
            
            // 3. Обновляем цвет (только для кнопок и текста)
            if (newColor && (element.type === 'button' || element.type === 'text')) {
                console.log('Applying color:', newColor);
                
                if (element.type === 'button') {
                    const buttonElement = currentElement.querySelector('.app-button');
                    if (buttonElement) {
                        buttonElement.style.background = newColor;
                        // Сохраняем в HTML
                        element.html = element.html.replace(/background:[^;]+;?/, `background: ${newColor};`);
                    }
                } else if (element.type === 'text') {
                    const textElement = currentElement.querySelector('[contenteditable="true"]');
                    if (textElement) {
                        textElement.style.color = newColor;
                        // Для текста сохраняем стиль в данных
                        if (!element.data) element.data = {};
                        element.data.color = newColor;
                    }
                }
            }
            
            // 4. Показываем уведомление об успешном применении
            const applyBtn = document.getElementById('applyChanges');
            const originalText = applyBtn.textContent;
            applyBtn.textContent = '✓ Применено!';
            applyBtn.style.background = '#2ecc71';
            
            setTimeout(() => {
                applyBtn.textContent = originalText;
                applyBtn.style.background = '';
            }, 1000);
            
        } else {
            console.error('Element not found in DOM for index:', index);
            alert('Ошибка: элемент не найден');
            return;
        }
        
        console.log('Element after changes:', element);
        console.log('=== CHANGES APPLIED SUCCESSFULLY ===');
        
        // НЕ вызываем renderScreenContent() - всё обновляем на месте
        // ElementsManager.renderScreenContent(); // ЗАКОММЕНТИРОВАТЬ!
        
        // Обновляем панель редактирования чтобы показать актуальные значения
        this.showEditPanel(index);
    }
};