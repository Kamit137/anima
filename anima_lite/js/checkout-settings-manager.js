class CheckoutSettingsManager {
    constructor() {
        this.currentValues = JSON.parse(JSON.stringify(CHECKOUT_DEFAULT_VALUES));
    }

    loadSettings() {
        const saved = localStorage.getItem('checkoutSettings');
        if (saved) {
            this.currentValues = JSON.parse(saved);
        }
        return this.currentValues;
    }

    saveSettings() {
        this.currentValues = checkoutFormHandler.getCurrentFormValues();
        localStorage.setItem('checkoutSettings', JSON.stringify(this.currentValues));
        this.updateJsonPreview();
        
        console.log('Сохраненные настройки чекаута:', this.currentValues);
    }

    resetSettings() {
        if (confirm('Вы уверены, что хотите сбросить настройки чекаута?')) {
            this.currentValues = JSON.parse(JSON.stringify(CHECKOUT_DEFAULT_VALUES));
            checkoutFormHandler.applySettingsToForm(this.currentValues);
            this.updateJsonPreview();
            localStorage.removeItem('checkoutSettings');
        }
    }

    generateOutputJSON() {
        const outputJSON = JSON.parse(JSON.stringify(CHECKOUT_JSON_TEMPLATE));
        const currentValues = checkoutFormHandler.getCurrentFormValues();
        
        // Обновляем banks реальными значениями
        if (currentValues.CheckoutContainer && currentValues.CheckoutContainer.banks) {
            outputJSON.CheckoutContainer.banks = currentValues.CheckoutContainer.banks;
        }

        return outputJSON;
    }

    updateJsonPreview() {
        const previewElement = document.getElementById('checkoutJsonPreview');
        if (previewElement) {
            const outputJSON = this.generateOutputJSON();
            previewElement.textContent = JSON.stringify(outputJSON, null, 2);
            this.highlightJSON(previewElement);
        }
    }

    highlightJSON(element) {
        const jsonText = element.textContent;
        const highlighted = jsonText
            .replace(/"(\w+)":/g, '<span class="json-key">"$1"</span>:')
            .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
            .replace(/: ("[^"]*")/g, ': <span class="json-string">$1</span>');
        
        element.innerHTML = highlighted;
    }

    getCurrentValues() {
        return this.currentValues;
    }
}

const checkoutSettingsManager = new CheckoutSettingsManager();