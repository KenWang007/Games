#!/bin/bash

# 游戏中心启动脚本
# 自动检测并使用可用的方式启动本地服务器

echo "🎮 游戏中心启动脚本"
echo "===================="

# 检查 Python 3
if command -v python3 &> /dev/null; then
    echo "✅ 检测到 Python 3"
    echo "📡 正在启动服务器 (端口 8000)..."
    echo "🌐 请在浏览器中访问: http://localhost:8000"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo "===================="
    python3 -m http.server 8000

# 检查 Python 2
elif command -v python &> /dev/null; then
    echo "✅ 检测到 Python 2"
    echo "📡 正在启动服务器 (端口 8000)..."
    echo "🌐 请在浏览器中访问: http://localhost:8000"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo "===================="
    python -m SimpleHTTPServer 8000

# 检查 Node.js http-server
elif command -v http-server &> /dev/null; then
    echo "✅ 检测到 http-server"
    echo "📡 正在启动服务器 (端口 8000)..."
    echo "🌐 请在浏览器中访问: http://localhost:8000"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo "===================="
    http-server -p 8000

# 检查 Node.js (可用于运行基本服务器)
elif command -v node &> /dev/null; then
    echo "✅ 检测到 Node.js"
    echo "💡 建议安装 http-server: npm install -g http-server"
    echo ""
    echo "现在使用 Node.js 创建简单服务器..."
    echo "📡 正在启动服务器 (端口 8000)..."
    echo "🌐 请在浏览器中访问: http://localhost:8000"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo "===================="
    node -e "const http=require('http'),fs=require('fs'),path=require('path');http.createServer((req,res)=>{const file=req.url==='/'?'/index.html':req.url;const filePath=path.join(__dirname,file);const ext=path.extname(filePath);const contentType={'html':'text/html','css':'text/css','js':'application/javascript'}[ext.slice(1)]||'text/plain';fs.readFile(filePath,(err,data)=>{if(err){res.writeHead(404);res.end('404 Not Found');return;}res.writeHead(200,{'Content-Type':contentType});res.end(data);});}).listen(8000,()=>console.log('Server running...'));"

else
    echo "❌ 错误: 未找到可用的服务器工具"
    echo ""
    echo "请安装以下工具之一："
    echo "  • Python 3: https://www.python.org/"
    echo "  • Node.js + http-server: npm install -g http-server"
    echo ""
    echo "或者直接在浏览器中打开 index.html 文件"
    exit 1
fi

