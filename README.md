# 老板IP打造方案生成器

一个专业的两页面老板IP打造方案生成工具，帮助用户快速生成个性化的IP打造方案。

## 🌟 功能特性

- **两页面架构**: 清晰分离信息填写和方案生成页面
- **响应式设计**: 完美适配移动端和桌面端
- **数据持久化**: 支持表单数据的自动保存和恢复
- **性能优化**: 代码分割、懒加载、图片优化等
- **SEO友好**: 完整的元数据、结构化数据和sitemap
- **无障碍访问**: 符合WCAG标准的可访问性设计
- **TypeScript**: 完整的类型安全支持

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- pnpm 包管理器

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd two-page-ip-generator

# 安装依赖
pnpm install

# 复制环境变量文件
cp .env.example .env.local

# 启动开发服务器
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
two-page-ip-generator/
├── app/                    # Next.js App Router 页面
│   ├── generate/          # 方案生成页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 信息填写页面
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   ├── form-section.tsx  # 表单组件
│   ├── page-header.tsx   # 页面头部
│   └── ...
├── lib/                  # 工具库
│   ├── types.ts         # 类型定义
│   ├── constants.ts     # 常量
│   ├── utils.ts         # 工具函数
│   ├── seo.ts           # SEO 工具
│   ├── accessibility.ts # 无障碍工具
│   └── performance.ts   # 性能监控
├── hooks/               # 自定义 Hooks
├── context/             # React Context
├── __tests__/           # 测试文件
└── scripts/             # 部署脚本
```

## 🛠️ 开发命令

```bash
# 开发
pnpm dev              # 启动开发服务器
pnpm build           # 构建生产版本
pnpm start           # 启动生产服务器

# 代码质量
pnpm lint            # 运行 ESLint
pnpm lint:fix        # 自动修复 lint 问题
pnpm type-check      # TypeScript 类型检查

# 测试
pnpm test            # 运行测试
pnpm test:run        # 运行测试（CI 模式）
pnpm test:ui         # 运行测试 UI

# 构建分析
pnpm build:analyze   # 分析打包大小
pnpm build:production # 生产环境构建

# 清理
pnpm clean           # 清理构建文件
```

## 🏗️ 技术栈

- **框架**: Next.js 15 with App Router
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: Radix UI + Shadcn/ui
- **状态管理**: React Context + URL参数 + localStorage
- **测试**: Vitest + Testing Library
- **构建工具**: Next.js 内置构建系统
- **部署**: Docker + 静态部署

## 📱 页面说明

### 信息填写页面 (`/`)

用户填写店铺和老板信息的页面，包含：

- 店铺基本信息（名称、品类、位置等）
- 老板个人信息（姓名、特色等）
- 关键词扩展功能
- 模型选择功能
- 表单验证和错误提示

### 方案生成页面 (`/generate`)

显示生成方案的页面，包含：

- 操作栏（修改信息、重新生成、导出）
- Banner 占位符区域
- 内容占位符区域
- 返回修改功能

## 🔧 配置说明

### 环境变量

```bash
# 应用基础URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 环境
NODE_ENV=development

# 性能监控
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true

# 打包分析
ANALYZE=false
```

### Next.js 配置

项目使用了以下 Next.js 优化配置：

- 代码分割和懒加载
- 图片优化
- 静态资源缓存
- 生产环境优化
- Bundle 分析

## 🚀 部署

### Docker 部署

```bash
# 构建镜像
docker build -t two-page-ip-generator .

# 运行容器
docker run -p 3000:3000 two-page-ip-generator
```

### 使用部署脚本

```bash
# 本地部署
./scripts/deploy.sh local

# 生产部署
./scripts/deploy.sh production
```

### Vercel 部署

项目已配置好 Vercel 部署，只需：

1. 连接 GitHub 仓库到 Vercel
2. 设置环境变量
3. 自动部署

## 🧪 测试

项目包含完整的测试套件：

- **单元测试**: 组件和工具函数测试
- **集成测试**: 页面交互和数据流测试
- **端到端测试**: 完整用户流程测试

```bash
# 运行所有测试
pnpm test

# 运行特定测试
pnpm test -- form-section

# 查看测试覆盖率
pnpm test -- --coverage
```

## 📊 性能优化

项目实施了多项性能优化：

- **代码分割**: 按页面和组件分割代码
- **懒加载**: 非关键组件延迟加载
- **图片优化**: Next.js Image 组件优化
- **缓存策略**: 静态资源长期缓存
- **Bundle 优化**: 第三方库优化打包
- **Web Vitals**: 核心性能指标监控

## ♿ 无障碍访问

项目遵循 WCAG 2.1 AA 标准：

- **键盘导航**: 完整的键盘操作支持
- **屏幕阅读器**: ARIA 标签和语义化HTML
- **对比度**: 符合标准的颜色对比度
- **焦点管理**: 清晰的焦点指示器
- **减少动画**: 支持用户的动画偏好设置

## 🔍 SEO 优化

- **元数据**: 完整的页面元数据
- **结构化数据**: Schema.org 标准
- **Sitemap**: 自动生成站点地图
- **Robots.txt**: 搜索引擎爬虫配置
- **Open Graph**: 社交媒体分享优化

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 故障排除

### 常见问题

**Q: 页面刷新后数据丢失？**
A: 检查浏览器是否禁用了 localStorage，或清除浏览器缓存后重试。

**Q: 构建失败？**
A: 确保 Node.js 版本 >= 18，删除 `node_modules` 和 `package-lock.json` 后重新安装。

**Q: 样式不生效？**
A: 检查 Tailwind CSS 配置，确保所有样式类都被正确编译。

### 调试模式

```bash
# 启用详细日志
DEBUG=* pnpm dev

# 启用性能监控
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true pnpm dev
```

## 📞 支持

如有问题或建议，请：

1. 查看 [FAQ](docs/FAQ.md)
2. 搜索现有 [Issues](../../issues)
3. 创建新的 [Issue](../../issues/new)

---

**Made with ❤️ by IP Generator Team**