// Smart Battery Tool - Advanced Tools Interface
// Internal Version: 1
// Last Modified: June 30, 2025
// Author: Ahmed Saleh

// Advanced Tools Interface
class AdvancedToolsView {
    constructor() {
        this.currentChip = null;
        this.chipModule = null;
        this.mainLogEntries = [];
        this.quickLogEntries = [];
        this.memoryData = null;
    }
    
    // Initialize interface
    init() {
        console.log('Initializing Advanced Tools interface...');
        
        // Bind events
        this.bindEvents();
        
        // Update interface state
        this.updateInterfaceState();
        
        // Load chip info if connected
        if (window.appUtils && window.appUtils.isConnected()) {
            this.loadChipInfo();
        }
    }
    
    // Bind events
    bindEvents() {
        // Main log buttons
        const clearMainLogBtn = document.getElementById('clear-main-log');
        const saveMainLogBtn = document.getElementById('save-main-log');
        const loadLogFileBtn = document.getElementById('load-log-file');
        
        if (clearMainLogBtn) {
            clearMainLogBtn.addEventListener('click', () => this.clearMainLog());
        }
        
        if (saveMainLogBtn) {
            saveMainLogBtn.addEventListener('click', () => this.saveMainLog());
        }
        
        if (loadLogFileBtn) {
            loadLogFileBtn.addEventListener('click', () => this.loadLogFile());
        }
        
        // Memory editor buttons
        const readMemoryBtn = document.getElementById('read-memory');
        const clearMemoryBtn = document.getElementById('clear-memory');
        
        if (readMemoryBtn) {
            readMemoryBtn.addEventListener('click', () => this.readMemory());
        }
        
        if (clearMemoryBtn) {
            clearMemoryBtn.addEventListener('click', () => this.clearMemory());
        }
    }
    
    // Update interface state
    updateInterfaceState() {
        const isConnected = window.appUtils && window.appUtils.isConnected();
        
        // Update function buttons availability
        this.updateFunctionButtons(isConnected);
        
        // Update memory editor availability
        this.updateMemoryEditor(isConnected);
        
        if (!isConnected) {
            this.addLogEntry('Device not connected. Please connect to enable advanced tools.', 'warning');
        }
    }
    
    // Load chip information
    loadChipInfo() {
        const adapter = window.appUtils.getSelectedAdapter();
        
        if (adapter) {
            this.addLogEntry(`Loading chip information for ${adapter}...`, 'info');
            
            // Initialize chip manager if not already done
            if (window.chipManager) {
                window.chipManager.init();
                
                // Load chip-specific configuration
                setTimeout(() => {
                    window.chipManager.loadChip(adapter);
                    this.currentChip = adapter;
                    this.addLogEntry(`Chip detected: ${adapter}`, 'success');
                }, 1000);
            } else {
                // Fallback to old method
                setTimeout(() => {
                    this.currentChip = adapter;
                    this.loadChipFunctions();
                    this.addLogEntry(`Chip detected: ${adapter}`, 'success');
                }, 1000);
            }
        }
    }
    
    // Load chip-specific functions
    loadChipFunctions() {
        const functionsPanel = document.querySelector('.function-buttons');
        if (!functionsPanel) return;
        
        // Clear existing functions
        functionsPanel.innerHTML = '';
        
        // Add chip-specific functions based on current chip
        const functions = this.getChipFunctions(this.currentChip);
        
        functions.forEach(func => {
            const button = document.createElement('button');
            button.className = 'function-btn';
            button.textContent = func.name;
            button.addEventListener('click', () => this.executeFunction(func));
            functionsPanel.appendChild(button);
        });
    }
    
    // Get chip-specific functions
    getChipFunctions(chipType) {
        const functions = {
            'CP2112': [
                { name: 'Read Device Info', command: 'read_device_info' },
                { name: 'Reset Device', command: 'reset_device' },
                { name: 'Configure GPIO', command: 'config_gpio' },
                { name: 'I2C Scan', command: 'i2c_scan' }
            ],
            'EV2300': [
                { name: 'Battery Info', command: 'battery_info' },
                { name: 'Cell Voltages', command: 'cell_voltages' },
                { name: 'Temperature', command: 'temperature' },
                { name: 'Current', command: 'current' }
            ]
        };
        
        return functions[chipType] || [];
    }
    
    // Execute chip function
    executeFunction(func) {
        this.addLogEntry(`Executing: ${func.name}`, 'info');
        
        // Simulate function execution
        setTimeout(() => {
            const result = this.simulateFunctionResult(func);
            this.addLogEntry(`${func.name} completed: ${result}`, 'success');
        }, 1500);
    }
    
    // Simulate function result
    simulateFunctionResult(func) {
        const results = {
            'read_device_info': 'Device ID: 0x1234, Version: 2.1',
            'reset_device': 'Device reset successfully',
            'config_gpio': 'GPIO configured: Pin 1-4 as output',
            'i2c_scan': 'Found devices at: 0x48, 0x50, 0x68',
            'battery_info': 'Capacity: 2500mAh, Voltage: 12.6V',
            'cell_voltages': 'Cell1: 4.2V, Cell2: 4.1V, Cell3: 4.2V',
            'temperature': 'Battery: 32°C, Ambient: 25°C',
            'current': 'Charge: 2.1A, Discharge: 0A'
        };
        
        return results[func.command] || 'Operation completed';
    }
    
    // Add log entry
    addLogEntry(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const entry = {
            timestamp,
            message,
            type
        };
        
        this.mainLogEntries.push(entry);
        this.updateLogDisplay();
    }
    
    // Update log display
    updateLogDisplay() {
        const logContent = document.getElementById('main-log-content');
        if (!logContent) return;
        
        if (this.mainLogEntries.length === 0) {
            logContent.innerHTML = `
                <div class="log-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    <p>No log entries yet</p>
                </div>
            `;
            return;
        }
        
        const logHtml = this.mainLogEntries.map(entry => `
            <div class="log-entry ${entry.type}">
                <span class="log-timestamp">${entry.timestamp}</span>
                <span class="log-message">${entry.message}</span>
            </div>
        `).join('');
        
        logContent.innerHTML = logHtml;
        logContent.scrollTop = logContent.scrollHeight;
    }
    
    // Clear main log
    clearMainLog() {
        this.mainLogEntries = [];
        this.updateLogDisplay();
        window.appUtils.showMessage('Main log cleared', 'info');
    }
    
    // Save main log
    saveMainLog() {
        if (this.mainLogEntries.length === 0) {
            window.appUtils.showMessage('No log entries to save', 'warning');
            return;
        }
        
        const logText = this.mainLogEntries.map(entry => 
            `[${entry.timestamp}] ${entry.message}`
        ).join('\n');
        
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `battery_log_${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        window.appUtils.showMessage('Log saved successfully', 'success');
    }
    
    // Load log file
    loadLogFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.log';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.parseLogFile(e.target.result);
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
    
    // Parse log file
    parseLogFile(content) {
        const lines = content.split('\n').filter(line => line.trim());
        this.mainLogEntries = [];
        
        lines.forEach(line => {
            const match = line.match(/^\[([^\]]+)\] (.+)$/);
            if (match) {
                this.mainLogEntries.push({
                    timestamp: match[1],
                    message: match[2],
                    type: 'info'
                });
            }
        });
        
        this.updateLogDisplay();
        window.appUtils.showMessage(`Loaded ${this.mainLogEntries.length} log entries`, 'success');
    }
    
    // Read memory
    readMemory() {
        const addressInput = document.getElementById('memory-address');
        const address = addressInput ? addressInput.value.trim() : '';
        
        if (!address) {
            window.appUtils.showMessage('Please enter a memory address', 'warning');
            return;
        }
        
        if (!window.appUtils.isConnected()) {
            window.appUtils.showMessage('Device not connected', 'error');
            return;
        }
        
        this.addLogEntry(`Reading memory at address: ${address}`, 'info');
        
        // Simulate memory read
        setTimeout(() => {
            const data = this.simulateMemoryRead(address);
            this.displayMemoryData(address, data);
            this.addLogEntry(`Memory read completed: ${address}`, 'success');
        }, 1000);
    }
    
    // Simulate memory read
    simulateMemoryRead(address) {
        const data = [];
        for (let i = 0; i < 16; i++) {
            data.push(Math.floor(Math.random() * 256));
        }
        return data;
    }
    
    // Display memory data
    displayMemoryData(address, data) {
        const memoryContent = document.getElementById('memory-editor-content');
        if (!memoryContent) return;
        
        const hexData = data.map(byte => byte.toString(16).padStart(2, '0')).join(' ');
        const asciiData = data.map(byte => 
            (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.'
        ).join('');
        
        memoryContent.innerHTML = `
            <div class="memory-display">
                <div class="memory-header">Address: ${address}</div>
                <div class="memory-hex">${hexData}</div>
                <div class="memory-ascii">${asciiData}</div>
            </div>
        `;
    }
    
    // Clear memory display
    clearMemory() {
        const memoryContent = document.getElementById('memory-editor-content');
        if (!memoryContent) return;
        
        memoryContent.innerHTML = `
            <div class="memory-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                <p>Memory editor not available</p>
                <small>Connect to a device first</small>
            </div>
        `;
        
        const addressInput = document.getElementById('memory-address');
        if (addressInput) {
            addressInput.value = '';
        }
    }
    
    // Update function buttons
    updateFunctionButtons(isConnected) {
        const functionButtons = document.querySelectorAll('.function-btn');
        functionButtons.forEach(btn => {
            btn.disabled = !isConnected;
        });
    }
    
    // Update memory editor
    updateMemoryEditor(isConnected) {
        const memoryButtons = document.querySelectorAll('.memory-btn');
        const addressInput = document.getElementById('memory-address');
        
        memoryButtons.forEach(btn => {
            btn.disabled = !isConnected;
        });
        
        if (addressInput) {
            addressInput.disabled = !isConnected;
        }
    }
}

// Initialize when script is loaded (for dynamic loading)
function initAdvancedTools() {
    const advancedTools = new AdvancedToolsView();
    advancedTools.init();
    
    // Store reference for later use
    window.advancedToolsView = advancedTools;
}

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdvancedTools);
} else {
    // DOM is already loaded, initialize immediately
    setTimeout(initAdvancedTools, 100);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedToolsView;
}

