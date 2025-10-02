const MagnetManager = {
    snapDistance: 5, // Уменьшили расстояние для точного прилипания
    
    checkMagneticSnap: function(currentElement, allElements, currentIndex) {
        let snappedX = currentElement.x;
        let snappedY = currentElement.y;
        let hasSnapped = false;
        
        const otherElements = allElements.filter((_, index) => index !== currentIndex);
        
        for (const element of otherElements) {
            // ТОЧНОЕ ПРИЛИПАНИЕ БЕЗ ЗАЗОРОВ
            
            // Прилипание слева к правому краю другого элемента
            if (Math.abs(currentElement.x - (element.x + element.width)) < this.snapDistance) {
                snappedX = element.x + element.width; // Вплотную к правому краю
                hasSnapped = true;
            }
            // Прилипание справа к левому краю другого элемента
            else if (Math.abs((currentElement.x + currentElement.width) - element.x) < this.snapDistance) {
                snappedX = element.x - currentElement.width; // Вплотную к левому краю
                hasSnapped = true;
            }
            
            // Прилипание сверху к нижнему краю другого элемента
            if (Math.abs(currentElement.y - (element.y + element.height)) < this.snapDistance) {
                snappedY = element.y + element.height; // Вплотную к нижнему краю
                hasSnapped = true;
            }
            // Прилипание снизу к верхнему краю другого элемента
            else if (Math.abs((currentElement.y + currentElement.height) - element.y) < this.snapDistance) {
                snappedY = element.y - currentElement.height; // Вплотную к верхнему краю
                hasSnapped = true;
            }
            
            // ВЫРАВНИВАНИЕ КРАЕВ (если нужно сохранить выравнивание)
            // Выравнивание по левому краю
            if (Math.abs(currentElement.x - element.x) < this.snapDistance) {
                snappedX = element.x;
                hasSnapped = true;
            }
            // Выравнивание по правому краю
            if (Math.abs((currentElement.x + currentElement.width) - (element.x + element.width)) < this.snapDistance) {
                snappedX = element.x + element.width - currentElement.width;
                hasSnapped = true;
            }
            // Выравнивание по верхнему краю
            if (Math.abs(currentElement.y - element.y) < this.snapDistance) {
                snappedY = element.y;
                hasSnapped = true;
            }
            // Выравнивание по нижнему краю
            if (Math.abs((currentElement.y + currentElement.height) - (element.y + element.height)) < this.snapDistance) {
                snappedY = element.y + element.height - currentElement.height;
                hasSnapped = true;
            }
        }
        
        return {
            x: snappedX,
            y: snappedY,
            snapped: hasSnapped
        };
    },
    
    // Визуальная индикация прилипания
    showSnapIndicator: function(element) {
        element.classList.add('element-snapping');
        setTimeout(() => {
            element.classList.remove('element-snapping');
        }, 300);
    }
};