const ProductGalleryManager = {
    // Настройка ленты товаров
    setupProductGallery: function(elementDiv, elementIndex) {
        const gallery = elementDiv.querySelector('.product-gallery');
        const addBtn = elementDiv.querySelector('.add-product-btn');
        const fileInput = elementDiv.querySelector('.gallery-upload-input');
        const prevBtn = elementDiv.querySelector('.gallery-prev');
        const nextBtn = elementDiv.querySelector('.gallery-next');
        const container = elementDiv.querySelector('.gallery-container');
        const indicator = elementDiv.querySelector('.gallery-indicator');
        
        let currentSlide = 0;
        
        // Загрузка существующих данных
        const currentScreen = ScreensManager.getCurrentScreen();
        const element = currentScreen.elements[elementIndex];
        
        if (element.products && element.products.length > 0) {
            this.renderGalleryProducts(container, indicator, element.products, elementIndex);
            this.updateGalleryControls(gallery, element.products.length);
        }
        
        // Обработчики событий
        addBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput?.click();
        });
        
        fileInput?.addEventListener('change', (e) => {
            this.handleGalleryUpload(e.target.files, container, indicator, elementIndex, gallery);
        });
        
        prevBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (element.products && element.products.length > 0) {
                currentSlide = (currentSlide - 1 + element.products.length) % element.products.length;
                this.updateGalleryPosition(container, currentSlide);
                this.updateGalleryIndicator(indicator, currentSlide, element.products.length);
            }
        });
        
        nextBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (element.products && element.products.length > 0) {
                currentSlide = (currentSlide + 1) % element.products.length;
                this.updateGalleryPosition(container, currentSlide);
                this.updateGalleryIndicator(indicator, currentSlide, element.products.length);
            }
        });
        
        // Показ контролов при наведении
        gallery?.addEventListener('mouseenter', () => {
            const controls = gallery.querySelector('.gallery-controls');
            const indicator = gallery.querySelector('.gallery-indicator');
            if (controls && element.products && element.products.length > 1) {
                controls.style.opacity = '1';
            }
            if (indicator && element.products && element.products.length > 1) {
                indicator.style.opacity = '1';
            }
        });
        
        gallery?.addEventListener('mouseleave', () => {
            const controls = gallery.querySelector('.gallery-controls');
            const indicator = gallery.querySelector('.gallery-indicator');
            if (controls) controls.style.opacity = '0';
            if (indicator) indicator.style.opacity = '0';
        });
        
        // Сохраняем ссылки для доступа из других методов
        elementDiv._galleryData = {
            currentSlide,
            container,
            indicator,
            gallery
        };
    },

    // Обработка загрузки нескольких изображений
    handleGalleryUpload: function(files, container, indicator, elementIndex, gallery) {
        const currentScreen = ScreensManager.getCurrentScreen();
        const element = currentScreen.elements[elementIndex];
        
        if (!element.products) {
            element.products = [];
        }
        
        const products = element.products;
        let loadedCount = 0;
        const totalFiles = Array.from(files).filter(file => file.type.match('image.*')).length;
        
        if (totalFiles === 0) {
            alert('Пожалуйста, выберите файлы изображений');
            return;
        }
        
        Array.from(files).forEach(file => {
            if (file.type.match('image.*')) {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    products.push({
                        image: e.target.result,
                        title: `Товар ${products.length + 1}`,
                        price: '999 ₽',
                        description: 'Описание товара'
                    });
                    
                    loadedCount++;
                    
                    // Когда все загружены - отрисовываем
                    if (loadedCount === totalFiles) {
                        this.renderGalleryProducts(container, indicator, products, elementIndex);
                        this.updateGalleryControls(gallery, products.length);
                    }
                };
                
                reader.readAsDataURL(file);
            }
        });
    },

    // Отрисовка товаров в галерее
    renderGalleryProducts: function(container, indicator, products, elementIndex) {
        if (products.length === 0) {
            container.innerHTML = `
                <div class="gallery-item empty" style="min-width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#666;flex-direction:column;gap:8px;">
                    <div style="font-size:24px">🛍️</div>
                    <div>Добавьте товары</div>
                    <button class="add-product-btn" style="background:#6a11cb;color:white;border:none;padding:6px 12px;border-radius:4px;font-size:12px;cursor:pointer;">Добавить фото</button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = products.map((product, index) => `
            <div class="gallery-item" style="min-width:100%;height:100%;display:flex;align-items:center;padding:12px;gap:12px;background:white;">
                <div style="width:80px;height:80px;border-radius:6px;overflow:hidden;flex-shrink:0;">
                    <img src="${product.image}" style="width:100%;height:100%;object-fit:cover;">
                </div>
                <div style="flex:1;">
                    <div style="font-weight:600;font-size:14px;margin-bottom:4px;">${product.title}</div>
                    <div style="color:#6a11cb;font-weight:700;font-size:16px;">${product.price}</div>
                    <div style="color:#666;font-size:12px;margin-bottom:8px;">${product.description}</div>
                    <div style="display:flex;gap:8px;margin-top:8px;">
                        <button class="product-edit" data-index="${index}" style="background:#f8f9fa;border:1px solid #ddd;padding:4px 8px;border-radius:3px;font-size:10px;cursor:pointer;">✏️</button>
                        <button class="product-delete" data-index="${index}" style="background:#ff6b6b;color:white;border:none;padding:4px 8px;border-radius:3px;font-size:10px;cursor:pointer;">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Обновляем индикатор
        this.updateGalleryIndicator(indicator, 0, products.length);
        
        // Добавляем обработчики для кнопок редактирования/удаления
        this.setupProductItemHandlers(container, elementIndex);
    },

    // Настройка обработчиков для товаров
    setupProductItemHandlers: function(container, elementIndex) {
        container.querySelectorAll('.product-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productIndex = parseInt(e.target.dataset.index);
                this.editProduct(elementIndex, productIndex);
            });
        });
        
        container.querySelectorAll('.product-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productIndex = parseInt(e.target.dataset.index);
                this.deleteProduct(elementIndex, productIndex);
            });
        });
    },

    // Редактирование товара
    editProduct: function(elementIndex, productIndex) {
        const currentScreen = ScreensManager.getCurrentScreen();
        const product = currentScreen.elements[elementIndex].products[productIndex];
        
        const newTitle = prompt('Название товара:', product.title);
        const newPrice = prompt('Цена:', product.price);
        const newDescription = prompt('Описание:', product.description);
        
        if (newTitle !== null) product.title = newTitle;
        if (newPrice !== null) product.price = newPrice;
        if (newDescription !== null) product.description = newDescription;
        
        // Перерисовываем галерею
        this.refreshGallery(elementIndex);
    },

    // Удаление товара
    deleteProduct: function(elementIndex, productIndex) {
        if (!confirm('Удалить этот товар?')) return;
        
        const currentScreen = ScreensManager.getCurrentScreen();
        currentScreen.elements[elementIndex].products.splice(productIndex, 1);
        
        // Перерисовываем галерею
        this.refreshGallery(elementIndex);
    },

    // Обновление позиции галереи
    updateGalleryPosition: function(container, currentSlide) {
        container.style.transform = `translateX(-${currentSlide * 100}%)`;
    },

    // Обновление индикатора слайдов
    updateGalleryIndicator: function(indicator, currentSlide, totalSlides) {
        if (totalSlides <= 1) {
            indicator.innerHTML = '';
            return;
        }
        
        indicator.innerHTML = Array.from({length: totalSlides}, (_, i) => 
            `<div style="width:6px;height:6px;border-radius:50%;background:${i === currentSlide ? '#6a11cb' : 'rgba(255,255,255,0.5)'};"></div>`
        ).join('');
    },

    // Обновление элементов управления
    updateGalleryControls: function(gallery, productCount) {
        const controls = gallery?.querySelector('.gallery-controls');
        const indicator = gallery?.querySelector('.gallery-indicator');
        
        if (productCount > 1) {
            controls?.style.setProperty('opacity', '0', 'important');
            indicator?.style.setProperty('opacity', '0', 'important');
        } else {
            controls?.style.setProperty('opacity', '0', 'important');
            indicator?.style.setProperty('opacity', '0', 'important');
        }
    },

    // Обновление галереи
    refreshGallery: function(elementIndex) {
        const elementDiv = document.querySelector(`[data-index="${elementIndex}"]`);
        if (!elementDiv) return;
        
        const container = elementDiv.querySelector('.gallery-container');
        const indicator = elementDiv.querySelector('.gallery-indicator');
        const gallery = elementDiv.querySelector('.product-gallery');
        
        const currentScreen = ScreensManager.getCurrentScreen();
        const products = currentScreen.elements[elementIndex].products || [];
        
        this.renderGalleryProducts(container, indicator, products, elementIndex);
        this.updateGalleryControls(gallery, products.length);
    },

    // Восстановление галереи при загрузке
    restoreGallery: function(elementDiv, element, index) {
        if (element.products && element.products.length > 0) {
            const container = elementDiv.querySelector('.gallery-container');
            const indicator = elementDiv.querySelector('.gallery-indicator');
            const gallery = elementDiv.querySelector('.product-gallery');
            
            this.renderGalleryProducts(container, indicator, element.products, index);
            this.updateGalleryControls(gallery, element.products.length);
        }
    }
};