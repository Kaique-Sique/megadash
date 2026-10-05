@echo off
setlocal
title Megadash (dev)
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js not found. Please install it from https://nodejs.org and try again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo installing dependencies...
  call npm install
  if errorlevel 1 (
    echo Failed to install dependencies.
    pause
    exit /b 1
  )
)

echo opening http://localhost:3000 ...
start "" cmd /c "timeout /t 4 /nobreak >nul & start http://localhost:3000"
call npm run dev
pause