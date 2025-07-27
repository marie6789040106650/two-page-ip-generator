#!/bin/bash

# 工作区状态检查脚本
echo "🔍 工作区状态检查"
echo "================================"

# 检查各工作区的服务状态
check_service() {
    local port=$1
    local workspace=$2
    local url="http://localhost:$port"
    
    if curl -s --connect-timeout 2 "$url" >/dev/null 2>&1; then
        echo "🟢 $workspace (端口$port): 服务运行中"
        return 0
    else
        echo "🔴 $workspace (端口$port): 服务未启动"
        return 1
    fi
}

# 检查API端点
check_api() {
    local url=$1
    local name=$2
    
    if curl -s --connect-timeout 2 "$url" >/dev/null 2>&1; then
        echo "  ✅ $name: 可用"
    else
        echo "  ❌ $name: 不可用"
    fi
}

echo "📊 服务状态："
check_service 3001 "工作区1-表单页面"
check_service 3003 "工作区3-渲染页面"

echo ""
echo "📡 API服务状态："
if check_service 3002 "工作区2-API服务"; then
    check_api "http://localhost:3002/api/health" "健康检查"
    check_api "http://localhost:3002/api/generate-content" "内容生成"
fi

if check_service 3004 "工作区4-导出服务"; then
    check_api "http://localhost:3004/api/health" "健康检查"
    check_api "http://localhost:3004/api/export-word" "Word导出"
    check_api "http://localhost:3004/api/export-pdf" "PDF导出"
fi

echo ""
echo "🔗 工作区依赖关系："
echo "工作区1 → 工作区2 (API调用)"
echo "工作区2 → 工作区3 (内容传递)"
echo "工作区3 → 工作区4 (导出请求)"

echo ""
echo "💡 建议启动顺序："
echo "1. 工作区2 (API服务)"
echo "2. 工作区4 (导出服务)"  
echo "3. 工作区1 (表单页面)"
echo "4. 工作区3 (渲染页面)"