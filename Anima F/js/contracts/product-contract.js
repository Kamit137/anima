const ProductContract = {
    toContract: function(element, index) {
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
                title: element.data?.productName || 'Название товара',
                price: element.data?.productPrice || '0 ₽',
                description: element.data?.productId ? `ID: ${element.data.productId}` : 'Описание товара',
                productId: element.data?.productId || null, // ID товара в БД
                buttonText: 'Купить'
            },
            metadata: {
                element_id: `product_${index}`,
                requires_product_data: !!element.data?.productId
            },
            resources: {
                product_api: element.data?.productId ? `/api/products/${element.data.productId}` : null,
                image_api: element.data?.productId ? `/api/products/${element.data.productId}/image` : null
            }
        };
    },

    fromContract: function(contract, elementDiv) {
        // Бэкенд загрузит данные товара по productId
        if (contract.properties.productId) {
            console.log('Загружаем данные товара:', contract.properties.productId);
        }
        return elementDiv;
    },

    validate: function(contract) {
        const errors = [];
        if (contract.properties.productId && !contract.properties.productId.startsWith('prod_')) {
            errors.push('ID товара должен начинаться с prod_');
        }
        return errors;
    }
};