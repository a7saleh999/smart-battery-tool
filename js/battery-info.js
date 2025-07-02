// Smart Battery Tool - Battery Info Interface
// Internal Version: 2
// Last Modified: June 30, 2025
// Author: Ahmed Saleh

// Battery Information Interface
window.batteryInfoView = {
    refreshInterval: null,
    isAutoRefresh: false,
    lastUpdateTime: null,
    
    // Initialize the interface
    initialize() {
        console.log('Initializing Battery Info interface...');
        
        try {
            // Bind events
            this.bindEvents();
            
            // Initial data update
            this.refreshData();
            
            // Start auto-refresh if connected
            if (window.appUtils && window.appUtils.isConnected()) {
                this.startAutoRefresh();
            }
            
            console.log('Battery Info interface initialized successfully');
        } catch (error) {
            console.error('Error initializing Battery Info interface:', error);
        }
    },
    
    // Bind event handlers
    bindEvents() {
        // Refresh button
        const refreshBtn = document.getElementById('refresh-data');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }
        
        // Export button
        const exportBtn = document.getElementById('export-data');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
    },
    
    // Refresh battery data
    async refreshData() {
        try {
            if (window.appUtils) {
                window.appUtils.showMessage('Refreshing battery data...', 'info');
            }
            
            // Get battery information from API (simulate if API bridge not available)
            let batteryData;
            if (window.apiBridge && typeof window.apiBridge.getBatteryInfo === 'function') {
                batteryData = await window.apiBridge.getBatteryInfo();
            } else {
                // Simulate battery data for testing
                batteryData = this.getSimulatedBatteryData();
            }
            
            // Update UI with new data
            this.updateUI(batteryData);
            
            this.lastUpdateTime = new Date();
            
            if (window.appUtils) {
                window.appUtils.showMessage('Battery data updated successfully', 'success');
            }
            
        } catch (error) {
            console.error('Error refreshing battery data:', error);
            if (window.appUtils) {
                window.appUtils.showMessage('Failed to refresh battery data', 'error');
            }
        }
    },
    
    // Get simulated battery data for testing
    getSimulatedBatteryData() {
        return {
            chargePercentage: Math.floor(Math.random() * 100),
            status: Math.random() > 0.5 ? 'Charging' : 'Discharging',
            voltage: (3.7 + Math.random() * 0.5).toFixed(2),
            current: (Math.random() * 2).toFixed(2),
            temperature: Math.floor(20 + Math.random() * 20),
            health: Math.floor(80 + Math.random() * 20)
        };
    },
    
    // Update UI elements with battery data
    updateUI(data) {
        // Update charge status
        this.updateElement('charge-percentage', `${data.chargePercentage}%`);
        this.updateElement('charge-status', data.status);
        this.updateProgressBar('.progress-fill', data.chargePercentage);
        
        // Update voltage and current
        this.updateElement('voltage', `${data.voltage}V`);
        this.updateElement('current', `${data.current}A`);
        
        // Update temperature
        this.updateElement('temperature', `${data.temperature}°C`);
        this.updateElement('temp-status', this.getTemperatureStatus(data.temperature));
        this.updateProgressBar('.temp-fill', this.getTemperaturePercentage(data.temperature));
        
        // Update battery health
        this.updateElement('health-percentage', `${data.health}%`);
        this.updateElement('health-status', this.getHealthStatus(data.health));
        this.updateCircularProgress('.circle', data.health);
    },
    
    // Update individual element
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    },
    
    // Update progress bar
    updateProgressBar(selector, percentage) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.width = `${percentage}%`;
        }
    },
    
    // Update circular progress
    updateCircularProgress(selector, percentage) {
        const element = document.querySelector(selector);
        if (element) {
            element.setAttribute('stroke-dasharray', `${percentage}, 100`);
        }
    },
    
    // Get temperature status text
    getTemperatureStatus(temp) {
        if (temp < 10) return 'Cold';
        if (temp < 25) return 'Cool';
        if (temp < 40) return 'Normal';
        if (temp < 50) return 'Warm';
        return 'Hot';
    },
    
    // Get temperature percentage for progress bar
    getTemperaturePercentage(temp) {
        // Assuming 0-60°C range
        return Math.min(Math.max((temp / 60) * 100, 0), 100);
    },
    
    // Get health status text
    getHealthStatus(health) {
        if (health >= 90) return 'Excellent';
        if (health >= 80) return 'Good';
        if (health >= 70) return 'Fair';
        if (health >= 50) return 'Poor';
        return 'Critical';
    },
    
    // Start auto-refresh
    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        this.isAutoRefresh = true;
        this.refreshInterval = setInterval(() => {
            this.refreshData();
        }, 5000); // Refresh every 5 seconds
        
        console.log('Auto-refresh started');
    },
    
    // Stop auto-refresh
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        
        this.isAutoRefresh = false;
        console.log('Auto-refresh stopped');
    },
    
    // Export battery data
    async exportData() {
        try {
            let batteryData;
            if (window.apiBridge && typeof window.apiBridge.getBatteryInfo === 'function') {
                batteryData = await window.apiBridge.getBatteryInfo();
            } else {
                batteryData = this.getSimulatedBatteryData();
            }
            
            const exportData = {
                timestamp: new Date().toISOString(),
                batteryInfo: batteryData,
                exportedBy: 'Smart Battery Tool v3.1.03'
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `battery_data_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            
            if (window.appUtils) {
                window.appUtils.showMessage('Battery data exported successfully', 'success');
            }
            
        } catch (error) {
            console.error('Error exporting data:', error);
            if (window.appUtils) {
                window.appUtils.showMessage('Failed to export battery data', 'error');
            }
        }
    },
    
    // Cleanup when view is destroyed
    cleanup() {
        this.stopAutoRefresh();
        console.log('Battery Info interface cleaned up');
    }
};

