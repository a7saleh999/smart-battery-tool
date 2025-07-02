// Smart Battery Tool - About View
// Internal Version: 1
// Last Modified: June 30, 2025
// Author: Ahmed Saleh

class AboutView {
    constructor() {
        this.isInitialized = false;
    }

    // Initialize the about view
    initialize() {
        if (this.isInitialized) return;
        
        console.log('Initializing About View...');
        this.isInitialized = true;
        console.log('About View initialized successfully');
    }

    // Cleanup when view is unloaded
    cleanup() {
        console.log('Cleaning up About View...');
        this.isInitialized = false;
    }
}

// Initialize about view when script loads
if (typeof window !== 'undefined') {
    window.aboutView = new AboutView();
    
    // Auto-initialize if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.aboutView.initialize();
        });
    } else {
        window.aboutView.initialize();
    }
}

