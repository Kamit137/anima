const ImageManager = {
    // Настройка загрузки изображения для элемента
    setupImageUpload: function(elementDiv, index) {
        const uploadBtn = elementDiv.querySelector('.image-upload-btn');
        const fileInput = elementDiv.querySelector('.image-upload-input');
        const placeholder = elementDiv.querySelector('.image-placeholder');
        const container = elementDiv.querySelector('.image-container');
        
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                fileInput.click();
            });
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleImageUpload(file, container, placeholder, index);
                }
            });
        }
    },

    // Обработка загрузки изображения
    handleImageUpload: function(file, container, placeholder, elementIndex) {
        // Проверка типа файла
        if (!file.type.match('image.*')) {
            alert('Пожалуйста, выберите файл изображения');
            return;
        }
        
        // Проверка размера (максимум 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Размер файла не должен превышать 5MB');
            return;
        }
        
        // Показываем индикатор загрузки
        placeholder.innerHTML = 'Загрузка...';
        placeholder.classList.add('image-loading');
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            placeholder.classList.remove('image-loading');
            
            const img = new Image();
            img.onload = () => {
                this.createImageElement(container, placeholder, e.target.result, elementIndex);
            };
            
            img.src = e.target.result;
        };
        
        reader.onerror = () => {
            placeholder.classList.remove('image-loading');
            placeholder.innerHTML = 'Ошибка загрузки';
            setTimeout(() => {
                placeholder.innerHTML = 'Изображение';
            }, 2000);
        };
        
        reader.readAsDataURL(file);
    },

    // Создание элемента изображения
    createImageElement: function(container, placeholder, imageData, elementIndex) {
        const img = document.createElement('img');
        img.src = imageData;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '5px';
        
        placeholder.style.display = 'none';
        container.style.background = 'none';
        container.innerHTML = '';
        container.appendChild(img);
        
        // Добавляем кнопку удаления
        this.addRemoveButton(container, placeholder, elementIndex);
        
        // Сохраняем в данные
        this.saveImageToElement(elementIndex, imageData);
    },

    // Добавление кнопки удаления изображения
    addRemoveButton: function(container, placeholder, elementIndex) {
        const removeBtn = document.createElement('button');
        removeBtn.className = 'image-remove-btn';
        removeBtn.innerHTML = '❌';
        removeBtn.title = 'Удалить изображение';
        removeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            z-index: 10;
        `;
        
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.resetImage(container, placeholder, elementIndex);
        });
        
        container.appendChild(removeBtn);
    },

    // Сброс изображения к плейсхолдеру
    resetImage: function(container, placeholder, elementIndex) {
        // Сохраняем ссылку на родительский элемент
        const elementDiv = container.parentElement;
        
        // Восстанавливаем оригинальный HTML
        container.innerHTML = `
            <div class="image-placeholder" style="color:white;z-index:1;">Изображение</div>
            <input type="file" accept="image/*" class="image-upload-input" style="display:none;">
            <button class="image-upload-btn" style="position:absolute;bottom:5px;right:5px;background:rgba(0,0,0,0.7);color:white;border:none;border-radius:3px;padding:2px 6px;font-size:10px;cursor:pointer;z-index:2;">📁</button>
        `;
        container.style.background = 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)';
        
        // Настраиваем заново
        this.setupImageUpload(elementDiv, elementIndex);
        
        // Удаляем из данных
        this.removeImageFromElement(elementIndex);
    },

    // Сохранение данных изображения в элемент
    saveImageToElement: function(elementIndex, imageData) {
        const currentScreen = ScreensManager.getCurrentScreen();
        if (currentScreen.elements[elementIndex]) {
            currentScreen.elements[elementIndex].imageData = imageData;
        }
    },

    // Удаление данных изображения из элемента
    removeImageFromElement: function(elementIndex) {
        const currentScreen = ScreensManager.getCurrentScreen();
        if (currentScreen.elements[elementIndex]) {
            delete currentScreen.elements[elementIndex].imageData;
        }
    },

    // Восстановление изображения при загрузке
    restoreImage: function(elementDiv, element, index) {
        const container = elementDiv.querySelector('.image-container');
        const placeholder = elementDiv.querySelector('.image-placeholder');
        
        if (container && placeholder && element.imageData) {
            this.createImageElement(container, placeholder, element.imageData, index);
        }
    }
};