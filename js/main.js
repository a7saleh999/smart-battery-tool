// Smart Battery Tool - Main Application Logic
// Internal Version: 3
// Last Modified: June 30, 2025
// Author: Ahmed Saleh

// Global variables
let currentView = 'battery-info';
let isConnected = false;
let currentAdapter = null;

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    console.log('Initializing Smart Battery Tool...');
    
    // Initialize layer manager
    if (window.layerManager) {
        window.layerManager.init();
    }
    
    // Initialize chip manager
    if (window.chipManager) {
        window.chipManager.init();
    }
    
    // Initialize top bar events
    initializeTopBarEvents();
    
    // Initialize tab events
    initializeTabEvents();
    
    // Load default view
    setTimeout(() => {
        loadView('battery-info');
    }, 100);
    
    // Update connection status
    updateConnectionStatus(false);
    
    console.log('Application initialized successfully');
}

// Initialize top bar events
function initializeTopBarEvents() {
    // Refresh adapters button
    const refreshBtn = document.getElementById('refresh-adapters');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshAdapters);
    }
    
    // Connect button
    const connectBtn = document.getElementById('connect-btn');
    if (connectBtn) {
        connectBtn.addEventListener('click', toggleConnection);
    }
    
    // Adapter selection dropdown
    const adapterSelect = document.getElementById('adapter-select');
    if (adapterSelect) {
        adapterSelect.addEventListener('change', onAdapterChange);
    }
}

// Initialize tab events
function initializeTabEvents() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const viewName = this.getAttribute('data-view');
            switchToView(viewName);
        });
    });
}

// Refresh available adapters
function refreshAdapters() {
    const select = document.getElementById('adapter-select');
    const refreshBtn = document.getElementById('refresh-adapters');
    
    // Disable refresh button during search to prevent layout shift
    if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.style.opacity = '0.6';
        refreshBtn.style.cursor = 'not-allowed';
    }
    
    // Disable select during search to prevent interaction
    if (select) {
        select.disabled = true;
        select.style.opacity = '0.6';
    }
    
    // Preserve current selection
    const currentValue = select.value;
    
    showMessage('Searching for adapters...', 'info');
    
    // Simulate adapter search
    setTimeout(() => {
        const adapters = ['CP2112', 'EV2300'];
        
        // Clear current options but maintain structure
        select.innerHTML = '<option value="">Select Adapter</option>';
        
        // Add discovered adapters
        adapters.forEach(adapter => {
            const option = document.createElement('option');
            option.value = adapter;
            option.textContent = adapter;
            select.appendChild(option);
        });
        
        // Restore previous selection if it still exists
        if (currentValue && adapters.includes(currentValue)) {
            select.value = currentValue;
        }
        
        // Re-enable refresh button and select
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.style.opacity = '1';
            refreshBtn.style.cursor = 'pointer';
        }
        
        if (select) {
            select.disabled = false;
            select.style.opacity = '1';
        }
        
        showMessage(`Found ${adapters.length} adapters`, 'success');
    }, 1000);
}

// Handle adapter selection change
function onAdapterChange(event) {
    currentAdapter = event.target.value;
    updateConnectButton();
}

// Toggle connection
function toggleConnection() {
    if (!currentAdapter) {
        showMessage('Please select an adapter first', 'warning');
        return;
    }
    
    if (isConnected) {
        disconnect();
    } else {
        connect();
    }
}

// Connect to adapter
function connect() {
    showMessage(`Connecting to ${currentAdapter}...`, 'info');
    
    // Simulate connection
    setTimeout(() => {
        isConnected = true;
        updateConnectionStatus(true);
        showMessage(`Connected to ${currentAdapter}`, 'success');
    }, 1500);
}

// Disconnect from adapter
function disconnect() {
    showMessage('Disconnecting...', 'info');
    
    // Simulate disconnection
    setTimeout(() => {
        isConnected = false;
        updateConnectionStatus(false);
        showMessage('Disconnected', 'info');
    }, 500);
}

// Update connection status display
function updateConnectionStatus(connected) {
    const statusIndicator = document.getElementById('connection-status');
    const statusDot = statusIndicator.querySelector('.status-dot');
    const statusText = statusIndicator.querySelector('.status-text');
    
    if (connected) {
        statusDot.className = 'status-dot connected';
        statusText.textContent = 'Connected';
    } else {
        statusDot.className = 'status-dot disconnected';
        statusText.textContent = 'Disconnected';
    }
    
    updateConnectButton();
}

// Update connect button text and style
function updateConnectButton() {
    const connectBtn = document.getElementById('connect-btn');
    
    if (isConnected) {
        connectBtn.textContent = 'Disconnect';
        connectBtn.className = 'control-btn danger';
    } else {
        connectBtn.textContent = 'Connect';
        connectBtn.className = 'control-btn primary';
    }
}

// Switch to a different view
function switchToView(viewName) {
    console.log(`Switching to view: ${viewName}`);
    
    // Update active tab
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const targetBtn = document.querySelector(`[data-view="${viewName}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
    
    // Load the view
    loadView(viewName);
    currentView = viewName;
}

// Load a view dynamically
async function loadView(viewName) {
    const contentArea = document.getElementById('main-content');
    
    if (!contentArea) {
        console.error('Content area not found');
        return;
    }
    
    try {
        console.log(`Loading view: ${viewName}`);
        
        // Show loading message
        contentArea.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading...</p></div>';
        
        // Construct the correct path - try different approaches for compatibility
        let viewPath = `views/${viewName}.html`;
        
        // For file:// protocol compatibility, try absolute path
        if (window.location.protocol === 'file:') {
            const currentDir = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
            viewPath = `${currentDir}/views/${viewName}.html`;
        }
        
        console.log(`Fetching: ${viewPath}`);
        
        // Load HTML content with better error handling
        let htmlResponse;
        try {
            htmlResponse = await fetch(viewPath);
        } catch (fetchError) {
            // If fetch fails, try alternative path
            console.warn(`First fetch attempt failed: ${fetchError.message}`);
            viewPath = `./views/${viewName}.html`;
            console.log(`Trying alternative path: ${viewPath}`);
            htmlResponse = await fetch(viewPath);
        }
        
        if (!htmlResponse.ok) {
            throw new Error(`HTTP ${htmlResponse.status}: ${htmlResponse.statusText} - Failed to load ${viewPath}`);
        }
        
        const html = await htmlResponse.text();
        
        if (!html || html.trim().length === 0) {
            throw new Error('Empty response received - the view file might be empty or corrupted');
        }
        
        console.log(`HTML content loaded successfully (${html.length} characters)`);
        
        // Set the HTML content
        contentArea.innerHTML = html;
        
        // Small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Load view-specific CSS (non-blocking)
        loadViewCSS(viewName).catch(error => {
            console.warn(`CSS loading failed for ${viewName}:`, error);
        });
        
        // Load view-specific JavaScript (non-blocking)
        loadViewJS(viewName).catch(error => {
            console.warn(`JavaScript loading failed for ${viewName}:`, error);
            // Don't fail the entire view load if JS fails
        });
        
        console.log(`View loaded successfully: ${viewName}`);
        
    } catch (error) {
        console.error('Error loading view:', error);
        
        // Create a more detailed error message
        const errorDetails = error.message || 'Unknown error occurred';
        const troubleshooting = `
            <div class="troubleshooting">
                <h4>Troubleshooting:</h4>
                <ul>
                    <li>Make sure the file <code>views/${viewName}.html</code> exists</li>
                    <li>Check if you're running the app from the correct directory</li>
                    <li>If using file:// protocol, try running a local web server</li>
                    <li>Check browser console for additional error details</li>
                </ul>
            </div>
        `;
        
        contentArea.innerHTML = `
            <div class="error-container">
                <div class="error-icon">⚠️</div>
                <h3>Error Loading View</h3>
                <p>Failed to load <strong>${viewName}</strong></p>
                <p class="error-details">${errorDetails}</p>
                ${troubleshooting}
                <div class="error-actions">
                    <button onclick="loadView('${viewName}')" class="retry-btn">Retry</button>
                    <button onclick="loadView('battery-info')" class="home-btn">Go to Info</button>
                </div>
            </div>
        `;
    }
}

// Load view-specific CSS
async function loadViewCSS(viewName) {
    return new Promise((resolve, reject) => {
        // Check if CSS file exists first
        const testLink = document.createElement('link');
        testLink.rel = 'stylesheet';
        
        // Handle different path scenarios
        let cssPath = `css/${viewName}.css`;
        if (window.location.protocol === 'file:') {
            const currentDir = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
            cssPath = `${currentDir}/css/${viewName}.css`;
        }
        
        testLink.href = cssPath;
        
        testLink.onload = () => {
            console.log(`CSS loaded for view: ${viewName}`);
            
            // Remove previous view CSS
            const existingCSS = document.querySelector(`link[data-view-css]`);
            if (existingCSS && existingCSS !== testLink) {
                existingCSS.remove();
            }
            
            testLink.setAttribute('data-view-css', viewName);
            resolve();
        };
        
        testLink.onerror = () => {
            console.log(`No CSS file found for view: ${viewName} (this is normal for some views)`);
            testLink.remove();
            resolve(); // Don't reject, as missing CSS is not critical
        };
        
        document.head.appendChild(testLink);
    });
}

// Load view-specific JavaScript
async function loadViewJS(viewName) {
    try {
        // Handle different path scenarios
        let jsPath = `js/${viewName}.js`;
        if (window.location.protocol === 'file:') {
            const currentDir = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
            jsPath = `${currentDir}/js/${viewName}.js`;
        }
        
        // Check if JS file exists first with better error handling
        let checkResponse;
        try {
            checkResponse = await fetch(jsPath, { method: 'HEAD' });
        } catch (fetchError) {
            // Try alternative path
            jsPath = `./js/${viewName}.js`;
            try {
                checkResponse = await fetch(jsPath, { method: 'HEAD' });
            } catch (altFetchError) {
                console.log(`No JavaScript file found for view: ${viewName} (this is normal for some views)`);
                return Promise.resolve();
            }
        }
        
        if (!checkResponse.ok) {
            console.log(`No JavaScript file found for view: ${viewName} (this is normal for some views)`);
            return Promise.resolve();
        }
        
        // Remove previous view JS with better cleanup
        const existingJS = document.querySelector(`script[data-view-js]`);
        if (existingJS) {
            // Clean up any global objects from previous view
            const prevViewName = existingJS.getAttribute('data-view-js');
            if (prevViewName && window[`${prevViewName}View`]) {
                try {
                    // Call cleanup if available
                    if (typeof window[`${prevViewName}View`].cleanup === 'function') {
                        window[`${prevViewName}View`].cleanup();
                    }
                    // Remove global reference
                    delete window[`${prevViewName}View`];
                } catch (cleanupError) {
                    console.warn(`Error cleaning up previous view ${prevViewName}:`, cleanupError);
                }
            }
            existingJS.remove();
        }
        
        // Small delay to ensure cleanup is complete
        await new Promise(resolve => setTimeout(resolve, 10));
        
        // Load new JavaScript
        const script = document.createElement('script');
        script.src = jsPath;
        script.setAttribute('data-view-js', viewName);
        
        // Return a promise that resolves when script loads
        return new Promise((resolve, reject) => {
            script.onload = () => {
                console.log(`JavaScript loaded for view: ${viewName}`);
                
                // Initialize view if it has an init function
                try {
                    const viewInitFunction = window[`${viewName}View`];
                    if (viewInitFunction && typeof viewInitFunction.initialize === 'function') {
                        viewInitFunction.initialize();
                        console.log(`View ${viewName} initialized successfully`);
                    } else {
                        console.log(`No initialize function found for ${viewName} (this is normal for some views)`);
                    }
                } catch (initError) {
                    console.warn(`Error initializing ${viewName}:`, initError);
                    // Don't reject the promise, just log the warning
                }
                
                resolve();
            };
            
            script.onerror = (error) => {
                console.error(`Failed to load JavaScript for view: ${viewName}`, error);
                script.remove();
                reject(new Error(`Failed to load JS for ${viewName}`));
            };
            
            document.head.appendChild(script);
        });
        
    } catch (error) {
        console.log(`No JavaScript file available for view ${viewName} (this is normal for some views):`, error);
        return Promise.resolve();
    }
}

// Show message to user
function showMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    
    // Add message to page
    document.body.appendChild(messageEl);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 3000);
}

// Utility functions for other views
window.appUtils = {
    showMessage,
    isConnected: () => isConnected,
    getSelectedAdapter: () => currentAdapter,
    getCurrentView: () => currentView
};

