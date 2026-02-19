@echo off
setlocal

set APP_DIR=%~dp0
set APP_DIR=%APP_DIR:~0,-1%

echo [0/3] 清理已占用端口...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":9000 "') do (
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8888 "') do (
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 1 /nobreak >nul

echo [1/3] 启动后端 API (8888)...
start "pay_system_server" cmd /k "cd /d %APP_DIR% && set NODE_ENV=development && set JWT_KEY=xiaomupossystem && set DB_PATH=%APP_DIR%\server\db\data.db && node server\src\index.js"

timeout /t 2 /nobreak >nul

echo [2/3] 启动前端页面 (9000)...
start "pay_system_client" cmd /k "cd /d %APP_DIR%\client && npm run dev:client"

timeout /t 6 /nobreak >nul

echo [3/3] 打开浏览器...
start "" http://localhost:9000

echo 完成。请保持新开的两个命令窗口不要关闭。
endlocal
