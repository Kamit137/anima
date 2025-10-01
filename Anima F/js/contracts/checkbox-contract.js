const CheckboxContract = {
    toContract: function(element, index) {
        return {
            type: 'checkbox',
            position: {
                x: element.x,
                y: element.y
            },
            size: {
                width: element.width || '180px',
                height: element.height || '45px'
            },
            properties: {
                label: element.data?.label || 'Чекбокс',
                checked: element.data?.checked || false,
                color: '#6a11cb'
            },
            metadata: {
                element_id: `checkbox_${index}`,
                interactive: true,
                stateful: true
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