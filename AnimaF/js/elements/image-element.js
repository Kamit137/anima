class ImageElement extends BaseElement {
    constructor() {
        super(
            'image',
            'Изображение',
            '🖼️',
            `
            <div class="image-container" style="width:100%;height:100px;background:linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;border-radius:5px;position:relative;overflow:hidden;">
                <div class="image-placeholder">Изображение</div>
                <input type="file" accept="image/*" class="image-upload-input" style="display:none;">
                <button class="image-upload-btn" style="position:absolute;bottom:5px;right:5px;background:rgba(0,0,0,0.7);color:white;border:none;border-radius:3px;padding:2px 6px;font-size:10px;cursor:pointer;">📁</button>
            </div>
            `,
            'Изображение'
        );
    }

    setupElement(elementDiv, index) {
        super.setupElement(elementDiv, index);
        ImageManager.setupImageUpload(elementDiv, index);
    }
}