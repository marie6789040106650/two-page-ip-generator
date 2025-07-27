#!/bin/bash

echo "🚀 快速测试多工作区环境"

# 检查Node.js版本
echo "📋 检查环境..."
node_version=$(node -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Node.js: $node_version"
else
    echo "❌ Node.js 未安装"
    exit 1
fi

npm_version=$(npm -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ npm: $npm_version"
else
    echo "❌ npm 未安装"
    exit 1
fi

# 检查工作区结构
echo ""
echo "📁 检查工作区结构..."

workspaces=("workspace-1-ui-form" "workspace-2-api-content" "workspace-3-html-rendering" "workspace-4-html-export")

for workspace in "${workspaces[@]}"; do
    if [ -d "$workspace" ]; then
        if [ -f "$workspace/package.json" ]; then
            echo "✅ $workspace - 结构完整"
        else
            echo "⚠️  $workspace - 缺少 package.json"
        fi
    else
        echo "❌ $workspace - 目录不存在"
    fi
done

echo ""
echo "🧪 测试工作区1和工作区2..."

# 测试工作区1的依赖安装
echo "📦 测试工作区1依赖..."
cd workspace-1-ui-form
if npm list next >/dev/null 2>&1; then
    echo "✅ 工作区1 - 依赖已安装"
else
    echo "⚠️  工作区1 - 需要安装依赖"
    echo "   运行: cd workspace-1-ui-form && npm install"
fi
cd ..

# 测试工作区2的依赖安装
echo "📦 测试工作区2依赖..."
cd workspace-2-api-content
if npm list next >/dev/null 2>&1; then
    echo "✅ 工作区2 - 依赖已安装"
else
    echo "⚠️  工作区2 - 需要安装依赖"
    echo "   运行: cd workspace-2-api-content && npm install"
fi
cd ..

echo ""
echo "🎯 启动建议："
echo "1. 启动单个工作区:"
echo "   - ./test-workspace-1.sh (表单)"
echo "   - ./test-workspace-2.sh (API)"
echo "   - ./test-workspace-3.sh (渲染)"
echo "   - ./test-workspace-4.sh (导出)"
echo "2. 启动所有工作区: ./start-all-workspaces.sh"
echo ""
echo "📊 访问地址："
echo "- 工作区1 (表单): http://localhost:3001 ✅"
echo "- 工作区2 (API): http://localhost:3002 ✅"
echo "- 工作区3 (渲染): http://localhost:3003 ✅"
echo "- 工作区4 (导出): http://localhost:3004 ✅"