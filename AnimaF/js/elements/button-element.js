class ButtonElement extends BaseElement {
    constructor() {
        super(
            'button',
            'Кнопка',
            'B',
            '<button class="app-button" style="padding:12px 20px;background:linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;transition:all 0.2s;min-width:100px;">Кнопка</button>',
            'Кнопка'
        );
    }

    setupElement(elementDiv, index) {
        super.setupElement(elementDiv, index);
        
        const button = elementDiv.querySelector('.app-button');
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            alert('Кнопка нажата!');
        });
    }

    toContract(x, y, index, width, height) {
        const contract = super.toContract(x, y, index, width, height);
        
        contract.properties = {
            ...contract.properties,
            text: 'Кнопка',
            background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
            text_color: 'white',
            action: 'alert'
        };
        
        return contract;
    }
}