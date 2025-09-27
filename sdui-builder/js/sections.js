class SectionManager {
    constructor(gridSystem) {
        this.gridSystem = gridSystem;
        this.sections = [];
        this.activeSectionId = null;
        this.nextSectionId = 1;
    }

    init() {
        this.setupEventListeners();
        this.createDefaultSection();
        console.log('SectionManager initialized with', this.sections.length, 'sections');
    }

    setupEventListeners() {
        // Кнопка добавления секции
        const addButton = document.getElementById('addSectionBtn');
        if (addButton) {
            addButton.addEventListener('click', () => {
                console.log('Add section button clicked');
                this.addSection();
            });
        } else {
            console.error('Add section button not found!');
        }

        // Настройки из правой панели
        this.setupSettingListeners();
    }

    setupSettingListeners() {
    const settingsMap = {
        gridColumns: 'columns',
        gridRows: 'rows', 
        sectionHeight: 'height',
        marginTop: 'marginTop',
        marginBottom: 'marginBottom',
        marginLeft: 'marginLeft',     // ← НОВОЕ
        marginRight: 'marginRight',   // ← НОВОЕ
        sectionPadding: 'padding',
        gridGap: 'gap'
    };

        Object.entries(settingsMap).forEach(([inputId, sectionProp]) => {
            const element = document.getElementById(inputId);
            if (element) {
                element.addEventListener('input', (e) => {
                    const value = parseInt(e.target.value) || 0;
                    console.log('Setting changed:', sectionProp, value);
                    this.updateActiveSection({ [sectionProp]: value });
                });
                
                // Добавляем изменение при ручном вводе
                element.addEventListener('change', (e) => {
                    const value = parseInt(e.target.value) || 0;
                    console.log('Setting changed (change):', sectionProp, value);
                    this.updateActiveSection({ [sectionProp]: value });
                });
            } else {
                console.error('Setting element not found:', inputId);
            }
        });
    }

    createDefaultSection() {
        const defaultSection = {
            id: this.generateSectionId(),
            title: 'Секция 1',
            columns: 1,
            rows: 1,
            gap: 8,
            height: 120,
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 15,    
            marginRight: 15,   
            padding: 10
        };
        
        this.sections = [defaultSection];
        this.activeSectionId = defaultSection.id;
        this.updateSettingsPanel();
        this.renderSectionsList();
        this.renderGridSections();
    }

    addSection() {
        console.log('Adding new section...');
        
        const newSection = {
            id: this.generateSectionId(),
            title: `Секция ${this.sections.length + 1}`,
            columns: 1,
            rows: 1,
            gap: 8,
            height: 120,
            marginTop: 10,
            marginBottom: 10,
            padding: 10
        };

        this.sections.push(newSection);
        this.activeSectionId = newSection.id;
        
        console.log('Sections count:', this.sections.length);
        
        this.updateSettingsPanel();
        this.renderSectionsList();
        this.renderGridSections();
    }

    generateSectionId() {
        return `section_${Date.now()}_${this.nextSectionId++}`;
    }

    renderSectionsList() {
        const container = document.getElementById('sectionsList');
        if (!container) {
            console.error('Sections list container not found!');
            return;
        }

        container.innerHTML = '';

        this.sections.forEach(section => {
            const sectionEl = document.createElement('div');
            sectionEl.className = `section-item ${section.id === this.activeSectionId ? 'active' : ''}`;
            sectionEl.dataset.sectionId = section.id;
            sectionEl.draggable = true;
            
            sectionEl.innerHTML = `
                <div class="section-header">
                    <span class="section-title">${section.columns} × ${section.rows}</span>
                    <div class="section-actions">
                        <button class="section-action-btn">✏️</button>
                        <button class="section-action-btn">🗑️</button>
                    </div>
                </div>
                <div class="section-config">
                    Высота: ${section.height}px
                </div>
            `;

            // Обработчики для кнопок
            const deleteBtn = sectionEl.querySelector('.section-action-btn:last-child');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeSection(section.id);
            });

            sectionEl.addEventListener('click', (e) => {
                if (!e.target.closest('.section-actions')) {
                    this.setActiveSection(section.id);
                }
            });

            container.appendChild(sectionEl);
        });
    }

    renderGridSections() {
        const container = document.getElementById('gridOverlay');
        if (!container) {
            console.error('Grid overlay container not found!');
            return;
        }

        container.innerHTML = '';
        
        // Ширина экрана телефона (375px - стандарт)
        const screenWidth = 375;
        let currentY = 0;

        this.sections.forEach((section, index) => {
            const sectionEl = document.createElement('div');
            sectionEl.className = `grid-section ${section.id === this.activeSectionId ? 'active' : ''}`;
            
            // РАСЧЕТ ШИРИНЫ С УЧЕТОМ ОТСТУПОВ ОТ ЭКРАНА
            const sectionWidth = screenWidth - section.marginLeft - section.marginRight;
            
            sectionEl.style.height = section.height + 'px';
            sectionEl.style.width = sectionWidth + 'px';
            sectionEl.style.padding = section.padding + 'px';
            sectionEl.style.top = currentY + 'px';
            sectionEl.style.left = section.marginLeft + 'px'; // Отступ слева
            sectionEl.style.position = 'absolute';
            sectionEl.style.boxSizing = 'border-box';
            sectionEl.style.overflow = 'hidden'; // Скрываем переполнение

            // Отступ сверху между секциями
            if (index > 0) {
                currentY += section.marginTop;
            }

            // Контейнер для содержимого с горизонтальным скроллом
            const contentContainer = document.createElement('div');
            contentContainer.className = 'section-content-container';
            contentContainer.style.width = '100%';
            contentContainer.style.height = '100%';
            contentContainer.style.overflowX = 'auto'; // Горизонтальный скролл
            contentContainer.style.overflowY = 'hidden';

            // Сетка
            const gridOverlay = document.createElement('div');
            gridOverlay.className = 'section-grid-overlay';
            gridOverlay.style.width = '100%';
            gridOverlay.style.height = '100%';
            gridOverlay.style.position = 'relative';
            gridOverlay.style.minWidth = '100%'; // Для горизонтального скролла
            
            this.renderMatrixGrid(gridOverlay, section, sectionWidth - (section.padding * 2));
            
            contentContainer.appendChild(gridOverlay);
            sectionEl.appendChild(contentContainer);
            container.appendChild(sectionEl);
            
            currentY += section.height + section.marginBottom;
        });

        container.style.height = currentY + 'px';
    }

    renderMatrixGrid(container, section, availableWidth) {
        // availableWidth теперь передается извне (уже с учетом отступов)
        const availableHeight = section.height - (section.padding * 2);
        
        console.log('Grid available space:', availableWidth, 'x', availableHeight);

        // Минимальная ширина ячейки для горизонтального скролла
        const minCellWidth = 80; // Минимум 80px для ячейки
        const requiredWidth = section.columns * minCellWidth + (section.gap * (section.columns - 1));
        
        const actualAvailableWidth = Math.max(availableWidth, requiredWidth);
        const cellWidth = (actualAvailableWidth - (section.gap * (section.columns - 1))) / section.columns;
        const cellHeight = (availableHeight - (section.gap * (section.rows - 1))) / section.rows;

        // Устанавливаем минимальную ширину для контейнера сетки
        container.style.minWidth = requiredWidth + 'px';

        for (let row = 0; row < section.rows; row++) {
            for (let col = 0; col < section.columns; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                
                const x = col * (cellWidth + section.gap);
                const y = row * (cellHeight + section.gap);
                
                cell.style.width = cellWidth + 'px';
                cell.style.height = cellHeight + 'px';
                cell.style.left = x + 'px';
                cell.style.top = y + 'px';
                cell.style.position = 'absolute';
                cell.style.minWidth = minCellWidth + 'px'; // Минимальная ширина

                cell.textContent = `${col + 1}-${row + 1}`;
                container.appendChild(cell);
            }
        }
    }

    setActiveSection(sectionId) {
        this.activeSectionId = sectionId;
        this.updateSettingsPanel();
        this.renderSectionsList();
        this.renderGridSections();
    }

    removeSection(sectionId) {
        if (this.sections.length <= 1) {
            alert('Должна остаться хотя бы одна секция!');
            return;
        }

        this.sections = this.sections.filter(section => section.id !== sectionId);
        if (this.activeSectionId === sectionId) {
            this.activeSectionId = this.sections[0]?.id || null;
        }
        this.updateSettingsPanel();
        this.renderSectionsList();
        this.renderGridSections();
    }

    updateActiveSection(updates) {
        const section = this.sections.find(s => s.id === this.activeSectionId);
        if (section) {
            console.log('Updating section:', updates);
            
            // Сохраняем старые значения для сравнения
            const oldColumns = section.columns;
            const oldRows = section.rows;
            
            // Обновляем параметры
            Object.assign(section, updates);
            
            // Если изменились колонки или ряды - пересчитываем высоту
            if ((updates.gridColumns && updates.gridColumns !== oldColumns) || 
                (updates.gridRows && updates.gridRows !== oldRows)) {
                // Автоподбор высоты based on rows
                section.height = Math.max(120, section.rows * 60); // Минимум 120px, +60px за ряд
            }
            
            this.updateSettingsPanel();
            this.renderGridSections();
            this.renderSectionsList();
        } else {
            console.error('Active section not found!');
        }
    }

    updateSettingsPanel() {
        const section = this.sections.find(s => s.id === this.activeSectionId);
        if (section) {
            const settings = {
                gridColumns: section.columns,
                gridRows: section.rows,
                sectionHeight: section.height,
                marginTop: section.marginTop,
                marginBottom: section.marginBottom,
                marginLeft: section.marginLeft,     // ← НОВОЕ
                marginRight: section.marginRight,   // ← НОВОЕ
                sectionPadding: section.padding,
                gridGap: section.gap
            };

            Object.entries(settings).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.value = value;
                }
            });
        }
    }
}