# 多工作区协作开发指南

## 🚀 快速开始

### 1. 项目初始化
```bash
# 克隆或创建项目目录
mkdir two-page-ip-generator
cd two-page-ip-generator

# 运行初始化脚本
bash scripts/setup-workspaces.sh

# 设置GitHub仓库
bash scripts/github-setup.sh
```

### 2. 开发环境准备
```bash
# 安装根目录依赖
npm install

# 同步共享资源
npm run sync
```

## 🔧 多工作区开发流程

### 工作区分配

#### 工作区1: UI复用和表单优化 (`workspace-1-ui-form`)
**开发者**: 前端UI专家
**主要任务**:
- 从原项目复制UI组件和样式
- 增强表单验证和用户体验
- 实现批量输入和关键词扩展功能

**开发步骤**:
```bash
# 1. 使用Kiro打开工作区1
cd workspace-1-ui-form

# 2. 安装依赖
npm install

# 3. 从原项目复制组件
# 复制 /Users/bypasser/d/出海/starlight-media-generator/components/
# 复制 /Users/bypasser/d/出海/starlight-media-generator/app/

# 4. 启动开发服务器
npm run dev

# 5. 开发和测试
# - 适配新的路由结构
# - 增强表单功能
# - 优化用户体验

# 6. 提交代码
git add .
git commit -m "feat: 完成UI组件复用和表单增强"
git push origin workspace-1-ui-form
```

#### 工作区2: API集成和内容生成 (`workspace-2-api-content`)
**开发者**: 后端API专家
**主要任务**:
- 保持原项目的内容生成逻辑
- 确保API返回Markdown格式
- 实现Banner图生成功能

**开发步骤**:
```bash
# 1. 使用Kiro打开工作区2
cd workspace-2-api-content

# 2. 安装依赖
npm install

# 3. 从原项目复制API逻辑
# 复制 /Users/bypasser/d/出海/starlight-media-generator/app/api/
# 复制相关服务和工具函数

# 4. 启动开发服务器
npm run dev

# 5. 开发和测试
# - 适配API响应格式
# - 确保Markdown输出
# - 测试内容生成功能

# 6. 提交代码
git add .
git commit -m "feat: 完成API集成和内容生成功能"
git push origin workspace-2-api-content
```

#### 工作区3: Markdown到HTML转换 (`workspace-3-markdown-html`)
**开发者**: 文档处理专家
**主要任务**:
- 实现高质量Markdown到HTML转换
- 应用Word样式的HTML格式
- 支持复杂文档结构

**开发步骤**:
```bash
# 1. 使用Kiro打开工作区3
cd workspace-3-markdown-html

# 2. 安装依赖
npm install
npm install marked @types/marked

# 3. 开发转换器
# - 创建Markdown解析器
# - 实现Word样式应用
# - 创建HTML模板引擎

# 4. 启动开发服务器
npm run dev

# 5. 开发和测试
# - 测试转换准确性
# - 验证样式应用
# - 性能优化

# 6. 提交代码
git add .
git commit -m "feat: 完成Markdown到HTML转换功能"
git push origin workspace-3-markdown-html
```

#### 工作区4: 导出系统和部署 (`workspace-4-export-deploy`)
**开发者**: 全栈部署专家
**主要任务**:
- 实现浏览器端HTML到Word/PDF转换
- 配置Vercel部署和CI/CD
- 优化导出性能

**开发步骤**:
```bash
# 1. 使用Kiro打开工作区4
cd workspace-4-export-deploy

# 2. 安装依赖
npm install
npm install html-docx-js jspdf file-saver

# 3. 开发导出功能
# - 实现HTML到Word转换
# - 实现HTML到PDF转换
# - 创建导出UI组件

# 4. 配置部署
# - 设置vercel.json
# - 配置GitHub Actions
# - 环境变量管理

# 5. 启动开发服务器
npm run dev

# 6. 开发和测试
# - 测试导出功能
# - 验证部署配置
# - 性能测试

# 7. 提交代码
git add .
git commit -m "feat: 完成导出系统和部署配置"
git push origin workspace-4-export-deploy
```

## 🔄 协作和同步

### 定期同步共享资源
```bash
# 在项目根目录运行
npm run sync
```

### 跨工作区依赖管理
当一个工作区需要另一个工作区的功能时：

1. **定义接口**: 在 `shared/types/` 中定义共享接口
2. **创建Mock**: 在开发阶段创建Mock实现
3. **集成测试**: 在integration分支进行真实集成

### 代码审查流程
1. 每个工作区完成开发后创建PR
2. 其他工作区开发者进行代码审查
3. 审查通过后合并到对应分支

## 🔀 集成和合并

### 阶段性合并
```bash
# 1. 在项目根目录运行合并脚本
bash scripts/merge-workspaces.sh

# 2. 进入集成项目进行测试
cd integration/merged-project
npm install
npm run dev

# 3. 测试所有功能
# - 表单填写功能
# - 内容生成功能
# - Markdown转换功能
# - 导出功能

# 4. 修复集成问题
# 如有问题，返回对应工作区修复

# 5. 推送到develop分支
git add .
git commit -m "feat: 集成所有工作区功能"
git push origin develop
```

### 最终合并到主项目
```bash
# 1. 将集成项目复制到主项目
cp -r integration/merged-project/* main-project/

# 2. 在主项目中测试
cd main-project
npm install
npm run build
npm run dev

# 3. 推送到GitHub
git add .
git commit -m "feat: 完整的两页面IP生成器项目"
git push origin develop

# 4. 创建PR到main分支进行生产部署
```

## 🚀 部署流程

### 自动部署
- **develop分支**: 自动部署到Vercel预览环境
- **main分支**: 自动部署到Vercel生产环境

### 手动部署
```bash
# 1. 安装Vercel CLI
npm install -g vercel

# 2. 登录Vercel
vercel login

# 3. 部署到预览环境
vercel

# 4. 部署到生产环境
vercel --prod
```

## 📊 质量保证

### 代码规范
- 使用ESLint和Prettier
- TypeScript严格模式
- 统一的代码风格

### 测试策略
- 单元测试: 每个工具函数
- 集成测试: API和组件交互
- E2E测试: 完整用户流程

### 性能监控
- 页面加载时间 < 3秒
- 内容生成时间 < 10秒
- 导出处理时间 < 30秒

## 🐛 问题排查

### 常见问题

#### 1. 工作区依赖冲突
```bash
# 删除node_modules重新安装
rm -rf node_modules package-lock.json
npm install
```

#### 2. 共享资源同步失败
```bash
# 手动同步
npm run sync
```

#### 3. 合并冲突
```bash
# 使用集成分支解决冲突
git checkout integration
git merge workspace-1-ui-form
# 解决冲突后提交
```

#### 4. 部署失败
- 检查环境变量配置
- 验证vercel.json配置
- 查看构建日志

## 📞 支持和帮助

### 联系方式
- **技术负责人**: Kiro AI Assistant
- **项目文档**: docs/
- **问题反馈**: GitHub Issues

### 开发资源
- [Next.js文档](https://nextjs.org/docs)
- [TypeScript文档](https://www.typescriptlang.org/docs)
- [Tailwind CSS文档](https://tailwindcss.com/docs)
- [Vercel部署文档](https://vercel.com/docs)

---

**祝开发愉快！** 🎉