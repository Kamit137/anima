const CartContract = {
    toContract: function(element, index) {
        return {
            type: 'cart_panel',
            position: {
                x: element.x,
                y: element.y
            },
            size: {
                width: element.width || '280px',
                height: element.height || '180px'
            },
            properties: {
                title: 'Корзина',
                itemCount: element.data?.itemCount || '0 товаров',
                totalPrice: element.data?.totalPrice || '0 ₽',
                buttonText: 'Оформить заказ',
                promoText: element.data?.promoText || ''
            },
            metadata: {
                element_id: `cart_${index}`,
                dynamic_content: true,
                requires_cart_data: true
            },
            resources: {
                cart_api: '/api/cart/current',
                checkout_api: '/api/checkout'
            }
        };
    },

    fromContract: function(contract, elementDiv) {
        // Бэкенд загрузит актуальные данные корзины
        console.log('Загружаем данные корзины');
        return elementDiv;
    },

    validate: function(contract) {
        return [];
    }
};