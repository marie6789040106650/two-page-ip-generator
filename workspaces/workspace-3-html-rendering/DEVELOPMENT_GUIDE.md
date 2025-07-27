# 工作区3开发指南

## 📚 文档索引

### 在本工作区目录中：
- **README.md** - 快速上手指南
- **requirements.md** - 详细需求规格
- **WORKSPACE_SPEC.md** - 工作区规格说明
- **DEVELOPMENT_GUIDE.md** - 本文件

### 相关参考文档：
- **原项目参考**:
  - `../../app/display/page.tsx` - 原展示页面
  - `../../app/display/display-page-content.tsx` - 原展示组件
  - `../../components/watermark-system.tsx` - 原水印系统 ⭐ 重要
  - `../../components/word-style-renderer.tsx` - 原样式渲染器

- **全局文档**:
  - `../../.kiro/specs/REFACTORING_OVERVIEW.md` - 重构总体说明
  - `../WORKSPACE_COORDINATION.md` - 工作区协调指南

## 🎯 开发重点

### 与原项目的关系
- **复用**: 从 `app/display/` 复用展示功能
- **100%保留**: 完整保留 `components/watermark-system.tsx` 的所有功能
- **格式变更**: 从接收HTML改为接收Markdown
- **增强**: 添加多主题、实时预览、响应式设计

### 关键接口
- **接收工作区2**: 通过URL参数接收Markdown内容
- **调用工作区4**: `http://localhost:3004/api/export-word|pdf`

## 🚀 开发流程
1. 查看 `requirements.md` 了解详细需求
2. **重点**: 参考 `../../components/watermark-system.tsx` 确保100%功能保留
3. 实现Markdown到HTML的转换
4. 集成水印系统
5. 实现多主题支持
6. 确保与工作区4的导出集成

## 🧪 测试重点
- Markdown渲染功能
- **水印系统**: 所有配置参数和预览效果
- 主题切换功能
- 与工作区4的导出集成
- 响应式设计适配

## ⚠️ 特别注意
**水印系统是核心功能，必须100%保留原项目的所有功能！**