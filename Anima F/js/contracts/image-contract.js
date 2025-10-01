const ImageContract = {
    // Генерация контракта для изображения
    toContract: function(element, index) {
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
                source: element.data?.imageSource || '', // Ссылка на изображение в БД
                placeholder: "🖼️ Изображение"
            },
            metadata: {
                element_id: `image_${index}`,
                requires_upload: !element.data?.imageSource
            }
        };
    },

    // Восстановление изображения из контракта
    fromContract: function(contract, elementDiv) {
        // Если есть ссылка на изображение - можно загрузить
        if (contract.properties.source) {
            console.log('Загружаем изображение из:', contract.properties.source);
            // Здесь бэкенд загрузит изображение по ссылке
        }
        return elementDiv;
    },

    // Валидация контракта изображения
    validate: function(contract) {
        const errors = [];
        if (contract.properties.source && !contract.properties.source.startsWith('/api/')) {
            errors.push('URL изображения должен начинаться с /api/');
        }
        return errors;
    }
};