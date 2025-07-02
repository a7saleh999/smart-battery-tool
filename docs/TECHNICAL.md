# Smart Battery Tool - Technical Documentation

**Version:** 3.0  
**Internal Version:** 1  
**Last Modified:** June 30, 2025  
**Author:** Ahmed Saleh  

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Documentation](#component-documentation)
3. [API Reference](#api-reference)
4. [Development Guidelines](#development-guidelines)
5. [Version Control](#version-control)
6. [Deployment Guide](#deployment-guide)

## Architecture Overview

### Layered Architecture Design

The Smart Battery Tool follows a strict layered architecture pattern to ensure maintainability, scalability, and separation of concerns.

#### Layer Structure

1. **Presentation Layer** (`index.html`, `css/`)
   - User interface components
   - Visual styling and layout
   - Responsive design implementation

2. **Application Layer** (`js/main.js`)
   - Application logic and state management
   - Event handling and user interactions
   - View navigation and routing

3. **API Bridge Layer** (`js/api-bridge.js`)
   - Communication with backend systems
   - WebView2 integration for C# applications
   - API call simulation for web testing

4. **View Layer** (`views/`, `js/*-view.js`)
   - Modular view components
   - View-specific logic and data handling
   - Dynamic content loading

5. **Utility Layer**
   - Shared functions and helpers
   - Common utilities and constants

### Component Separation

#### Top Bar vs Navigation Tabs
- **Top Bar**: Application title, version, adapter controls, connection status
- **Navigation Tabs**: View switching, feature access
- **Benefit**: Enhanced flexibility for future updates and modifications

#### Modular View System
- Each view is self-contained with its own HTML, CSS, and JavaScript
- Dynamic loading prevents initial page bloat
- Easy to add, remove, or modify individual views

## Component Documentation

### Main Application (`js/main.js`)

**Internal Version:** 1

#### Key Functions

```javascript
// Initialize application
function initializeApp()

// Load view dynamically
async function loadView(viewName)

// Handle adapter connection
function toggleConnection()

// Show user messages
function showMessage(message, type)
```

#### Global Variables

- `currentView`: Currently active view name
- `isConnected`: Connection status
- `currentAdapter`: Selected adapter

### API Bridge (`js/api-bridge.js`)

**Internal Version:** 1

#### Class: ApiBridge

Handles communication between the web interface and backend systems.

##### Methods

```javascript
// Send command to backend
async sendCommand(command, data)

// Battery-specific methods
async getAdapters()
async connectAdapter(adapter)
async getBatteryInfo()
async readMemory(address, length)
async writeMemory(address, data)
```

##### WebView2 Integration

- Detects WebView2 environment
- Handles message passing with C# backend
- Provides fallback simulation for web testing

### Battery Info View (`js/battery-info.js`)

**Internal Version:** 1

#### Class: BatteryInfoView

Manages the battery information display and data updates.

##### Key Features

- Real-time data refresh
- Auto-refresh capability
- Data export functionality
- Progress bar animations
- Status text generation

### Advanced Tools View (`js/advanced-tools.js`)

**Internal Version:** 1

#### Class: AdvancedToolsView

Provides advanced diagnostic and memory editing capabilities.

##### Features

- Memory editor with hex display
- Core function execution
- Logging system
- Chip module loading

## API Reference

### Backend Communication Protocol

#### Message Format

```json
{
  "requestId": number,
  "command": string,
  "data": object
}
```

#### Response Format

```json
{
  "requestId": number,
  "success": boolean,
  "data": object,
  "error": string
}
```

#### Supported Commands

1. **GetAdapters**
   - Returns: Array of available adapter names
   - Parameters: None

2. **ConnectAdapter**
   - Returns: Connection status
   - Parameters: `{ adapter: string }`

3. **GetBatteryInfo**
   - Returns: Battery status object
   - Parameters: None

4. **ReadMemory**
   - Returns: Memory data
   - Parameters: `{ address: string, length: number }`

5. **WriteMemory**
   - Returns: Write status
   - Parameters: `{ address: string, data: string }`

## Development Guidelines

### Code Standards

#### Language Requirements
- **Strict Rule**: All code comments, variable names, and documentation MUST be in English
- **No Exceptions**: Arabic text is prohibited in code files
- **Consistency**: Maintain English throughout all development phases

#### Version Control Standards

##### Versioning Rules
- The main version number (e.g., v3.1.02) MUST be clearly displayed within the program interface (Splash, About, or Title).
- The version number MUST be included in every main documentation file and in the header of every core code file.
- The executable file name (e.g., .exe) MUST contain the version number (e.g., SmartBatteryTool_v3.1.02.exe).
- Version numbers MUST only be incremented with each modification or new update. It is strictly forbidden to reset the number or revert to lower numbers for any reason. If a version reaches a certain number (e.g., 1.08), it can only be increased from there.

##### Internal Version Numbering
- **Starting Point**: All files begin with Internal Version 1
- **Increment Rules**:
  - Bug fixes: +0.01 (e.g., 1.00 → 1.01)
  - Minor updates: +0.1 (e.g., 1.01 → 1.1)
  - Major updates: +1.0 (e.g., 1.1 → 2.0)

##### File Headers
Every code file must include:
```javascript
// Smart Battery Tool - [Component Name]
// Internal Version: [Number]
// Last Modified: [Date]
// Author: Ahmed Saleh
```

#### Architecture Rules

1. **Layer Separation**: Maintain strict boundaries between layers. Any new code MUST fully adhere to this separation without merging logic from one layer with another. It is strictly forbidden to transfer logic or functions from one layer to another except through authorized APIs as specified in the plan.
2. **Component Independence**: Each view should be self-contained
3. **API Abstraction**: All backend communication through API Bridge
4. **Error Handling**: Comprehensive error handling at all levels

### File Organization

#### Directory Structure Rules
- `css/`: Stylesheets only, organized by component
- `js/`: JavaScript files, one per major component
- `views/`: HTML templates for dynamic loading
- `assets/`: Static resources (images, icons)
- `docs/`: Documentation files

#### Naming Conventions
- Files: lowercase with hyphens (e.g., `battery-info.js`)
- Classes: PascalCase (e.g., `BatteryInfoView`)
- Functions: camelCase (e.g., `refreshData`)
- Constants: UPPER_SNAKE_CASE (e.g., `DEFAULT_PORT`)

## Version Control

### Version History

#### v3.0 (Internal Version 1) - June 30, 2025
- Initial release with layered architecture
- Battery information monitoring
- Advanced diagnostic tools
- English-only interface
- 800x600 horizontal layout
- Separated top bar and navigation tabs

### Change Management

#### Before Making Changes
1. Document understanding of required changes. Before any modification or update, the programmer MUST send a brief explanation of their understanding of the required modification and obtain written approval from management or the project owner before execution.
2. Update internal version numbers
3. Modify last modified dates
4. Test thoroughly before deployment

#### Documentation Updates
- All changes must be documented. All documentation MUST be updated with every code update or modification, and the version number MUST be included in every document.
- Maintain README.md currency
- Update CHANGELOG.md for all modifications
- Version stamp all documentation files. Each document or file MUST have its own version number, which is updated with every change or addition (e.g., from 1.0 to 1.01 for a minor bug fix, or from 1.01 to 1.1 for a new feature or update).

## Deployment Guide

### Local Development

1. **Setup**:
   ```bash
   cd smart-battery-tool
   python3 -m http.server 8080
   ```

2. **Testing**:
   - Open `http://localhost:8080`
   - Test all views and functionality
   - Verify responsive design

### Production Deployment

1. **File Verification**:
   - Ensure all files present
   - Check version numbers
   - Validate file permissions

2. **Launch Scripts**:
   - A patch or script MUST be attached to run the program with each release, whether for testing or normal operation, and it MUST be documented in the project files.
   - Linux/macOS: `./run.sh`
   - Windows: `run.bat`

3. **Browser Compatibility**:
   - Chrome 80+
   - Firefox 75+
   - Safari 13+
   - Edge 80+

### Performance Considerations

- **Loading Time**: Views load dynamically to reduce initial load
- **Memory Usage**: Cleanup view instances when switching
- **Network**: Minimal external dependencies
- **Caching**: Static assets cached by browser

## Security Considerations

### Web Security
- No external CDN dependencies
- Local file access only
- CORS handled through local server
- No sensitive data in client-side code

### Backend Communication
- Message validation on both ends
- Request timeout handling
- Error message sanitization
- Connection state management

## Programming Languages

- **Back-end**: C#
- **API Bridge**: JavaScript
- **Front-end**: HTML, CSS, JavaScript
- **Chips Logic**: JavaScript (separate files for each chip)

Any proposal to change a language or introduce a new tool MUST first be submitted for technical management review.

## Program Language

All program screens, messages, interfaces, documents, and any content visible to the user MUST be in English only. The use of Arabic or any other language is NOT allowed in any part visible to the user, to ensure professionalism and compatibility with the global market.

## Official Program Dimensions

All program screens and interfaces MUST be 800 pixels wide x 600 pixels high (800x600) to ensure a horizontal (Landscape) display compatible with computer devices.

---

**Document Version:** 1.1  
**Last Updated:** June 30, 2025  
**Next Review:** As needed for updates
