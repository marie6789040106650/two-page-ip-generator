# 多工作区协调开发指南

## 🎯 总体架构

本项目采用4个并行工作区的协作开发模式，每个工作区专注于特定功能领域：

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   工作区1       │    │   工作区2       │    │   工作区3       │    │   工作区4       │
│  UI复用和表单   │───▶│ API集成和内容   │───▶│ HTML渲染和样式  │───▶│ HTML导出和文档  │
│   优化          │    │   生成          │    │   系统          │    │   生成          │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
     Port: 3001             Port: 3002             Port: 3003             Port: 3004
```

## 🔄 数据流向

### 1. 用户输入流程
```
用户表单输入 → 工作区1 → 表单数据验证 → 工作区2
```

### 2. 内容生成流程
```
表单数据 → 工作区2 → AI内容生成 → Markdown内容 → 工作区3
```

### 3. 渲染显示流程
```
Markdown内容 → 工作区3 → HTML渲染 + 水印 → 工作区4
```

### 4. 导出流程
```
HTML内容 → 工作区4 → Word/PDF导出 → 用户下载
```

## 🚀 启动顺序

### 开发环境启动
```bash
# 1. 启动所有工作区
./scripts/start-all-workspaces.sh

# 2. 或者单独启动
cd workspaces/workspace-1-ui-form && npm run dev     # Port 3001
cd workspaces/workspace-2-api-content && npm run dev # Port 3002  
cd workspaces/workspace-3-html-rendering && npm run dev # Port 3003
cd workspaces/workspace-4-html-export && npm run dev # Port 3004
```

### 生产环境部署
```bash
# 构建所有工作区
./scripts/build-all-workspaces.sh

# 部署到不同服务器或容器
docker-compose up -d
```

## 🔗 工作区间通信

### API接口规范
```typescript
// 工作区1 → 工作区2
interface FormDataAPI {
  endpoint: 'POST /api/generate-content'
  payload: FormData
  response: { content: string, metadata: ContentMetadata }
}

// 工作区2 → 工作区3  
interface ContentRenderAPI {
  endpoint: 'POST /api/render-html'
  payload: { markdown: string, watermarkConfig: WatermarkConfig }
  response: { html: string, css: string }
}

// 工作区3 → 工作区4
interface ExportAPI {
  endpoint: 'POST /api/export'
  payload: { html: string, format: 'word' | 'pdf', settings: ExportSettings }
  response: { blob: Blob, filename: string }
}
```

### 事件总线
```typescript
// 全局事件管理
class WorkspaceEventBus {
  private static instance: WorkspaceEventBus
  private events: Map<string, Function[]> = new Map()
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new WorkspaceEventBus()
    }
    return this.instance
  }
  
  emit(event: string, data: any) {
    const handlers = this.events.get(event) || []
    handlers.forEach(handler => handler(data))
  }
  
  on(event: string, handler: Function) {
    const handlers = this.events.get(event) || []
    handlers.push(handler)
    this.events.set(event, handlers)
  }
}
```

## 📦 共享组件库

### 共享组件位置
```
shared/
├── components/           # 共享UI组件
│   ├── watermark-system.tsx
│   ├── progress-steps.tsx
│   └── common-ui.tsx
├── types/               # 共享类型定义
│   ├── form-types.ts
│   ├── content-types.ts
│   └── export-types.ts
├── utils/               # 共享工具函数
│   ├── validation.ts
│   ├── formatting.ts
│   └── api-client.ts
└── styles/              # 共享样式
    ├── variables.css
    ├── mixins.css
    └── common.css
```

### 组件同步机制
```bash
# 同步共享组件到各工作区
./scripts/sync-shared-components.sh

# 监听共享组件变更
./scripts/watch-shared-changes.sh
```

## 🧪 测试策略

### 单元测试
- 每个工作区独立进行单元测试
- 共享组件统一测试

### 集成测试
```bash
# 跨工作区集成测试
npm run test:integration

# 端到端测试
npm run test:e2e
```

### 测试数据管理
```typescript
// 测试数据工厂
export class TestDataFactory {
  static createFormData(): FormData {
    return {
      storeName: '测试店铺',
      storeCategory: '餐饮',
      storeLocation: '北京市',
      businessDuration: '3年',
      storeFeatures: '特色菜品',
      ownerName: '张三',
      ownerFeatures: '经验丰富'
    }
  }
  
  static createWatermarkConfig(): WatermarkConfig {
    return {
      enabled: true,
      text: '测试水印',
      opacity: 0.3,
      fontSize: 16,
      color: '#cccccc',
      rotation: -45
    }
  }
}
```

## 🔧 开发工具配置

### VSCode工作区配置
```json
// .vscode/workspace.code-workspace
{
  "folders": [
    { "name": "工作区1-UI表单", "path": "./workspaces/workspace-1-ui-form" },
    { "name": "工作区2-API内容", "path": "./workspaces/workspace-2-api-content" },
    { "name": "工作区3-HTML渲染", "path": "./workspaces/workspace-3-html-rendering" },
    { "name": "工作区4-HTML导出", "path": "./workspaces/workspace-4-html-export" },
    { "name": "共享组件", "path": "./shared" }
  ],
  "settings": {
    "typescript.preferences.includePackageJsonAutoImports": "on",
    "eslint.workingDirectories": [
      "workspaces/workspace-1-ui-form",
      "workspaces/workspace-2-api-content", 
      "workspaces/workspace-3-html-rendering",
      "workspaces/workspace-4-html-export"
    ]
  }
}
```

### Git工作流
```bash
# 功能分支命名规范
git checkout -b workspace-1/feature-bulk-input
git checkout -b workspace-2/feature-ai-integration
git checkout -b workspace-3/feature-watermark-rendering
git checkout -b workspace-4/feature-pdf-export

# 提交消息规范
git commit -m "workspace-1: 实现批量输入功能"
git commit -m "workspace-2: 集成AI内容生成"
git commit -m "workspace-3: 完善水印渲染"
git commit -m "workspace-4: 优化PDF导出"
```

## 📋 开发检查清单

### 开发前检查
- [ ] 确认工作区职责边界
- [ ] 检查接口定义是否一致
- [ ] 确认共享组件版本
- [ ] 设置开发环境

### 开发中检查
- [ ] 遵循工作区代码规范
- [ ] 及时同步共享组件变更
- [ ] 进行跨工作区接口测试
- [ ] 更新相关文档

### 开发后检查
- [ ] 完成单元测试
- [ ] 进行集成测试
- [ ] 更新API文档
- [ ] 提交代码审查

## 🚨 常见问题解决

### 端口冲突
```bash
# 检查端口占用
lsof -i :3001
lsof -i :3002
lsof -i :3003
lsof -i :3004

# 杀死占用进程
kill -9 <PID>
```

### 依赖冲突
```bash
# 清理node_modules
./scripts/clean-all-workspaces.sh

# 重新安装依赖
./scripts/install-all-dependencies.sh
```

### 接口不匹配
```bash
# 检查接口一致性
./scripts/check-interface-compatibility.sh

# 生成接口文档
./scripts/generate-api-docs.sh
```

---
**多工作区协调开发环境已准备就绪！** 🚀