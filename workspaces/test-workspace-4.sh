#!/bin/bash

echo "🧪 测试工作区4 - HTML导出和文档生成"

cd workspace-4-html-export

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
echo "访问地址: http://localhost:3004"
echo "API端点:"
echo "  - POST /api/export-word (Word导出)"
echo "  - POST /api/export-pdf (PDF导出)"
echo "  - GET /api/health (健康检查)"
echo "按 Ctrl+C 停止服务"

npm run dev