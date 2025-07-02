# Smart Battery Tool v3.0

**Internal Version:** 1  
**Last Modified:** June 30, 2025  
**Author:** Ahmed Saleh  

## Overview

Smart Battery Tool is a comprehensive battery monitoring and management application designed for professional use. The application provides advanced diagnostics, real-time monitoring, and battery health analysis capabilities through a modern web-based interface.

## Features

- **Real-time Battery Monitoring**: Live display of charge status, voltage, current, and temperature
- **Advanced Diagnostic Tools**: Memory editor, core functions, and comprehensive logging
- **Battery Health Analysis**: Detailed health metrics and status indicators
- **Data Export**: Export battery data in JSON format for analysis
- **Multiple Adapter Support**: Compatible with CP2112 and EV2300 adapters
- **Professional Interface**: Clean, responsive design optimized for 800x600 resolution

## System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Python**: Version 3.6 or higher
- **Web Browser**: Modern browser with JavaScript support
- **Screen Resolution**: Minimum 800x600 pixels
- **Network**: Local network access for HTTP server

## Installation

1. Extract the application files to your desired directory
2. Ensure Python 3 is installed on your system
3. Run the appropriate launch script:
   - **Linux/macOS**: `./run.sh`
   - **Windows**: `run.bat`

## Usage

### Starting the Application

1. Navigate to the application directory
2. Run the launch script for your operating system
3. The application will start a local HTTP server
4. Open your web browser and navigate to `http://localhost:8080`

### Interface Overview

The application features a layered architecture with separated components:

- **Top Bar**: Contains application title, version, adapter selection, and connection controls
- **Sidebar**: Navigation tabs for different application views
- **Main Content Area**: Dynamic content based on selected view
- **Footer**: Developer information and credits

### Available Views

1. **Info**: Real-time battery information and status
2. **Advanced**: Diagnostic tools, memory editor, and logging
3. **Charge**: Battery charging and discharge controls (under development)
4. **Calibration**: Battery calibration tools (under development)
5. **Settings**: Application preferences (under development)
6. **About**: Application information and version details

## Architecture

The application follows a layered architecture design:

- **Presentation Layer**: HTML/CSS/JavaScript frontend
- **API Bridge Layer**: Communication interface with backend systems
- **View Layer**: Modular view components for different features
- **Utility Layer**: Shared functions and helpers

## File Structure

```
smart-battery-tool/
├── index.html              # Main application file
├── run.sh                  # Linux/macOS launch script
├── run.bat                 # Windows launch script
├── css/                    # Stylesheets
│   ├── main.css           # Main application styles
│   ├── battery-info.css   # Battery info view styles
│   └── advanced-tools.css # Advanced tools view styles
├── js/                     # JavaScript files
│   ├── main.js            # Main application logic
│   ├── api-bridge.js      # API communication bridge
│   ├── battery-info.js    # Battery info view logic
│   └── advanced-tools.js  # Advanced tools view logic
├── views/                  # HTML view templates
│   ├── battery-info.html  # Battery information view
│   ├── advanced-tools.html # Advanced tools view
│   ├── charge-discharge.html # Charge/discharge view
│   ├── calibration.html   # Calibration view
│   ├── settings.html      # Settings view
│   └── about.html         # About view
├── assets/                 # Application assets
│   └── battery-icon.png   # Application icon
└── docs/                   # Documentation files
```

## Development Guidelines

### Version Control

- **Main Version**: Starts from v3.0
- **Internal Version**: Incremental numbering starting from 1
- **Bug Fixes**: Increment by 0.01 (e.g., 1.00 → 1.01)
- **Major Updates**: Increment by 0.1 (e.g., 1.01 → 1.1)

### Code Standards

- All code comments and documentation must be in English
- Each code file must include internal version number
- Follow layered architecture principles
- Maintain separation between top bar and navigation tabs

### File Naming

- All files must include version numbers in documentation
- Update version numbers with each modification
- Maintain consistent naming conventions

## Troubleshooting

### Common Issues

1. **Port Already in Use**: The launch script will automatically find an available port
2. **Python Not Found**: Ensure Python 3 is installed and in your system PATH
3. **Files Missing**: Verify all application files are present in the directory
4. **Browser Compatibility**: Use a modern browser with JavaScript enabled

### Error Messages

- **"Error Loading View"**: Check that all view files are present in the views/ directory
- **"Failed to fetch"**: Ensure the HTTP server is running and accessible
- **"Please select an adapter first"**: Choose an adapter from the dropdown before connecting

## Support

For technical support or questions about the Smart Battery Tool, please refer to the documentation or contact the development team.

## License

© 2025 Smart Battery Tool. All rights reserved.

---

**Note**: This application is designed for professional battery monitoring and diagnostic purposes. Always follow proper safety procedures when working with battery systems.

