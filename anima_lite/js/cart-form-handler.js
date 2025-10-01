class CartFormHandler {
    constructor() {
        this.currentValues = JSON.parse(JSON.stringify(DEFAULT_VALUES));
    }

    renderControls() {
        const container = document.getElementById('cartControlsContainer');
        let html = '';

        CONTROL_CONFIG.forEach((section, index) => {
            html += this.renderControlSection(section, index);
        });

        // Блок предпросмотра JSON
        html += `
            <div class="control-group">
                <h3>📄 JSON конфигурация корзины</h3>
                <div class="json-preview" id="cartJsonPreview"></div>
            </div>
        `;

        container.innerHTML = html;
        this.initializeDynamicEventListeners();
        this.applySettingsToForm(this.currentValues);
        cartSettingsManager.updateJsonPreview();
    }

    renderControlSection(section, index) {
        let controlsHtml = '';

        switch (section.type) {
            case 'toggle':
                controlsHtml = this.renderToggleControls(section.controls);
                break;
            case 'radio':
                controlsHtml = this.renderRadioControls(section);
                break;
            case 'color':
                controlsHtml = this.renderColorControls(section.controls);
                break;
            case 'border':
                controlsHtml = this.renderBorderControls(section.controls);
                break;
        }

        return `
            <div class="control-group" data-section="${section.type}-${index}">
                <h3>${section.title}</h3>
                ${controlsHtml}
            </div>
        `;
    }

    renderToggleControls(controls) {
        return `
            <div class="toggle-group">
                ${controls.map(control => `
                    <div class="toggle-item">
                        <span class="toggle-label">${control.label}</span>
                        <label class="switch">
                            <input type="checkbox" id="${control.id}">
                            <span class="slider"></span>
                        </label>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderRadioControls(section) {
        return `
            <div class="radio-group">
                ${section.options.map(option => `
                    <label class="radio-item">
                        <input type="radio" name="${section.name}" 
                               value="${option.value}" id="${section.name}-${option.value}">
                        <span>${option.label}</span>
                    </label>
                `).join('')}
            </div>
        `;
    }

    renderColorControls(controls) {
        return `
            <div class="color-group">
                ${controls.map(control => `
                    <div class="color-item">
                        <span class="color-label">${control.label}</span>
                        <div class="color-input-wrapper">
                            <input type="color" id="${control.id}" class="color-picker">
                            <input type="text" id="${control.id}-text" class="color-text" placeholder="#FFFFFF">
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderBorderControls(controls) {
        return `
            <div class="border-group">
                ${controls.map(control => `
                    <div class="border-item">
                        <span class="border-label">${control.label}</span>
                        <select id="${control.id}" class="border-select">
                            <option value="1px">Тонкая (1px)</option>
                            <option value="2px">Средняя (2px)</option>
                            <option value="3px">Толстая (3px)</option>
                            <option value="4px">Очень толстая (4px)</option>
                            <option value="5px">Экстра толстая (5px)</option>
                        </select>
                    </div>
                `).join('')}
            </div>
        `;
    }

    initializeDynamicEventListeners() {
        // Чекбоксы
        document.querySelectorAll('#cartControlsContainer input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', () => {
                this.updateGlobalSetting(input.id, input.checked);
            });
        });

        // Радиокнопки
        document.querySelectorAll('#cartControlsContainer input[type="radio"]').forEach(input => {
            input.addEventListener('change', () => {
                if (input.checked) {
                    this.updateGlobalSetting(input.name, input.value);
                }
            });
        });

        // Цветовые пикеры
        document.querySelectorAll('#cartControlsContainer .color-picker').forEach(picker => {
            picker.addEventListener('input', (e) => {
                const textId = e.target.id + '-text';
                document.getElementById(textId).value = e.target.value;
                this.updateStylingValue(e.target.id, e.target.value);
            });
        });

        // Текстовые поля цветов
        document.querySelectorAll('#cartControlsContainer .color-text').forEach(input => {
            input.addEventListener('input', (e) => {
                const pickerId = e.target.id.replace('-text', '');
                const color = e.target.value;
                if (this.isValidColor(color)) {
                    document.getElementById(pickerId).value = color;
                    this.updateStylingValue(pickerId, color);
                }
            });
        });

        // Селекты рамок
        document.querySelectorAll('#cartControlsContainer .border-select').forEach(select => {
            select.addEventListener('change', () => {
                this.updateStylingValue(select.id, select.value);
            });
        });
    }

    updateGlobalSetting(key, value) {
        this.currentValues.CartContainer.globalSettings[key] = value;
        cartSettingsManager.updateJsonPreview();
        console.log(`Global setting updated: ${key} = ${value}`);
    }

    updateStylingValue(key, value) {
        // Определяем категорию стиля
        if (key.includes('shop')) {
            this.currentValues.CartContainer.styling.shopHighlight[key] = value;
        } else {
            this.currentValues.CartContainer.styling.productHighlight[key] = value;
        }
        cartSettingsManager.updateJsonPreview();
        console.log(`Styling updated: ${key} = ${value}`);
    }

    isValidColor(color) {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    }

    applySettingsToForm(values) {
        this.currentValues = values;
        const { globalSettings, styling } = values.CartContainer;

        console.log('Applying settings to form:', values);

        // Применяем глобальные настройки
        if (globalSettings) {
            // Чекбоксы
            if (document.getElementById('showRating')) {
                document.getElementById('showRating').checked = globalSettings.showRating;
            }
            
            // Радиокнопки orientation
            if (globalSettings.orientation) {
                const orientationRadio = document.querySelector(`input[name="orientation"][value="${globalSettings.orientation}"]`);
                if (orientationRadio) orientationRadio.checked = true;
            }
            
            // Радиокнопки deliveryButtonStyle
            if (globalSettings.deliveryButtonStyle) {
                const styleRadio = document.querySelector(`input[name="deliveryButtonStyle"][value="${globalSettings.deliveryButtonStyle}"]`);
                if (styleRadio) styleRadio.checked = true;
            }
        }

        // Применяем стили товаров
        if (styling && styling.productHighlight) {
            const ph = styling.productHighlight;
            
            this.applyColorValue('highlightBackground', ph.highlightBackground);
            this.applyColorValue('highlightPriceColor', ph.highlightPriceColor);
            this.applyColorValue('highlightBorderColor', ph.highlightBorderColor);
            
            if (ph.highlightBorderWidth && document.getElementById('highlightBorderWidth')) {
                document.getElementById('highlightBorderWidth').value = ph.highlightBorderWidth;
            }
        }

        // Применяем стили магазинов
        if (styling && styling.shopHighlight) {
            const sh = styling.shopHighlight;
            
            this.applyColorValue('shopBackground', sh.shopBackground);
            this.applyColorValue('shopBorderColor', sh.shopBorderColor);
            
            if (sh.shopBorderWidth && document.getElementById('shopBorderWidth')) {
                document.getElementById('shopBorderWidth').value = sh.shopBorderWidth;
            }
        }
    }

    applyColorValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element && value) {
            element.value = value;
            const textElement = document.getElementById(elementId + '-text');
            if (textElement) textElement.value = value;
        }
    }

    getCurrentFormValues() {
        return this.currentValues;
    }
}

const cartFormHandler = new CartFormHandler();