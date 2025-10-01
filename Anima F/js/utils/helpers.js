// Вспомогательные функции
const Helpers = {
    // Генерация уникального ID
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Ограничение числа в диапазоне
    clamp: (value, min, max) => {
        return Math.max(min, Math.min(value, max));
    },

    // Привязка к сетке
    snapToGrid: (value, gridSize) => {
        return Math.round(value / gridSize) * gridSize;
    },

    // Дебаунс
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Константы
const Constants = {
    elements: [
        { 
            type: 'text', 
            name: 'Текст', 
            icon: 'T', 
            html: '<div contenteditable="true" style="padding: 5px; min-width: 100px;">Текст элемента</div>',
            defaultText: 'Текст элемента'
        },
        { 
            type: 'button', 
            name: 'Кнопка', 
            icon: 'B', 
            html: '<button class="app-button">Кнопка</button>',
            defaultText: 'Кнопка'
        },
        {
            type: 'image', 
            name: 'Изображение', 
            icon: '🖼️', 
            html: `
                <div class="image-container" style="width:100%;height:100px;background:linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;border-radius:5px;position:relative;overflow:hidden;">
                    <div class="image-placeholder">Изображение</div>
                    <input type="file" accept="image/*" class="image-upload-input" style="display:none;">
                    <button class="image-upload-btn" style="position:absolute;bottom:5px;right:5px;background:rgba(0,0,0,0.7);color:white;border:none;border-radius:3px;padding:2px 6px;font-size:10px;cursor:pointer;">📁</button>
                </div>
            `,
            defaultText: 'Изображение'
        },
        
        {
            type: 'product_gallery', 
            name: 'Лента товаров', 
            icon: '🛍️', 
            html: `
                <div class="product-gallery" style="width:100%;height:120px;background:#f8f9fa;border-radius:8px;overflow:hidden;position:relative;">
                    <div class="gallery-container" style="display:flex;height:100%;transition:transform 0.3s ease;">
                        <div class="gallery-item empty" style="min-width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#666;flex-direction:column;gap:8px;">
                            <div style="font-size:24px">🛍️</div>
                            <div>Добавьте товары</div>
                            <button class="add-product-btn" style="background:#6a11cb;color:white;border:none;padding:6px 12px;border-radius:4px;font-size:12px;cursor:pointer;">Добавить фото</button>
                        </div>
                    </div>
                    <input type="file" accept="image/*" class="gallery-upload-input" multiple style="display:none;">
                    <div class="gallery-controls" style="position:absolute;bottom:8px;right:8px;display:flex;gap:4px;opacity:0;transition:opacity 0.3s;">
                        <button class="gallery-prev" style="background:rgba(0,0,0,0.7);color:white;border:none;width:24px;height:24px;border-radius:50%;cursor:pointer;">◀</button>
                        <button class="gallery-next" style="background:rgba(0,0,0,0.7);color:white;border:none;width:24px;height:24px;border-radius:50%;cursor:pointer;">▶</button>
                    </div>
                    <div class="gallery-indicator" style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:4px;opacity:0;"></div>
                </div>
            `,
            defaultText: 'Лента товаров'
        },

        { 
            type: 'input', 
            name: 'Поле ввода', 
            icon: 'F', 
            html: '<input type="text" placeholder="Введите текст" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:5px;margin:5px 0;">',
            defaultText: 'Введите текст'
        },
        { 
            type: 'header', 
            name: 'Заголовок', 
            icon: 'H', 
            html: '<h2 contenteditable="true" style="color:#6a11cb;margin:10px 0;">Заголовок</h2>',
            defaultText: 'Заголовок'
        },
        { 
            type: 'list', 
            name: 'Список', 
            icon: 'L', 
            html: '<ul style="list-style-type:none;padding:0;"><li contenteditable="true" style="padding:8px;border-bottom:1px solid #eee;">Элемент списка 1</li><li contenteditable="true" style="padding:8px;border-bottom:1px solid #eee;">Элемент списка 2</li></ul>',
            defaultText: 'Элемент списка'
        }
    ],

    navIcons: ['🏠', '🛍️', '❤️', '👤', '⚙️', '🔍', '📞', '📧'],
    
    colors: ['#6a11cb', '#2575fc', '#ff6b6b', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e74c3c'],
    grid: {
        minCols: 2,
        maxCols: 12,
        minRows: 2,
        maxRows: 20,
        defaultCols: 4,
        defaultRows: 8
    }
};
// Добавить анимацию пульсации в Constants
Constants.animations = `
    @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
    }
`;

