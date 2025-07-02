// Smart Battery Tool - API Bridge
// Internal Version: 1
// Last Modified: June 30, 2025
// Author: Ahmed Saleh

// API Bridge for backend communication with C# WebView2
class ApiBridge {
    constructor() {
        this.isWebView2 = typeof window.chrome !== 'undefined' && window.chrome.webview;
        this.requestId = 0;
        this.pendingRequests = new Map();
        
        if (this.isWebView2) {
            // Initialize message reception from C#
            window.chrome.webview.addEventListener('message', this.handleMessage.bind(this));
        }
    }

    // Handle messages from C# backend
    handleMessage(event) {
        try {
            const response = JSON.parse(event.data);
            
            if (response.requestId && this.pendingRequests.has(response.requestId)) {
                const { resolve, reject } = this.pendingRequests.get(response.requestId);
                
                if (response.success) {
                    resolve(response.data);
                } else {
                    reject(new Error(response.error || 'Unknown error'));
                }
                
                this.pendingRequests.delete(response.requestId);
            }
        } catch (error) {
            console.error('Error parsing message from C#:', error);
        }
    }

    // Send command to C# backend
    async sendCommand(command, data = {}) {
        if (!this.isWebView2) {
            // Simulate API calls for web testing
            return this.simulateApiCall(command, data);
        }

        return new Promise((resolve, reject) => {
            const requestId = ++this.requestId;
            
            this.pendingRequests.set(requestId, { resolve, reject });
            
            const message = {
                requestId,
                command,
                data
            };
            
            try {
                window.chrome.webview.postMessage(JSON.stringify(message));
            } catch (error) {
                this.pendingRequests.delete(requestId);
                reject(error);
            }
            
            // Timeout after 30 seconds
            setTimeout(() => {
                if (this.pendingRequests.has(requestId)) {
                    this.pendingRequests.delete(requestId);
                    reject(new Error('Request timeout'));
                }
            }, 30000);
        });
    }

    // Simulate API calls for web testing
    async simulateApiCall(command, data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        
        switch (command) {
            case 'GetAdapters':
                return ['CP2112', 'EV2300'];
                
            case 'ConnectAdapter':
                return { success: true, adapter: data.adapter };
                
            case 'DisconnectAdapter':
                return { success: true };
                
            case 'GetBatteryInfo':
                return {
                    chargePercentage: 85,
                    voltage: 12.6,
                    current: 2.1,
                    temperature: 32,
                    health: 92,
                    status: 'Charging'
                };
                
            case 'ReadMemory':
                return {
                    address: data.address,
                    data: 'AA BB CC DD EE FF 00 11 22 33 44 55 66 77 88 99',
                    ascii: '...............'
                };
                
            case 'WriteMemory':
                return { success: true, bytesWritten: data.data.length };
                
            case 'ExecuteFunction':
                return { 
                    result: `Function ${data.function} executed successfully`,
                    returnValue: Math.floor(Math.random() * 100)
                };
                
            default:
                throw new Error(`Unknown command: ${command}`);
        }
    }

    // Battery-specific API methods
    async getAdapters() {
        return await this.sendCommand('GetAdapters');
    }

    async connectAdapter(adapter) {
        return await this.sendCommand('ConnectAdapter', { adapter });
    }

    async disconnectAdapter() {
        return await this.sendCommand('DisconnectAdapter');
    }

    async getBatteryInfo() {
        return await this.sendCommand('GetBatteryInfo');
    }

    async readMemory(address, length = 16) {
        return await this.sendCommand('ReadMemory', { address, length });
    }

    async writeMemory(address, data) {
        return await this.sendCommand('WriteMemory', { address, data });
    }

    async executeFunction(functionName, parameters = {}) {
        return await this.sendCommand('ExecuteFunction', { 
            function: functionName, 
            parameters 
        });
    }

    // Utility methods
    isConnectedToBackend() {
        return this.isWebView2;
    }

    getPendingRequestsCount() {
        return this.pendingRequests.size;
    }
}

// Create global instance
window.apiBridge = new ApiBridge();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiBridge;
}

