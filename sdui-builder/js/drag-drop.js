class DragDropManager {
    constructor(sectionManager) {
        this.sectionManager = sectionManager;
        this.draggedItem = null;
        this.dragOverIndex = null;
        this.init();
    }

    init() {
        this.setupSectionDragDrop();
    }

    setupSectionDragDrop() {
        const container = document.getElementById('sectionsList');
        
        container.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('section-item')) {
                this.draggedItem = e.target;
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        container.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('section-item')) {
                e.target.classList.remove('dragging');
                this.draggedItem = null;
                this.dragOverIndex = null;
            }
        });

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(container, e.clientY);
            
            if (afterElement) {
                afterElement.style.borderTop = '2px solid #3498db';
            }
        });

        container.addEventListener('dragleave', (e) => {
            this.clearDragIndicators();
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            this.clearDragIndicators();
            
            if (this.draggedItem) {
                const afterElement = this.getDragAfterElement(container, e.clientY);
                const sectionId = this.draggedItem.dataset.sectionId;
                
                if (afterElement) {
                    const targetSectionId = afterElement.dataset.sectionId;
                    this.sectionManager.reorderSections(sectionId, targetSectionId);
                } else {
                    // Перемещаем в конец
                    this.sectionManager.moveSectionToEnd(sectionId);
                }
            }
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.section-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    clearDragIndicators() {
        document.querySelectorAll('.section-item').forEach(item => {
            item.style.borderTop = 'none';
        });
    }
}