@echo off
set NODE_ENV=production
set APP_DIR=%~dp0
set APP_DIR=%APP_DIR:~0,-1%
start "" "%APP_DIR%\node_modules\electron\dist\electron.exe" "%APP_DIR%"
