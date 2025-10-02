const ProductContract = {
    toContract: function(element, index) {
        // Заглушки для товаров
        const mockProducts = [
            { id: 'prod_1', name: 'Смартфон', price: '29 990 ₽' },
            { id: 'prod_2', name: 'Наушники', price: '4 990 ₽' },
            { id: 'prod_3', name: 'Ноутбук', price: '89 990 ₽' },
            { id: 'prod_4', name: 'Часы', price: '14 990 ₽' }
        ];
        
        const product = mockProducts[index % mockProducts.length];
        
        return {
            type: 'product_card',
            position: {
                x: element.x,
                y: element.y
            },
            size: {
                width: element.width || '200px',
                height: element.height || '140px'
            },
            properties: {
                title: element.data?.productName || product.name,
                price: element.data?.productPrice || product.price,
                description: element.data?.productId ? `ID: ${element.data.productId}` : 'Популярный товар',
                productId: element.data?.productId || product.id,
                buttonText: 'Купить'
            },
            metadata: {
                element_id: `product_${index}`,
                is_mock_data: !element.data?.productId
            }
        };
    },

    fromContract: function(contract, elementDiv) {
        console.log(`Карточка товара: ${contract.properties.title}`);
        return elementDiv;
    },

    validate: function(contract) {
        return []; // Упрощаем валидацию
    }
};
