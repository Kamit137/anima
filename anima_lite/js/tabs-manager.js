class TabsManager {
    constructor() {
        this.currentTab = 'cart';
    }

    init() {
        this.initializeTabListeners();
        this.switchToTab('cart');
    }

    initializeTabListeners() {
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchToTab(tabName);
            });
        });
    }

    switchToTab(tabName) {
        // Update buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;
        
        // Update app state
        if (typeof app !== 'undefined') {
            app.currentTab = tabName;
        }
    }

    getCurrentTab() {
        return this.currentTab;
    }
}

const tabsManager = new TabsManager();