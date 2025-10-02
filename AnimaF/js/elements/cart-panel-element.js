class CartPanelElement extends BaseElement {
    constructor() {
        super(
            'cart_panel',
            'Панель корзины',
            '🛒',
            `
            <div class="cart-panel" style="background:white;border-radius:12px;padding:16px;border:1px solid #e1e5e9;box-shadow:0 2px 8px rgba(0,0,0,0.1);min-width:250px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <div style="font-size:16px;font-weight:600;color:#2d3748;">Корзина</div>
                    <div style="font-size:14px;color:#718096;">2 товара</div>
                </div>
                
                <div style="border-bottom:1px solid #f1f5f9;padding-bottom:12px;margin-bottom:12px;">
                    <div class="cart-item" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <div class="cart-checkbox" style="width:16px;height:16px;border:2px solid #cbd5e0;border-radius:3px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
                                <div class="cart-checkmark" style="color:white;font-size:10px;font-weight:bold;display:none;">✓</div>
                            </div>
                            <span style="font-size:14px;color:#4a5568;">Товар 1</span>
                        </div>
                        <div style="font-size:14px;font-weight:600;color:#2d3748;">15 990 ₽</div>
                    </div>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <div style="font-size:14px;color:#718096;">Итого</div>
                    <div style="font-size:18px;font-weight:700;color:#6a11cb;">15 990 ₽</div>
                </div>
                
                <button class="checkout-button" style="width:100%;padding:12px;background:linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);color:white;border:none;border-radius:8px;font-weight:600;font-size:14px;cursor:pointer;transition:all 0.2s;">
                    Оформить заказ
                </button>
            </div>
            `,
            'Панель корзины'
        );
    }

    setupElement(elementDiv, index) {
        super.setupElement(elementDiv, index);
        
        // Обработчики для чекбоксов в корзине
        const checkboxes = elementDiv.querySelectorAll('.cart-checkbox');
        checkboxes.forEach((checkbox) => {
            const checkmark = checkbox.querySelector('.cart-checkmark');
            let isChecked = false;
            
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
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
            });
        });
        
        // Обработчик для кнопки оформления
        const checkoutBtn = elementDiv.querySelector('.checkout-button');
        checkoutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            alert('Переход к оформлению заказа');
        });
    }

    toContract(x, y, index, width, height) {
        const contract = super.toContract(x, y, index, width, height);
        
        contract.properties = {
            ...contract.properties,
            title: 'Корзина',
            item_count: '2 товара',
            total_price: '15 990 ₽',
            button_text: 'Оформить заказ'
        };
        
        return contract;
    }
}