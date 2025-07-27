# 工作区2开发指南

## 📚 文档索引

### 在本工作区目录中：
- **README.md** - 快速上手指南
- **requirements.md** - 详细需求规格
- **WORKSPACE_SPEC.md** - 工作区规格说明
- **DEVELOPMENT_GUIDE.md** - 本文件

### 相关参考文档：
- **原项目参考**:
  - `../../app/api/generate/route.ts` - 原API路由实现
  - AI服务调用的相关代码
  - 内容生成的模板和逻辑

- **全局文档**:
  - `../../.kiro/specs/REFACTORING_OVERVIEW.md` - 重构总体说明
  - `../WORKSPACE_COORDINATION.md` - 工作区协调指南

## 🎯 开发重点

### 与原项目的关系
- **复用**: 从 `app/api/generate/` 复用内容生成逻辑
- **格式变更**: 从返回HTML改为返回Markdown
- **增强**: 添加缓存、错误处理、健康检查

### 关键接口
- **接收工作区1**: `POST /api/generate-content`
- **服务工作区3**: 返回Markdown格式内容

## 🚀 开发流程
1. 查看 `requirements.md` 了解详细需求
2. 参考原项目的API实现
3. 实现Markdown格式输出
4. 添加缓存和错误处理机制
5. 确保与工作区1和工作区3的接口对接

## 🧪 测试重点
- API接口功能
- Markdown格式输出
- 缓存机制
- 错误处理和重试
- 与其他工作区的集成