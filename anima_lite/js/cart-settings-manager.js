class CartSettingsManager {
    constructor() {
        this.currentValues = JSON.parse(JSON.stringify(DEFAULT_VALUES));
    }

    loadSettings() {
        const saved = localStorage.getItem('cartSettings');
        if (saved) {
            this.currentValues = JSON.parse(saved);
        }
        return this.currentValues;
    }

    saveSettings() {
        this.currentValues = cartFormHandler.getCurrentFormValues();
        localStorage.setItem('cartSettings', JSON.stringify(this.currentValues));
        this.updateJsonPreview();
        this.showNotification('✅ Настройки корзины успешно сохранены!');
        
        console.log('Сохраненные значения корзины:', this.currentValues);
    }

    resetSettings() {
        if (confirm('Вы уверены, что хотите сбросить настройки корзины?')) {
            this.currentValues = JSON.parse(JSON.stringify(DEFAULT_VALUES));
            cartFormHandler.applySettingsToForm(this.currentValues);
            this.updateJsonPreview();
            localStorage.removeItem('cartSettings');
            this.showNotification('Настройки корзины сброшены к значениям по умолчанию');
        }
    }

    generateOutputJSON() {
        const outputJSON = JSON.parse(JSON.stringify(JSON_TEMPLATE));
        const currentValues = cartFormHandler.getCurrentFormValues();
        const { globalSettings, styling } = currentValues.CartContainer;
        
        console.log('Current values for JSON generation:', currentValues);
        
        // Обновляем globalSettings реальными значениями
        Object.keys(globalSettings).forEach(key => {
            if (outputJSON.CartContainer.globalSettings.hasOwnProperty(key)) {
                outputJSON.CartContainer.globalSettings[key] = globalSettings[key];
            }
        });

        // Обновляем styling реальными значениями вместо шаблонных
        if (styling.productHighlight) {
            Object.keys(styling.productHighlight).forEach(key => {
                if (outputJSON.CartContainer.styling.productHighlight.hasOwnProperty(key)) {
                    outputJSON.CartContainer.styling.productHighlight[key] = styling.productHighlight[key];
                }
            });
        }

        if (styling.shopHighlight) {
            Object.keys(styling.shopHighlight).forEach(key => {
                if (outputJSON.CartContainer.styling.shopHighlight.hasOwnProperty(key)) {
                    outputJSON.CartContainer.styling.shopHighlight[key] = styling.shopHighlight[key];
                }
            });
        }

        return outputJSON;
    }

    updateJsonPreview() {
        const previewElement = document.getElementById('cartJsonPreview');
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
            .replace(/: ("[^"]*")/g, ': <span class="json-string">$1</span>')
            .replace(/: (\d+px)/g, ': <span class="json-number">$1</span>');
        
        element.innerHTML = highlighted;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-weight: 600;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    getCurrentValues() {
        return this.currentValues;
    }
}

const cartSettingsManager = new CartSettingsManager();