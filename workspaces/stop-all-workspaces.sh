#!/bin/bash

# 多工作区停止脚本
# 用于停止所有工作区的开发服务器

echo "🛑 停止所有工作区服务..."

# 定义工作区列表
WORKSPACES=(
    "workspace-1-ui-form"
    "workspace-2-api-content" 
    "workspace-3-html-rendering"
    "workspace-4-html-export"
)

# 停止单个工作区
stop_workspace() {
    local workspace=$1
    local pid_file="logs/${workspace}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        
        if kill -0 $pid 2>/dev/null; then
            echo "🔧 停止 $workspace (PID: $pid)..."
            kill $pid
            
            # 等待进程结束
            local count=0
            while kill -0 $pid 2>/dev/null && [ $count -lt 10 ]; do
                sleep 1
                count=$((count + 1))
            done
            
            # 如果进程仍在运行，强制杀死
            if kill -0 $pid 2>/dev/null; then
                echo "⚠️  强制停止 $workspace..."
                kill -9 $pid
            fi
            
            echo "✅ $workspace 已停止"
        else
            echo "⚠️  $workspace 进程不存在 (PID: $pid)"
        fi
        
        # 删除PID文件
        rm -f "$pid_file"
    else
        echo "⚠️  未找到 $workspace 的PID文件"
    fi
}

# 停止所有工作区
for workspace in "${WORKSPACES[@]}"; do
    stop_workspace "$workspace"
done

# 清理可能残留的Node.js进程
echo "🧹 清理残留进程..."

# 查找并杀死可能的残留进程
pkill -f "next dev -p 300[1-4]" 2>/dev/null || true
pkill -f "workspace-[1-4]" 2>/dev/null || true

# 检查端口占用
echo "🔍 检查端口占用情况..."
for port in 3001 3002 3003 3004; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  端口 $port 仍被占用"
        local pid=$(lsof -Pi :$port -sTCP:LISTEN -t)
        echo "   进程 PID: $pid"
        # 可选：自动杀死占用端口的进程
        # kill -9 $pid
    fi
done

echo ""
echo "✅ 所有工作区服务已停止"
echo "📝 日志文件保留在 ./logs/ 目录中"