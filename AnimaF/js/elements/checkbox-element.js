class CheckboxElement extends BaseElement {
    constructor() {
        super(
            'checkbox',
            'Чекбокс', 
            '☑️',
            `
            <div class="checkbox-container" style="display:flex;align-items:center;gap:12px;padding:12px;background:white;border-radius:8px;border:1px solid #e1e5e9;cursor:pointer;">
                <div class="checkbox" style="width:18px;height:18px;border:2px solid #cbd5e0;border-radius:4px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;background:white;">
                    <div class="checkmark" style="color:white;font-size:12px;font-weight:bold;display:none;">✓</div>
                </div>
                <span class="checkbox-label" style="font-size:14px;color:#2d3748;font-weight:500;">Выбрать товар</span>
            </div>
            `,
            'Чекбокс'
        );
    }

    setupElement(elementDiv, index) {
        super.setupElement(elementDiv, index);
        
        const checkbox = elementDiv.querySelector('.checkbox');
        const checkmark = elementDiv.querySelector('.checkmark');
        const label = elementDiv.querySelector('.checkbox-label');
        
        let isChecked = false;
        
        const toggleCheckbox = () => {
            isChecked = !isChecked;
            if (isChecked) {
                checkmark.style.display = 'flex';
                checkbox.style.backgroundColor = '#6a11cb';
                checkbox.style.borderColor = '#6a11cb';
            } else {
                checkmark.style.display = 'none';
                checkbox.style.backgroundColor = 'white';
                checkbox.style.borderColor = '#cbd5e0';
            }
            this.saveState(index, isChecked);
        };
        
        // Клик по чекбоксу
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCheckbox();
        });
        
        // Клик по всей области
        elementDiv.addEventListener('click', (e) => {
            if (!e.target.classList.contains('element-action')) {
                toggleCheckbox();
            }
        });
        
        // Двойной клик для редактирования текста
        label.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            const newText = prompt('Введите текст чекбокса:', label.textContent);
            if (newText !== null) {
                label.textContent = newText;
                this.saveLabel(index, newText);
            }
        });
    }

    saveState(index, isChecked) {
        const currentScreen = ScreensManager.getCurrentScreen();
        if (currentScreen.elements[index]) {
            currentScreen.elements[index].checked = isChecked;
        }
    }

    saveLabel(index, label) {
        const currentScreen = ScreensManager.getCurrentScreen();
        if (currentScreen.elements[index]) {
            currentScreen.elements[index].label = label;
        }
    }
}