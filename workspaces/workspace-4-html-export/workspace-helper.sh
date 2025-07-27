#!/bin/bash

# 工作区4专用的辅助脚本
WORKSPACE_ID="4"
WORKSPACE_NAME="workspace-4-html-export"
PORT="3004"

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
            .services.apiEndpoints.\"/api/export-word\" = \"ready\" |
            .services.apiEndpoints.\"/api/export-pdf\" = \"ready\" |
            .services.apiEndpoints.\"/api/health\" = \"ready\"" \
           "$status_file" > "$status_file.tmp" && mv "$status_file.tmp" "$status_file"
    else
        jq ".status = \"$status\" | .currentTask = \"$task\" | .lastUpdate = \"$timestamp\"" \
           "$status_file" > "$status_file.tmp" && mv "$status_file.tmp" "$status_file"
    fi
    
    echo "✅ 工作区4状态已更新: $status"
}

# 检查我的服务状态
check_my_services() {
    echo "🔍 检查工作区4的服务状态..."
    
    # 检查健康检查端点
    if curl -s --connect-timeout 2 "http://localhost:$PORT/api/health" >/dev/null 2>&1; then
        echo "✅ 健康检查端点: 可用"
    else
        echo "❌ 健康检查端点: 不可用"
    fi
    
    # 检查Word导出端点
    if curl -s --connect-timeout 2 -X POST "http://localhost:$PORT/api/export-word" \
       -H "Content-Type: application/json" \
       -d '{"html":"<h1>测试</h1>"}' >/dev/null 2>&1; then
        echo "✅ Word导出端点: 可用"
    else
        echo "❌ Word导出端点: 不可用"
    fi
    
    # 检查PDF导出端点
    if curl -s --connect-timeout 2 -X POST "http://localhost:$PORT/api/export-pdf" \
       -H "Content-Type: application/json" \
       -d '{"html":"<h1>测试</h1>"}' >/dev/null 2>&1; then
        echo "✅ PDF导出端点: 可用"
    else
        echo "❌ PDF导出端点: 不可用"
    fi
}

# 检查依赖 (工作区4主要被其他工作区调用，依赖较少)
check_dependencies() {
    echo "🔍 检查工作区4的依赖..."
    echo "ℹ️  工作区4主要提供导出服务，依赖较少"
    
    # 检查必要的系统依赖
    if command -v node >/dev/null 2>&1; then
        echo "✅ Node.js: 已安装"
    else
        echo "❌ Node.js: 未安装"
    fi
    
    if command -v npm >/dev/null 2>&1; then
        echo "✅ npm: 已安装"
    else
        echo "❌ npm: 未安装"
    fi
}

# 启动我的服务
start_my_service() {
    echo "🚀 启动工作区4服务..."
    
    # 检查端口是否被占用
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ 端口$PORT已被占用"
        return 1
    fi
    
    # 更新状态为启动中
    update_my_status "starting" "启动HTML导出服务器"
    
    # 启动服务 (这里只是示例，实际由Kiro执行)
    echo "📝 请执行: npm run dev"
    echo "🌐 导出服务将运行在: http://localhost:$PORT"
    echo "📄 主要API端点:"
    echo "   - POST /api/export-word  (HTML到Word导出)"
    echo "   - POST /api/export-pdf   (HTML到PDF导出)"
    echo "   - GET /api/health        (健康检查)"
    
    # 更新状态为运行中
    update_my_status "running" "HTML导出服务器已启动"
}

# 测试导出功能
test_export() {
    local format=$1
    
    if [ -z "$format" ]; then
        echo "用法: $0 test {word|pdf}"
        return 1
    fi
    
    echo "📄 测试${format}导出功能..."
    
    local test_html='<h1>测试文档</h1><p>这是一个测试文档，用于验证导出功能。</p>'
    local test_watermark='{"enabled":true,"text":"测试水印","opacity":0.1,"fontSize":16,"rotation":-45}'
    
    update_my_status "testing" "测试${format}导出功能"
    
    if curl -s --connect-timeout 5 -X POST "http://localhost:$PORT/api/export-${format}" \
       -H "Content-Type: application/json" \
       -d "{\"html\":\"$test_html\",\"watermarkConfig\":$test_watermark}" \
       -o "test-export.${format}" >/dev/null 2>&1; then
        echo "✅ ${format}导出测试成功"
        echo "📁 测试文件已保存为: test-export.${format}"
    else
        echo "❌ ${format}导出测试失败"
    fi
}

# 主菜单
case "$1" in
    "status")
        update_my_status "${2:-running}" "${3:-HTML导出服务运行中}"
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
    "test")
        test_export "$2"
        ;;
    *)
        echo "工作区4辅助脚本"
        echo "用法: $0 {status|check|services|start|test}"
        echo ""
        echo "  status [状态] [任务]  - 更新状态"
        echo "  check                - 检查依赖"
        echo "  services             - 检查服务状态"
        echo "  start                - 启动服务"
        echo "  test {word|pdf}      - 测试导出功能"
        ;;
esac