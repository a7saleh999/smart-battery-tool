@echo off
REM Smart Battery Tool v3.1.02 - Windows Launch Script
REM Internal Version: 1
REM Last Modified: June 30, 2025
REM Author: Ahmed Saleh

echo Starting Smart Battery Tool v3.1.02...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.x and try again
    pause
    exit /b 1
)

REM Start local HTTP server
echo Starting local HTTP server on port 8080...
echo.
echo Open your browser and navigate to: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.

python -m http.server 8080

pause

