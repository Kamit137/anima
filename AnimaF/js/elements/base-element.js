// Базовый класс для всех элементов
class BaseElement {
    constructor(type, name, icon, html, defaultText) {
        this.type = type;
        this.name = name;
        this.icon = icon;
        this.html = html;
        this.defaultText = defaultText;
    }

    // Метод для создания DOM элемента
    createElement(x, y, index) {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'draggable-element';
        elementDiv.innerHTML = this.html;
        elementDiv.style.position = 'absolute';
        elementDiv.style.left = x + 'px';
        elementDiv.style.top = y + 'px';
        elementDiv.setAttribute('data-type', this.type);
        elementDiv.setAttribute('data-index', index);
        
        return elementDiv;
    }

    // Метод для настройки элемента (переопределяется в дочерних классах)
    setupElement(elementDiv, index) {
        // Базовая настройка
        this.addDeleteButton(elementDiv, index);
    }

    addDeleteButton(elementDiv, index) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'element-action';
        deleteBtn.innerHTML = '×';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            ElementsManager.deleteElement(index);
        });
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'element-actions';
        actionsDiv.appendChild(deleteBtn);
        elementDiv.appendChild(actionsDiv);
    }

    toContract(x, y, index, width, height) {
        return {
            id: `element_${index}_${Date.now()}`,
            type: this.type,
            name: this.name,
            position: {
                x: x,
                y: y
            },
            size: {
                width: width || 'auto',
                height: height || 'auto'
            },
            properties: {
                text: this.defaultText,
                styles: {}
            },
            metadata: {
                created: new Date().toISOString(),
                version: '1.0'
            }
        };
    }

    // ДЕСЕРИАЛИЗАЦИЯ ИЗ КОНТРАКТА SDUI
    fromContract(contract) {
        // Базовая реализация - переопределяется в дочерних классах
        const elementDiv = document.createElement('div');
        elementDiv.className = 'draggable-element';
        elementDiv.innerHTML = this.html;
        elementDiv.style.position = 'absolute';
        elementDiv.style.left = contract.position.x + 'px';
        elementDiv.style.top = contract.position.y + 'px';
        
        if (contract.size.width !== 'auto') {
            elementDiv.style.width = contract.size.width;
        }
        if (contract.size.height !== 'auto') {
            elementDiv.style.height = contract.size.height;
        }
        
        return elementDiv;
    }
}