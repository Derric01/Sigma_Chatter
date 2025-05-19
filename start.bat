@echo off
echo Starting Sigma Chatter in local development mode with performance optimizations...
echo.
echo Make sure you have MongoDB running!
echo.

REM Check if the application is already running
netstat -ano | findstr :5001 > nul
if %errorlevel% equ 0 (
    echo Backend is already running on port 5001
    echo Killing previous process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5001') do (
        taskkill /F /PID %%a
    )
    timeout /t 2
)

echo Starting backend and frontend servers...
echo.
cd backend && start cmd /k "npm start"
timeout /t 5
cd frontend && npm run dev
