# 工作区1开发指南

## 📚 文档索引

### 在本工作区目录中：
- **README.md** - 快速上手指南
- **requirements.md** - 详细需求规格
- **WORKSPACE_SPEC.md** - 工作区规格说明
- **DEVELOPMENT_GUIDE.md** - 本文件

### 相关参考文档：
- **原项目参考**:
  - `../../app/generate/page.tsx` - 原表单页面
  - `../../app/generate/generate-page-content.tsx` - 原表单组件
  - `../../components/bulk-input-section.tsx` - 原批量输入组件

- **全局文档**:
  - `../../.kiro/specs/REFACTORING_OVERVIEW.md` - 重构总体说明
  - `../WORKSPACE_COORDINATION.md` - 工作区协调指南

## 🎯 开发重点

### 与原项目的关系
- **复用**: 从 `app/generate/` 复用表单功能
- **增强**: 添加自动保存、批量输入、进度提示
- **升级**: 使用现代化的技术栈

### 关键接口
- **调用工作区2**: `http://localhost:3002/api/generate-content`
- **跳转工作区3**: `http://localhost:3003?content=<encoded-markdown>`

## 🚀 开发流程
1. 查看 `requirements.md` 了解详细需求
2. 参考原项目的表单实现
3. 使用现代技术栈重新实现
4. 确保与工作区2的API对接正确
5. 测试完整的用户流程

## 🧪 测试重点
- 表单验证功能
- 自动保存和恢复
- 与工作区2的API通信
- 响应式设计适配