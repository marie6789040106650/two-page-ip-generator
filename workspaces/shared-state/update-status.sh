#!/bin/bash

# 安全的状态更新脚本
# 使用文件锁避免并发冲突

WORKSPACE_ID=$1
STATUS_DATA=$2
LOCK_DIR="./locks"
LOCK_FILE="$LOCK_DIR/status-update.lock"

# 创建锁目录
mkdir -p "$LOCK_DIR"

# 获取文件锁的函数
acquire_lock() {
    local timeout=10
    local count=0
    
    while [ $count -lt $timeout ]; do
        if mkdir "$LOCK_FILE" 2>/dev/null; then
            return 0
        fi
        sleep 0.5
        count=$((count + 1))
    done
    
    echo "❌ 无法获取文件锁，超时"
    return 1
}

# 释放文件锁
release_lock() {
    rmdir "$LOCK_FILE" 2>/dev/null
}

# 更新状态文件
update_status() {
    local workspace_id=$1
    local status_file="workspace-${workspace_id}-status.json"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    # 读取现有状态
    if [ -f "$status_file" ]; then
        local current_status=$(cat "$status_file")
    else
        local current_status="{}"
    fi
    
    # 更新时间戳
    echo "$current_status" | jq ".lastUpdate = \"$timestamp\"" > "$status_file.tmp"
    mv "$status_file.tmp" "$status_file"
    
    echo "✅ 状态已更新: $workspace_id"
}

# 主逻辑
if [ -z "$WORKSPACE_ID" ]; then
    echo "用法: $0 <workspace-id> [status-data]"
    echo "示例: $0 1 '{\"status\":\"running\"}'"
    exit 1
fi

# 获取锁
if acquire_lock; then
    # 在锁保护下更新状态
    update_status "$WORKSPACE_ID"
    
    # 释放锁
    release_lock
    
    echo "🔄 状态更新完成"
else
    echo "❌ 状态更新失败"
    exit 1
fi