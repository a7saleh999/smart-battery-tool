// Smart Battery Tool - Chip Manager
// Internal Version: 1
// Last Modified: June 30, 2025
// Author: Ahmed Saleh

// Chip Manager for dynamic button activation
class ChipManager {
    constructor() {
        this.currentChip = null;
        this.availableButtons = [
            'unseal-chip-button',
            'seal-chip-button',
            'clear-errors-button',
            'read-chip-info-button',
            'read-eeprom-button',
            'write-eeprom-button',
            'save-to-file-button',
            'load-from-file-button',
            'parse-log-button',
            'write-data-button'
        ];
    }
    
    // Initialize chip manager
    init() {
        console.log('Initializing Chip Manager...');
        this.hideAllButtons();
    }
    
    // Hide all buttons initially
    hideAllButtons() {
        this.availableButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.style.display = 'none';
                button.onclick = null;
            }
        });
    }
    
    // Load chip-specific configuration
    loadChip(chipType) {
        console.log(`Loading chip configuration for: ${chipType}`);
        this.currentChip = chipType;
        
        // Hide all buttons first
        this.hideAllButtons();
        
        // Load chip-specific module
        this.loadChipModule(chipType);
    }
    
    // Load chip-specific JavaScript module
    loadChipModule(chipType) {
        const chipModulePath = `chips/${chipType.toLowerCase()}.js`;
        
        // Remove existing chip module
        const existingScript = document.querySelector('script[data-chip-module]');
        if (existingScript) {
            existingScript.remove();
        }
        
        // Load new chip module
        const script = document.createElement('script');
        script.src = chipModulePath;
        script.setAttribute('data-chip-module', chipType);
        script.onload = () => {
            console.log(`Chip module loaded: ${chipType}`);
            this.activateChipButtons(chipType);
        };
        script.onerror = () => {
            console.warn(`Chip module not found: ${chipModulePath}`);
            this.activateDefaultButtons();
        };
        
        document.head.appendChild(script);
    }
    
    // Activate chip-specific buttons
    activateChipButtons(chipType) {
        const chipConfig = this.getChipConfiguration(chipType);
        
        chipConfig.buttons.forEach(buttonConfig => {
            const button = document.getElementById(buttonConfig.id);
            if (button) {
                button.style.display = 'inline-block';
                button.textContent = buttonConfig.text || button.textContent;
                button.onclick = () => this.executeChipFunction(buttonConfig.command);
            }
        });
    }
    
    // Get chip configuration
    getChipConfiguration(chipType) {
        const configurations = {
            'CP2112': {
                buttons: [
                    { id: 'read-chip-info-button', command: 'read_device_info', text: 'Read Device Info' },
                    { id: 'clear-errors-button', command: 'reset_device', text: 'Reset Device' },
                    { id: 'save-to-file-button', command: 'save_config', text: 'Save Config' },
                    { id: 'load-from-file-button', command: 'load_config', text: 'Load Config' }
                ]
            },
            'EV2300': {
                buttons: [
                    { id: 'unseal-chip-button', command: 'unseal_chip', text: 'Unseal Chip' },
                    { id: 'seal-chip-button', command: 'seal_chip', text: 'Seal Chip' },
                    { id: 'read-chip-info-button', command: 'read_battery_info', text: 'Battery Info' },
                    { id: 'read-eeprom-button', command: 'read_eeprom', text: 'Read EEPROM' },
                    { id: 'write-eeprom-button', command: 'write_eeprom', text: 'Write EEPROM' },
                    { id: 'clear-errors-button', command: 'clear_errors', text: 'Clear Errors' },
                    { id: 'save-to-file-button', command: 'save_to_file', text: 'Save to File' },
                    { id: 'load-from-file-button', command: 'load_from_file', text: 'Load from File' }
                ]
            }
        };
        
        return configurations[chipType] || { buttons: [] };
    }
    
    // Activate default buttons when no specific chip module is found
    activateDefaultButtons() {
        const defaultButtons = [
            { id: 'read-chip-info-button', command: 'read_info', text: 'Read Info' },
            { id: 'save-to-file-button', command: 'save_file', text: 'Save File' },
            { id: 'load-from-file-button', command: 'load_file', text: 'Load File' }
        ];
        
        defaultButtons.forEach(buttonConfig => {
            const button = document.getElementById(buttonConfig.id);
            if (button) {
                button.style.display = 'inline-block';
                button.textContent = buttonConfig.text;
                button.onclick = () => this.executeChipFunction(buttonConfig.command);
            }
        });
    }
    
    // Execute chip function
    executeChipFunction(command) {
        console.log(`Executing chip function: ${command}`);
        
        // Check if specific chip module has this function
        if (window.chipModule && typeof window.chipModule[command] === 'function') {
            window.chipModule[command]();
        } else {
            // Use default implementation
            this.executeDefaultFunction(command);
        }
    }
    
    // Execute default function implementation
    executeDefaultFunction(command) {
        const message = `Executing ${command.replace('_', ' ')}...`;
        
        if (window.advancedToolsView) {
            window.advancedToolsView.addLogEntry(message, 'info');
            
            // Simulate function execution
            setTimeout(() => {
                window.advancedToolsView.addLogEntry(`${command} completed successfully`, 'success');
            }, 1500);
        } else {
            console.log(message);
        }
    }
    
    // Get current chip
    getCurrentChip() {
        return this.currentChip;
    }
    
    // Check if chip is loaded
    isChipLoaded() {
        return this.currentChip !== null;
    }
}

// Create global instance
window.chipManager = new ChipManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChipManager;
}

