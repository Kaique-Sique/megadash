@echo off
setlocal
title Megadash (producao)
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

echo Generating optimized version...
call npm run build
if errorlevel 1 (
  echo Build failed.
  pause
  exit /b 1
)

echo opening http://localhost:3000 ...
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"
call npm run start
pause