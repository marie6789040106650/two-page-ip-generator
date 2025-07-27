#!/bin/bash

echo "🧪 测试工作区3 - HTML渲染和样式系统"

cd workspace-3-html-rendering

# 检查是否存在package.json
if [ ! -f "package.json" ]; then
    echo "❌ package.json 不存在"
    exit 1
fi

echo "📦 安装依赖..."
npm install --silent

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装成功"

echo "🔧 启动开发服务器..."
echo "访问地址: http://localhost:3003"
echo "功能: Markdown渲染、水印系统、主题切换"
echo "按 Ctrl+C 停止服务"

npm run dev