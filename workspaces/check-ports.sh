#!/bin/bash

echo "🔍 检查工作区端口占用情况..."

# 定义端口和工作区映射
declare -A PORTS=(
    ["3001"]="workspace-1-ui-form"
    ["3002"]="workspace-2-api-content"
    ["3003"]="workspace-3-html-rendering"
    ["3004"]="workspace-4-html-export"
)

echo "📊 端口占用状态："
echo "================================"

for port in "${!PORTS[@]}"; do
    workspace=${PORTS[$port]}
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        pid=$(lsof -Pi :$port -sTCP:LISTEN -t)
        echo "🔴 端口 $port (${workspace}): 被占用 (PID: $pid)"
    else
        echo "🟢 端口 $port (${workspace}): 可用"
    fi
done

echo "================================"
echo ""

# 检查是否有冲突
conflicts=0
for port in "${!PORTS[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        conflicts=$((conflicts + 1))
    fi
done

if [ $conflicts -gt 1 ]; then
    echo "⚠️  发现多个端口被占用，建议："
    echo "1. 运行 ./stop-all-workspaces.sh 停止所有服务"
    echo "2. 按照 PORT_ALLOCATION.md 中的顺序重新启动"
elif [ $conflicts -eq 1 ]; then
    echo "✅ 只有一个服务在运行，可以启动其他工作区"
else
    echo "✅ 所有端口都可用，可以启动任意工作区"
fi