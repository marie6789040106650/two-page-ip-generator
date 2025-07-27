#!/bin/bash

# 多工作区启动脚本
# 用于同时启动所有4个工作区的开发服务器

echo "🚀 启动多工作区协作开发环境..."

# 检查Node.js和npm
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

# 创建日志目录
mkdir -p logs

# 定义工作区配置
declare -A WORKSPACES=(
    ["workspace-1-ui-form"]="3001"
    ["workspace-2-api-content"]="3002" 
    ["workspace-3-html-rendering"]="3003"
    ["workspace-4-html-export"]="3004"
)

# 检查端口是否被占用
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  端口 $port 已被占用"
        return 1
    fi
    return 0
}

# 安装依赖
install_dependencies() {
    local workspace=$1
    echo "📦 安装 $workspace 依赖..."
    
    if [ ! -d "$workspace" ]; then
        echo "❌ 工作区目录 $workspace 不存在"
        return 1
    fi
    
    cd "$workspace"
    
    if [ ! -f "package.json" ]; then
        echo "⚠️  $workspace 中没有 package.json，跳过依赖安装"
        cd ..
        return 0
    fi
    
    npm install --silent
    if [ $? -ne 0 ]; then
        echo "❌ $workspace 依赖安装失败"
        cd ..
        return 1
    fi
    
    cd ..
    echo "✅ $workspace 依赖安装完成"
    return 0
}

# 启动工作区
start_workspace() {
    local workspace=$1
    local port=$2
    
    echo "🔧 启动 $workspace (端口: $port)..."
    
    cd "$workspace"
    
    # 检查是否有启动脚本
    if ! npm run --silent 2>/dev/null | grep -q "dev"; then
        echo "⚠️  $workspace 中没有 dev 脚本，跳过启动"
        cd ..
        return 0
    fi
    
    # 后台启动并记录日志
    nohup npm run dev > "../logs/${workspace}.log" 2>&1 &
    local pid=$!
    
    echo "$pid" > "../logs/${workspace}.pid"
    
    cd ..
    
    # 等待服务启动
    echo "⏳ 等待 $workspace 启动..."
    sleep 3
    
    # 检查服务是否启动成功
    if kill -0 $pid 2>/dev/null; then
        echo "✅ $workspace 启动成功 (PID: $pid, 端口: $port)"
        return 0
    else
        echo "❌ $workspace 启动失败"
        return 1
    fi
}

# 主启动流程
main() {
    echo "📋 检查工作区环境..."
    
    # 检查所有端口
    for workspace in "${!WORKSPACES[@]}"; do
        port=${WORKSPACES[$workspace]}
        if ! check_port $port; then
            echo "❌ 端口检查失败，请释放端口 $port 后重试"
            exit 1
        fi
    done
    
    echo "✅ 端口检查通过"
    
    # 安装所有依赖
    echo "📦 安装工作区依赖..."
    for workspace in "${!WORKSPACES[@]}"; do
        if ! install_dependencies "$workspace"; then
            echo "❌ 依赖安装失败，退出启动"
            exit 1
        fi
    done
    
    echo "✅ 所有依赖安装完成"
    
    # 启动所有工作区
    echo "🚀 启动所有工作区..."
    local failed_workspaces=()
    
    for workspace in "${!WORKSPACES[@]}"; do
        port=${WORKSPACES[$workspace]}
        if ! start_workspace "$workspace" "$port"; then
            failed_workspaces+=("$workspace")
        fi
    done
    
    # 检查启动结果
    if [ ${#failed_workspaces[@]} -eq 0 ]; then
        echo ""
        echo "🎉 所有工作区启动成功！"
        echo ""
        echo "📊 工作区访问地址："
        for workspace in "${!WORKSPACES[@]}"; do
            port=${WORKSPACES[$workspace]}
            echo "   $workspace: http://localhost:$port"
        done
        echo ""
        echo "📝 日志文件位置: ./logs/"
        echo "🛑 停止所有服务: ./stop-all-workspaces.sh"
        echo ""
    else
        echo ""
        echo "⚠️  部分工作区启动失败："
        for workspace in "${failed_workspaces[@]}"; do
            echo "   ❌ $workspace"
        done
        echo ""
        echo "📝 请检查日志文件: ./logs/"
    fi
}

# 信号处理
cleanup() {
    echo ""
    echo "🛑 收到停止信号，正在关闭所有工作区..."
    ./stop-all-workspaces.sh
    exit 0
}

trap cleanup SIGINT SIGTERM

# 执行主流程
main

# 保持脚本运行
echo "💡 按 Ctrl+C 停止所有服务"
while true; do
    sleep 1
done