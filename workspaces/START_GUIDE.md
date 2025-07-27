# 🚀 多工作区启动指南

## ✅ 环境检查完成
- Node.js: v22.17.0 ✅
- npm: 10.9.2 ✅
- 所有工作区依赖已安装 ✅

## 🎯 推荐启动方式

### 方式1: VSCode工作区 (最佳体验)
```bash
# 在workspaces目录下执行
code workspace.code-workspace
```

这会打开包含所有4个工作区的VSCode工作区，每个工作区都有独立的文件树。

### 方式2: 一键启动所有服务
```bash
# 在workspaces目录下执行
./start-all-workspaces.sh
```

这会同时启动所有4个工作区的开发服务器。

### 方式3: 单独启动测试
```bash
./test-workspace-1.sh  # 工作区1 - 表单 (端口3001)
./test-workspace-2.sh  # 工作区2 - API (端口3002)
./test-workspace-3.sh  # 工作区3 - 渲染 (端口3003)
./test-workspace-4.sh  # 工作区4 - 导出 (端口3004)
```

## 🌐 访问地址
- **工作区1 (表单)**: http://localhost:3001
- **工作区2 (API)**: http://localhost:3002
- **工作区3 (渲染)**: http://localhost:3003
- **工作区4 (导出)**: http://localhost:3004

## 🔄 完整测试流程
1. 访问 http://localhost:3001 填写店铺信息
2. 点击"生成方案"调用工作区2的API
3. 跳转到工作区3查看渲染效果
4. 调整水印和主题设置
5. 点击导出按钮调用工作区4生成文档

## 🛠️ VSCode工作区功能
- **自动化任务**: Ctrl+Shift+P → "Tasks: Run Task"
  - 启动所有工作区
  - 停止所有工作区  
  - 快速测试
- **多工作区文件树**: 每个工作区独立显示
- **统一配置**: ESLint、TypeScript、搜索设置
- **推荐扩展**: 自动提示安装相关扩展

---
**🎉 多工作区环境已完全准备就绪！选择你喜欢的方式开始开发吧！**