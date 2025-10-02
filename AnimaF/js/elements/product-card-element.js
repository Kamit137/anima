class ProductCardElement extends BaseElement {
    constructor() {
        super(
            'product_card',
            'Карточка товара',
            '📦',
            `
            <div class="product-card" style="border:1px solid #e1e5e9;border-radius:12px;padding:15px;background:white;max-width:200px;">
                <div class="product-price" style="font-size:18px;font-weight:700;color:#2c3e50;margin-bottom:8px;">4 990 ₽</div>
                <div class="product-title" style="font-size:14px;font-weight:600;color:#2c3e50;margin-bottom:4px;">Название товара</div>
                <div class="product-description" style="font-size:12px;color:#7f8c8d;margin-bottom:12px;">Описание товара</div>
                <button class="buy-button" style="width:100%;padding:10px;background:linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);color:white;border:none;border-radius:6px;font-weight:600;cursor:pointer;transition:all 0.2s;">Купить</button>
            </div>
            `,
            'Карточка товара'
        );
    }

    setupElement(elementDiv, index) {
        super.setupElement(elementDiv, index);
        
        const buyButton = elementDiv.querySelector('.buy-button');
        buyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            alert('Товар добавлен в корзину!');
        });
    }

    toContract(x, y, index, width, height) {
        const contract = super.toContract(x, y, index, width, height);
        
        contract.properties = {
            ...contract.properties,
            price: '4 990 ₽',
            title: 'Название товара',
            description: 'Описание товара',
            button_text: 'Купить'
        };
        
        return contract;
    }
}