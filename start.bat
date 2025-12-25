@echo off
REM 游戏中心启动脚本 (Windows)
REM 自动检测并使用可用的方式启动本地服务器

echo.
echo 🎮 游戏中心启动脚本
echo ====================
echo.

REM 检查 Python 3
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ 检测到 Python
    echo 📡 正在启动服务器 (端口 8000)...
    echo 🌐 请在浏览器中访问: http://localhost:8000
    echo.
    echo 按 Ctrl+C 停止服务器
    echo ====================
    echo.
    python -m http.server 8000
    goto :end
)

REM 检查 Node.js http-server
where http-server >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ 检测到 http-server
    echo 📡 正在启动服务器 (端口 8000)...
    echo 🌐 请在浏览器中访问: http://localhost:8000
    echo.
    echo 按 Ctrl+C 停止服务器
    echo ====================
    echo.
    http-server -p 8000
    goto :end
)

REM 检查 Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ 检测到 Node.js
    echo 💡 建议安装 http-server: npm install -g http-server
    echo.
    echo 现在使用 Node.js 创建简单服务器...
    echo 📡 正在启动服务器 (端口 8000)...
    echo 🌐 请在浏览器中访问: http://localhost:8000
    echo.
    echo 按 Ctrl+C 停止服务器
    echo ====================
    echo.
    node -e "const http=require('http'),fs=require('fs'),path=require('path');http.createServer((req,res)=>{const file=req.url==='/'?'/index.html':req.url;const filePath=path.join(__dirname,file);const ext=path.extname(filePath);const contentType={'html':'text/html','css':'text/css','js':'application/javascript'}[ext.slice(1)]||'text/plain';fs.readFile(filePath,(err,data)=>{if(err){res.writeHead(404);res.end('404 Not Found');return;}res.writeHead(200,{'Content-Type':contentType});res.end(data);});}).listen(8000,()=>console.log('Server running...'));"
    goto :end
)

REM 没有找到任何服务器
echo ❌ 错误: 未找到可用的服务器工具
echo.
echo 请安装以下工具之一：
echo   • Python 3: https://www.python.org/
echo   • Node.js + http-server: npm install -g http-server
echo.
echo 或者直接在浏览器中打开 index.html 文件
echo.
pause
exit /b 1

:end

