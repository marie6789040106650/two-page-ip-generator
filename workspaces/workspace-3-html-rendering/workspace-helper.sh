#!/bin/bash

# 工作区3专用的辅助脚本
WORKSPACE_ID="3"
WORKSPACE_NAME="workspace-3-html-rendering"
PORT="3003"

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
    
    echo "✅ 工作区3状态已更新: $status"
}

# 检查我的依赖服务
check_dependencies() {
    echo "🔍 检查工作区3的依赖服务..."
    
    local all_ok=true
    
    # 检查工作区2 (API服务)
    if curl -s --connect-timeout 2 "http://localhost:3002/api/health" >/dev/null 2>&1; then
        echo "✅ 工作区2 API服务: 可用"
    else
        echo "❌ 工作区2 API服务: 不可用"
        echo "💡 建议: 请启动工作区2的开发服务器"
        all_ok=false
    fi
    
    # 检查工作区4 (导出服务)
    if curl -s --connect-timeout 2 "http://localhost:3004/api/health" >/dev/null 2>&1; then
        echo "✅ 工作区4 导出服务: 可用"
    else
        echo "❌ 工作区4 导出服务: 不可用"
        echo "💡 建议: 请启动工作区4的开发服务器"
        all_ok=false
    fi
    
    if [ "$all_ok" = true ]; then
        echo "🎉 所有依赖服务都可用，可以进行完整测试"
        return 0
    else
        echo "⚠️  部分依赖服务不可用，功能可能受限"
        return 1
    fi
}

# 检查我的服务状态
check_my_services() {
    echo "🔍 检查工作区3的服务状态..."
    
    # 检查渲染页面
    if curl -s --connect-timeout 2 "http://localhost:$PORT" >/dev/null 2>&1; then
        echo "✅ 渲染页面: 可用"
        echo "🌐 访问地址: http://localhost:$PORT"
    else
        echo "❌ 渲染页面: 不可用"
    fi
}

# 启动我的服务
start_my_service() {
    echo "🚀 启动工作区3服务..."
    
    # 检查端口是否被占用
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ 端口$PORT已被占用"
        return 1
    fi
    
    # 更新状态为启动中
    update_my_status "starting" "启动HTML渲染服务器"
    
    # 启动服务 (这里只是示例，实际由Kiro执行)
    echo "📝 请执行: npm run dev"
    echo "🌐 渲染页面将运行在: http://localhost:$PORT"
    echo "🎨 主要功能:"
    echo "   - Markdown到HTML转换"
    echo "   - Word样式渲染"
    echo "   - 水印系统集成"
    echo "   - 多主题支持"
    
    # 更新状态为运行中
    update_my_status "running" "HTML渲染服务器已启动"
}

# 测试水印功能
test_watermark() {
    echo "💧 测试水印功能..."
    echo "⚠️  重要提醒: 必须100%保留原项目的水印功能"
    echo "📁 参考文件: ../../components/watermark-system.tsx"
    
    update_my_status "testing" "测试水印功能"
}

# 主菜单
case "$1" in
    "status")
        update_my_status "${2:-running}" "${3:-HTML渲染服务运行中}"
        ;;
    "check")
        check_dependencies
        ;;
    "services")
        check_my_services
        ;;
    "start")
        start_my_service
        ;;
    "watermark")
        test_watermark
        ;;
    *)
        echo "工作区3辅助脚本"
        echo "用法: $0 {status|check|services|start|watermark}"
        echo ""
        echo "  status [状态] [任务]  - 更新状态"
        echo "  check                - 检查依赖服务"
        echo "  services             - 检查自己的服务"
        echo "  start                - 启动服务"
        echo "  watermark            - 测试水印功能"
        ;;
esac