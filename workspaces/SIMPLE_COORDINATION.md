# 🤝 工作区简单协调指南

## 🎯 核心原则
每个工作区的Kiro只需要知道：
1. **自己的端口号**
2. **如何检查状态**
3. **如何更新状态**

## 📋 每个工作区的基本操作

### 启动时执行：
```bash
# 1. 检查整体状态
../workspace-status.sh

# 2. 启动我的服务
./workspace-helper.sh start
```

### 开发过程中：
```bash
# 状态变更时
./workspace-helper.sh status "running" "当前任务描述"

# 遇到问题时
./workspace-helper.sh check
```

## 🔧 工具说明

### 全局工具 (在workspaces目录)
- `workspace-status.sh` - 查看所有工作区状态
- `check-ports.sh` - 检查端口占用情况

### 工作区专用工具 (在各工作区目录)
- `workspace-helper.sh start` - 启动服务
- `workspace-helper.sh check` - 检查依赖
- `workspace-helper.sh status` - 更新状态

## 📊 端口分配
- 工作区1: 3001 (表单页面)
- 工作区2: 3002 (API服务)
- 工作区3: 3003 (渲染页面)
- 工作区4: 3004 (导出服务)

## 🚨 遇到问题时
1. 运行 `../workspace-status.sh` 查看整体状态
2. 运行 `./workspace-helper.sh check` 检查依赖
3. 如果无法解决，请求人工协调

---
**保持简单，专注开发！**