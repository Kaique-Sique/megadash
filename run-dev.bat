@echo off
setlocal
title Megadash (dev)
cd /d "%~dp0"


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