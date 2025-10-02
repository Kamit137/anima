class TextElement extends BaseElement {
    constructor() {
        super(
            'text',
            'Текст',
            'T',
            '<div contenteditable="true" style="padding: 8px; min-width: 100px; border: 1px dashed #ccc; border-radius: 4px;">Текст элемента</div>',
            'Текст элемента'
        );
    }

    setupElement(elementDiv, index) {
        super.setupElement(elementDiv, index);
        
        // Настройка редактируемого текста
        const textElement = elementDiv.querySelector('div[contenteditable="true"]');
        textElement.addEventListener('input', () => {
            this.saveContent(index, textElement.innerHTML);
        });
    }

    saveContent(index, content) {
        const currentScreen = ScreensManager.getCurrentScreen();
        if (currentScreen.elements[index]) {
            currentScreen.elements[index].content = content;
        }
    }

    // СЕРИАЛИЗАЦИЯ В КОНТРАКТ SDUI
    toContract(x, y, index, width, height) {
        const contract = super.toContract(x, y, index, width, height);
        
        // Добавляем специфичные для текста свойства
        const currentScreen = ScreensManager.getCurrentScreen();
        const element = currentScreen.elements[index];
        
        contract.properties = {
            ...contract.properties,
            content: element?.content || this.defaultText,
            text_align: 'left',
            font_size: '14px',
            color: '#333333',
            editable: true,
            font_family: 'Segoe UI, sans-serif'
        };
        
        return contract;
    }

    // ДЕСЕРИАЛИЗАЦИЯ ИЗ КОНТРАКТА SDUI
    fromContract(contract) {
        const elementDiv = super.fromContract(contract);
        
        // Восстанавливаем текст
        const textElement = elementDiv.querySelector('[contenteditable="true"]');
        if (textElement && contract.properties.content) {
            textElement.textContent = contract.properties.content;
        }
        
        // Восстанавливаем стили если есть
        if (contract.properties.color) {
            textElement.style.color = contract.properties.color;
        }
        if (contract.properties.font_size) {
            textElement.style.fontSize = contract.properties.font_size;
        }
        if (contract.properties.text_align) {
            textElement.style.textAlign = contract.properties.text_align;
        }
        
        return elementDiv;
    }
}