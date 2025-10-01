// Реестр контрактов для каждого типа элемента
const ContractRegistry = {
    'text': TextContract,
    'button': ButtonContract,
    'image': ImageContract,
    'checkbox': CheckboxContract,
    'product_card': ProductContract,
    'cart_panel': CartContract,
    'back_bar': BackbarContract
};

const ContractManager = {
    // Генерация контракта для элемента
    elementToContract: function(element, index) {
        const contractHandler = ContractRegistry[element.type];
        if (!contractHandler) {
            console.warn(`No contract handler for element type: ${element.type}`);
            return null;
        }
        
        return contractHandler.toContract(element, index);
    },

    // Генерация контракта для экрана
    screenToContract: function(screen) {
        return {
            screen_id: screen.id,
            screen_name: screen.name,
            elements: screen.elements.map((element, index) => 
                this.elementToContract(element, index)
            ).filter(Boolean),
            metadata: {
                created: new Date().toISOString(),
                app_version: '1.0',
                sdui_version: '1.0',
                total_elements: screen.elements.length
            }
        };
    },

    // Генерация контракта для всего проекта
    projectToContract: function() {
        const screens = ScreensManager.screens;
        return {
            project: {
                name: 'AnimaConstruct Project',
                screens: screens.map(screen => this.screenToContract(screen)),
                navigation: {
                    type: 'bottom_tabs',
                    items: screens.map(screen => ({
                        screen_id: screen.id,
                        title: screen.name,
                        icon: screen.navIcon
                    }))
                }
            },
            styles: {
                theme: 'light',
                primary_color: '#6a11cb',
                secondary_color: '#2575fc'
            },
            metadata: {
                generated_at: new Date().toISOString(),
                sdui_spec: '1.0',
                generator: 'AnimaConstruct'
            }
        };
    },

    // Экспорт в JSON
    exportToJSON: function() {
        const contract = this.projectToContract();
        return JSON.stringify(contract, null, 2);
    },

    // Валидация всего контракта
    validateContract: function(contract) {
        const errors = [];
        
        if (!contract.project) {
            errors.push("Отсутствует объект project");
            return errors;
        }

        // Валидация каждого элемента
        contract.project.screens.forEach(screen => {
            screen.elements.forEach(element => {
                const contractHandler = ContractRegistry[element.type];
                if (contractHandler && contractHandler.validate) {
                    const elementErrors = contractHandler.validate(element);
                    errors.push(...elementErrors.map(err => `${element.type}: ${err}`));
                }
            });
        });

        return errors;
    },

    // Восстановление элемента из контракта (для бэкенда)
    elementFromContract: function(contract, elementDiv) {
        const contractHandler = ContractRegistry[contract.type];
        if (contractHandler && contractHandler.fromContract) {
            return contractHandler.fromContract(contract, elementDiv);
        }
        return elementDiv;
    }
};