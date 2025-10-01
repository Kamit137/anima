class CheckoutFormHandler {
    constructor() {
        this.currentValues = JSON.parse(JSON.stringify(CHECKOUT_DEFAULT_VALUES));
    }

    renderControls() {
        const container = document.getElementById('checkoutControlsContainer');
        let html = '';

        CHECKOUT_CONTROL_CONFIG.forEach((section, index) => {
            html += this.renderControlSection(section, index);
        });

        // Блок предпросмотра JSON
        html += `
            <div class="control-group">
                <h3>📄 JSON конфигурация чекаута</h3>
                <div class="json-preview" id="checkoutJsonPreview"></div>
            </div>
        `;

        container.innerHTML = html;
        this.initializeDynamicEventListeners();
        this.applySettingsToForm(this.currentValues);
        checkoutSettingsManager.updateJsonPreview();
    }

    renderControlSection(section, index) {
        let controlsHtml = '';

        if (section.type === 'bank') {
            controlsHtml = this.renderBankControls(section.controls, section.bankIndex);
        }

        return `
            <div class="control-group" data-section="bank-${index}">
                <h3>${section.title}</h3>
                ${controlsHtml}
            </div>
        `;
    }

    renderBankControls(controls, bankIndex) {
        return `
            <div class="bank-controls">
                ${controls.map(control => {
                    if (control.type === 'toggle') {
                        return this.renderToggleControl(control, bankIndex);
                    } else if (control.type === 'text') {
                        return this.renderTextControl(control, bankIndex);
                    }
                }).join('')}
            </div>
        `;
    }

    renderToggleControl(control, bankIndex) {
        return `
            <div class="toggle-item">
                <span class="toggle-label">${control.label}</span>
                <label class="switch">
                    <input type="checkbox" id="${control.id}" 
                           data-bank-index="${bankIndex}" data-field="${control.id.replace(`bank${bankIndex + 1}-`, '')}">
                    <span class="slider"></span>
                </label>
            </div>
        `;
    }

    renderTextControl(control, bankIndex) {
        return `
            <div class="text-control-item">
                <label class="text-control-label">${control.label}</label>
                <input type="text" id="${control.id}" 
                       class="text-control-input"
                       data-bank-index="${bankIndex}" 
                       data-field="${control.id.replace(`bank${bankIndex + 1}-`, '')}"
                       placeholder="Введите ${control.label.toLowerCase()}">
            </div>
        `;
    }

    initializeDynamicEventListeners() {
        // Чекбоксы
        document.querySelectorAll('#checkoutControlsContainer input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', () => {
                this.updateBankValue(
                    input.dataset.bankIndex,
                    input.dataset.field,
                    input.checked
                );
            });
        });

        // Текстовые поля
        document.querySelectorAll('#checkoutControlsContainer .text-control-input').forEach(input => {
            input.addEventListener('input', () => {
                this.updateBankValue(
                    input.dataset.bankIndex,
                    input.dataset.field, 
                    input.value
                );
            });
        });
    }

    updateBankValue(bankIndex, field, value) {
        if (this.currentValues.CheckoutContainer.banks[bankIndex]) {
            this.currentValues.CheckoutContainer.banks[bankIndex][field] = value;
            checkoutSettingsManager.updateJsonPreview();
            console.log(`Bank ${bankIndex} updated: ${field} = ${value}`);
        }
    }

    applySettingsToForm(values) {
        this.currentValues = values;

        if (values.CheckoutContainer && values.CheckoutContainer.banks) {
            values.CheckoutContainer.banks.forEach((bank, index) => {
                this.applyBankValues(bank, index);
            });
        }

        checkoutSettingsManager.updateJsonPreview();
    }

    applyBankValues(bank, bankIndex) {
        const bankNumber = bankIndex + 1;
        
        // Применяем значения к форме
        Object.keys(bank).forEach(field => {
            const elementId = `bank${bankNumber}-${field}`;
            const element = document.getElementById(elementId);
            
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = bank[field];
                } else {
                    element.value = bank[field] || '';
                }
            }
        });
    }

    getCurrentFormValues() {
        return this.currentValues;
    }
}

const checkoutFormHandler = new CheckoutFormHandler();