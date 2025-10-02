const ButtonContract = {
    toContract: function(element, index) {
        return {
            type: 'button',
            position: {
                x: element.x,
                y: element.y
            },
            size: {
                width: element.width || '120px',
                height: element.height || '40px'
            },
            properties: {
                text: element.content || 'Кнопка',
                backgroundColor: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                textColor: 'white',
                borderRadius: '6px',
                action: 'none' // navigate, submit, custom
            },
            metadata: {
                element_id: `button_${index}`,
                interactive: true
            }
        };
    },

    fromContract: function(contract, elementDiv) {
        return elementDiv;
    },

    validate: function(contract) {
        return [];
    }
};