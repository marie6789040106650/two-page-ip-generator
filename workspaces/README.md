# 多工作区协作开发环境

## 🎯 项目概述

本项目采用多工作区协作开发模式，将原有的两页面IP生成器重构为4个独立但协作的工作区，每个工作区专注于特定的功能领域，支持并行开发和独立部署。

## 🏗️ 工作区架构

```
two-page-ip-generator/
├── workspaces/
│   ├── workspace-1-ui-form/          # UI复用和表单优化
│   ├── workspace-2-api-content/      # API集成和内容生成  
│   ├── workspace-3-html-rendering/   # HTML渲染和样式系统
│   ├── workspace-4-html-export/      # HTML导出和文档生成
│   ├── WORKSPACE_COORDINATION.md     # 协调开发指南
│   ├── start-all-workspaces.sh       # 启动所有工作区
│   ├── stop-all-workspaces.sh        # 停止所有工作区
│   └── README.md                     # 本文件
├── shared/                           # 共享组件和资源
└── docs/                            # 项目文档
```

## 🚀 快速开始

### 1. 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0
- Git

### 2. 启动开发环境
```bash
# 启动所有工作区
./start-all-workspaces.sh

# 或者单独启动某个工作区
cd workspace-1-ui-form && npm run dev
```

### 3. 访问地址
- 工作区1 (UI表单): http://localhost:3001
- 工作区2 (API内容): http://localhost:3002
- 工作区3 (HTML渲染): http://localhost:3003
- 工作区4 (HTML导出): http://localhost:3004

### 4. 停止服务
```bash
./stop-all-workspaces.sh
```

## 📋 工作区详细说明

### 工作区1: UI复用和表单优化
- **端口**: 3001
- **职责**: 复用原项目UI组件，优化表单功能
- **核心功能**: 
  - 批量输入功能
  - 智能关键词扩展
  - 表单验证和自动保存
- **技术栈**: React + TypeScript + Tailwind CSS

### 工作区2: API集成和内容生成
- **端口**: 3002
- **职责**: 保持原项目内容生成逻辑，返回Markdown格式
- **核心功能**:
  - AI内容生成
  - Banner图片生成
  - 内容质量检查
- **技术栈**: Next.js API + OpenAI + Redis

### 工作区3: HTML渲染和样式系统
- **端口**: 3003
- **职责**: 将Markdown转换为Word样式的HTML，集成水印系统
- **核心功能**:
  - Markdown到HTML转换
  - Word样式模拟
  - 水印系统集成
- **技术栈**: React + remark + styled-components

### 工作区4: HTML导出和文档生成
- **端口**: 3004
- **职责**: 将HTML导出为Word和PDF格式
- **核心功能**:
  - HTML到Word导出
  - HTML到PDF导出
  - 批量导出功能
- **技术栈**: docx.js + jsPDF + html2canvas

## 🔄 数据流向

```
用户输入 → 工作区1 → 表单数据 → 工作区2 → Markdown内容 → 工作区3 → HTML内容 → 工作区4 → 导出文档
```

## 🛠️ 开发指南

### 代码规范
- 使用TypeScript严格模式
- 遵循ESLint和Prettier配置
- 组件必须有完整的类型定义
- 每个功能必须有对应的测试

### 提交规范
```bash
# 提交消息格式
git commit -m "workspace-[1-4]: 功能描述"

# 示例
git commit -m "workspace-1: 实现批量输入功能"
git commit -m "workspace-2: 优化AI内容生成"
```

### 分支管理
```bash
# 功能分支命名
workspace-1/feature-name
workspace-2/feature-name
workspace-3/feature-name
workspace-4/feature-name

# 示例
git checkout -b workspace-1/bulk-input-enhancement
git checkout -b workspace-2/ai-integration-optimization
```

## 🧪 测试策略

### 单元测试
```bash
# 运行所有工作区的单元测试
npm run test:all

# 运行特定工作区的测试
cd workspace-1-ui-form && npm test
```

### 集成测试
```bash
# 跨工作区集成测试
npm run test:integration

# 端到端测试
npm run test:e2e
```

## 📊 性能监控

### 开发环境监控
- 各工作区启动时间
- API响应时间
- 内存使用情况
- 构建时间

### 生产环境指标
- 页面加载时间 < 2秒
- API响应时间 < 5秒
- 导出功能完成时间 < 10秒
- 系统可用性 > 99.9%

## 🔧 故障排除

### 常见问题

#### 端口冲突
```bash
# 检查端口占用
lsof -i :3001
lsof -i :3002
lsof -i :3003
lsof -i :3004

# 杀死占用进程
kill -9 <PID>
```

#### 依赖问题
```bash
# 清理所有node_modules
find . -name "node_modules" -type d -exec rm -rf {} +

# 重新安装依赖
./start-all-workspaces.sh
```

#### 接口不匹配
```bash
# 检查接口定义
grep -r "interface.*API" workspaces/

# 验证API连通性
curl http://localhost:3002/api/health
```

## 📚 相关文档

- [工作区协调开发指南](./WORKSPACE_COORDINATION.md)
- [工作区1规格说明](./workspace-1-ui-form/WORKSPACE_SPEC.md)
- [工作区2规格说明](./workspace-2-api-content/WORKSPACE_SPEC.md)
- [工作区3规格说明](./workspace-3-html-rendering/WORKSPACE_SPEC.md)
- [工作区4规格说明](./workspace-4-html-export/WORKSPACE_SPEC.md)

## 🤝 贡献指南

### 开发流程
1. 选择负责的工作区
2. 创建功能分支
3. 实现功能并编写测试
4. 提交代码审查
5. 合并到主分支

### 代码审查
- 每个工作区至少需要1人审查
- 跨工作区接口变更需要相关工作区确认
- 共享组件变更需要所有工作区确认

## 📞 技术支持

### 联系方式
- 工作区1负责人: 前端UI专家
- 工作区2负责人: 后端API专家  
- 工作区3负责人: 前端渲染专家
- 工作区4负责人: 前端导出专家

### 支持时间
- 工作日: 9:00-18:00
- 紧急问题: 7x24小时

---

**多工作区协作开发环境已准备就绪，开始你的开发之旅吧！** 🚀