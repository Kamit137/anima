let ElementTypes = {};

function registerElement(type, elementClass) {
    ElementTypes[type] = elementClass;
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Регистрируем ТОЛЬКО нужные элементы
    registerElement('text', TextElement);
    registerElement('button', ButtonElement);
    registerElement('image', ImageElement);
    registerElement('checkbox', CheckboxElement);
    registerElement('product_card', ProductCardElement);
    registerElement('cart_panel', CartPanelElement);
    registerElement('back_bar', BackBarElement);
    
    console.log('ElementTypes registered:', Object.keys(ElementTypes));
});