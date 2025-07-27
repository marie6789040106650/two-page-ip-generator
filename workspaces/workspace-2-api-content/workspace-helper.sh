#!/bin/bash

# 工作区2专用的辅助脚本
WORKSPACE_ID="2"
WORKSPACE_NAME="workspace-2-api-content"
PORT="3002"

# 更新我的状态
update_my_status() {
    local status=$1
    local task=$2
    
    cd ../shared-state
    
    # 使用安全的更新脚本
    ./update-status.sh "$WORKSPACE_ID" || {
        echo "❌ 状态更新失败"
        return 1
    }
    
    # 更新具体信息
    local status_file="workspace-${WORKSPACE_ID}-status.json"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    # 更新API端点状态
    if [ "$status" = "running" ]; then
        jq ".status = \"$status\" | .currentTask = \"$task\" | .lastUpdate = \"$timestamp\" | 
            .services.apiEndpoints.\"/api/generate-content\" = \"ready\" |
            .services.apiEndpoints.\"/api/health\" = \"ready\"" \
           "$status_file" > "$status_file.tmp" && mv "$status_file.tmp" "$status_file"
    else
        jq ".status = \"$status\" | .currentTask = \"$task\" | .lastUpdate = \"$timestamp\"" \
           "$status_file" > "$status_file.tmp" && mv "$status_file.tmp" "$status_file"
    fi
    
    echo "✅ 工作区2状态已更新: $status"
}

# 检查我的服务状态
check_my_services() {
    echo "🔍 检查工作区2的服务状态..."
    
    # 检查健康检查端点
    if curl -s --connect-timeout 2 "http://localhost:$PORT/api/health" >/dev/null 2>&1; then
        echo "✅ 健康检查端点: 可用"
    else
        echo "❌ 健康检查端点: 不可用"
    fi
    
    # 检查内容生成端点
    if curl -s --connect-timeout 2 "http://localhost:$PORT/api/generate-content" >/dev/null 2>&1; then
        echo "✅ 内容生成端点: 可用"
    else
        echo "❌ 内容生成端点: 不可用"
    fi
}

# 启动我的服务
start_my_service() {
    echo "🚀 启动工作区2服务..."
    
    # 检查端口是否被占用
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ 端口$PORT已被占用"
        return 1
    fi
    
    # 更新状态为启动中
    update_my_status "starting" "启动API服务器"
    
    # 启动服务 (这里只是示例，实际由Kiro执行)
    echo "📝 请执行: npm run dev"
    echo "🌐 API服务将运行在: http://localhost:$PORT"
    echo "📡 主要端点:"
    echo "   - POST /api/generate-content"
    echo "   - GET /api/health"
    
    # 更新状态为运行中
    update_my_status "running" "API服务器已启动"
}

# 主菜单
case "$1" in
    "status")
        update_my_status "${2:-running}" "${3:-API服务运行中}"
        ;;
    "check")
        check_my_services
        ;;
    "start")
        start_my_service
        ;;
    *)
        echo "工作区2辅助脚本"
        echo "用法: $0 {status|check|start}"
        echo ""
        echo "  status [状态] [任务]  - 更新状态"
        echo "  check                - 检查服务状态"
        echo "  start                - 启动服务"
        ;;
esac