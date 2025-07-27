# 工作区3: HTML渲染和样式系统

## 🎯 工作区职责
负责HTML渲染和样式系统，从原项目的 `/display` 页面重构而来，专注于内容展示和水印系统的优化。

## 🔄 与原项目的关系
- **原功能**: `/display` 页面的展示功能 + 完整的水印系统
- **功能保留**: 100%保留原项目的水印配置、预览、管理功能
- **新增功能**: 多主题支持、实时预览、响应式设计
- **格式变更**: 从接收HTML改为接收Markdown并转换为HTML

## 🚀 快速开始
```bash
# 安装依赖
npm install

# 启动开发服务器 (端口3003)
npm run dev

# 访问地址
http://localhost:3003
```

## 📋 主要功能
- ✅ **Markdown渲染**: 将Markdown内容转换为Word样式的HTML
- ✅ **水印系统**: 完整保留原项目的水印功能
- ✅ **多主题支持**: 4种预设主题 + 自定义主题
- ✅ **实时预览**: 水印和样式的实时预览效果
- ✅ **Word样式**: 精确模拟Word文档的样式和布局
- ✅ **响应式设计**: 适配各种屏幕尺寸

## 🎨 主题系统
### 预设主题
- **默认主题**: 蓝色主调，Times New Roman字体
- **专业主题**: 深灰主调，Arial字体，适合商务文档
- **现代主题**: 紫色主调，Helvetica字体，适合创意文档
- **经典主题**: 红色主调，Georgia字体，适合传统文档

## 💧 水印系统
完整保留原项目的所有水印功能：
- **文本水印**: 自定义文本内容
- **透明度控制**: 0-1之间的透明度调节
- **旋转角度**: -90°到90°的旋转角度
- **位置设置**: 居中、四角等多种位置选择
- **重复模式**: 支持单个或重复水印
- **实时预览**: 配置变更立即生效

## 🔗 与其他工作区的集成
- **接收工作区2**: 接收Markdown内容进行渲染
- **调用工作区4**: 导出时调用工作区4的导出API

## 📁 项目结构
```
workspace-3-html-rendering/
├── components/
│   ├── renderers/         # 渲染组件
│   ├── watermark/         # 水印组件
│   ├── layout/            # 布局组件
│   └── styling/           # 样式组件
├── lib/                   # 核心库
├── themes/                # 主题配置
├── hooks/                 # 自定义Hook
└── types/                 # 类型定义
```

## 🛠️ 技术栈
- **框架**: Next.js 14 + React 18
- **语言**: TypeScript
- **Markdown**: remark + rehype
- **样式**: Styled Components + CSS-in-JS
- **水印**: Canvas API + SVG
- **动画**: Framer Motion

## 🎨 样式配置
```typescript
// Word样式配置示例
const wordStyleConfig = {
  pageWidth: 794,        // A4纸宽度
  pageHeight: 1123,      // A4纸高度
  margins: {
    top: 96,             // 2.54cm
    right: 96,
    bottom: 96,
    left: 96
  },
  headingStyles: {
    h1: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center'
    }
  }
}
```

## 📚 开发指南
1. 查看 `/.kiro/specs/workspace-3-html-rendering/requirements.md` 了解详细需求
2. 参考原项目的 `app/display/` 和 `components/watermark-system.tsx`
3. 确保水印功能与原项目100%兼容
4. 新增的主题功能应该与水印系统协调工作

## 🧪 测试
```bash
# 运行测试
npm test

# 测试渲染功能
# 访问 http://localhost:3003?content=<encoded-markdown>

# 测试主题切换
# 在页面上切换不同主题查看效果

# 测试水印功能
# 配置各种水印参数查看实时预览
```

## 🔧 水印配置示例
```typescript
const watermarkConfig = {
  enabled: true,
  text: '店铺IP生成器',
  opacity: 0.1,
  fontSize: 16,
  fontFamily: 'Arial, sans-serif',
  color: '#cccccc',
  rotation: -45,
  position: 'center',
  repeat: true,
  spacing: { x: 200, y: 150 }
}
```

---
**这是多工作区协作开发架构的渲染工作区，负责内容展示和水印系统，100%保留原项目功能。**