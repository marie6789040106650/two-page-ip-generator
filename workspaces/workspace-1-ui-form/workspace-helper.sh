#!/bin/bash

# 工作区1专用的辅助脚本
WORKSPACE_ID="1"
WORKSPACE_NAME="workspace-1-ui-form"
PORT="3001"

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
    
    # 使用jq安全更新JSON
    jq ".status = \"$status\" | .currentTask = \"$task\" | .lastUpdate = \"$timestamp\"" \
       "$status_file" > "$status_file.tmp" && mv "$status_file.tmp" "$status_file"
    
    echo "✅ 工作区1状态已更新: $status"
}

# 检查我的依赖服务
check_dependencies() {
    echo "🔍 检查工作区1的依赖服务..."
    
    # 检查工作区2 (API服务)
    if curl -s --connect-timeout 2 "http://localhost:3002/api/health" >/dev/null 2>&1; then
        echo "✅ 工作区2 API服务: 可用"
        return 0
    else
        echo "❌ 工作区2 API服务: 不可用"
        echo "💡 建议: 请启动工作区2的开发服务器"
        return 1
    fi
}

# 启动我的服务
start_my_service() {
    echo "🚀 启动工作区1服务..."
    
    # 检查端口是否被占用
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ 端口$PORT已被占用"
        return 1
    fi
    
    # 更新状态为启动中
    update_my_status "starting" "启动开发服务器"
    
    # 启动服务 (这里只是示例，实际由Kiro执行)
    echo "📝 请执行: npm run dev"
    echo "🌐 服务将运行在: http://localhost:$PORT"
    
    # 更新状态为运行中
    update_my_status "running" "开发服务器已启动"
}

# 主菜单
case "$1" in
    "status")
        update_my_status "${2:-running}" "${3:-开发中}"
        ;;
    "check")
        check_dependencies
        ;;
    "start")
        start_my_service
        ;;
    *)
        echo "工作区1辅助脚本"
        echo "用法: $0 {status|check|start}"
        echo ""
        echo "  status [状态] [任务]  - 更新状态"
        echo "  check                - 检查依赖服务"
        echo "  start                - 启动服务"
        ;;
esac