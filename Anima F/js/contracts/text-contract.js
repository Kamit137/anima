const TextContract = {
    toContract: function(element, index) {
        return {
            type: 'text',
            position: {
                x: element.x,
                y: element.y
            },
            size: {
                width: element.width || '150px',
                height: element.height || 'auto'
            },
            properties: {
                content: element.content || 'Текст элемента',
                fontSize: '14px',
                color: '#333333',
                textAlign: 'left',
                editable: true
            },
            metadata: {
                element_id: `text_${index}`,
                contains_user_text: true
            }
        };
    },

    fromContract: function(contract, elementDiv) {
        // Простой текст - не требует дополнительной загрузки
        return elementDiv;
    },

    validate: function(contract) {
        return []; // Текст всегда валиден
    }
};