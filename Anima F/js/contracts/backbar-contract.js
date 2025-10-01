const BackbarContract = {
    toContract: function(element, index) {
        return {
            type: 'back_bar',
            position: {
                x: element.x,
                y: element.y
            },
            size: {
                width: element.width || '300px',
                height: element.height || '48px'
            },
            properties: {
                icon: element.data?.icon || '←',
                title: element.data?.title || 'Назад',
                backgroundColor: 'white',
                showBorder: true
            },
            metadata: {
                element_id: `backbar_${index}`,
                navigation: true,
                interactive: true
            }
        };
    },

    fromContract: function(contract, elementDiv) {
        return elementDiv;
    },

    validate: function(contract) {
        const errors = [];
        if (contract.properties.title.length > 20) {
            errors.push('Заголовок слишком длинный');
        }
        return errors;
    }
};