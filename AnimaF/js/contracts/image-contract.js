const ImageContract = {
    toContract: function(element, index) {
        const placeholderImages = [
            '/api/placeholder/photo1.jpg',
            '/api/placeholder/photo2.jpg', 
            '/api/placeholder/photo3.jpg',
            '/api/placeholder/product1.jpg',
            '/api/placeholder/product2.jpg'
        ];
        
        // Выбираем случайную заглушку или используем существующую
        const imageSource = element.data?.imageSource || 
                           placeholderImages[index % placeholderImages.length];
        
        return {
            type: 'image',
            position: {
                x: element.x,
                y: element.y
            },
            size: {
                width: element.width || '100px',
                height: element.height || '100px'
            },
            properties: {
                alt: "Изображение",
                source: imageSource,
                placeholder: "🖼️ Изображение"
            },
            metadata: {
                element_id: `image_${index}`,
                is_placeholder: !element.data?.imageSource
            }
        };
    },

    fromContract: function(contract, elementDiv) {
        // Просто логируем какое изображение должно быть
        console.log(`Элемент изображения: ${contract.properties.source}`);
        return elementDiv;
    },

    validate: function(contract) {
        const errors = [];
        // Упрощенная валидация - проверяем только что source есть
        if (!contract.properties.source) {
            errors.push('Изображение должно иметь source');
        }
        return errors;
    }
};
