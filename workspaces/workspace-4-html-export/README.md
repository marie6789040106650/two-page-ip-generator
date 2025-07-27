# 工作区4: HTML导出和文档生成

## 🎯 工作区职责
负责HTML导出和文档生成，从原项目的服务端导出功能重构而来，专注于前端文档导出的实现。

## 🔄 与原项目的关系
- **原功能**: 服务端文档导出 (使用Puppeteer等)
- **技术变更**: 从服务端导出改为前端导出
- **格式支持**: Word (docx) + PDF 双格式支持
- **新增功能**: 批量导出、进度显示、前端处理

## 🚀 快速开始
```bash
# 安装依赖
npm install

# 启动开发服务器 (端口3004)
npm run dev

# 访问地址
http://localhost:3004
```

## 📋 主要功能
- ✅ **Word导出**: HTML到Word文档的前端转换
- ✅ **PDF导出**: HTML到PDF文档的前端转换
- ✅ **水印处理**: 保持水印在导出文档中的完整性
- ✅ **批量导出**: 同时导出多种格式
- ✅ **进度显示**: 导出过程的进度反馈
- ✅ **文件下载**: 自动触发文件下载

## 🔗 API接口
### POST /api/export-word
导出Word文档
```json
{
  "html": "<h1>标题</h1><p>内容...</p>",
  "watermarkConfig": {
    "enabled": true,
    "text": "水印文本",
    "opacity": 0.1,
    "fontSize": 16,
    "rotation": -45
  },
  "styleConfig": {
    "pageWidth": 794,
    "margins": { "top": 96, "right": 96, "bottom": 96, "left": 96 }
  },
  "metadata": {
    "title": "文档标题",
    "wordCount": 1200
  }
}
```

### POST /api/export-pdf
导出PDF文档
```json
{
  "html": "<h1>标题</h1><p>内容...</p>",
  "watermarkConfig": {
    "enabled": true,
    "text": "水印文本",
    "opacity": 0.1,
    "fontSize": 48,
    "rotation": -45
  },
  "metadata": {
    "title": "文档标题"
  }
}
```

### GET /api/health
服务健康检查

## 🔗 与其他工作区的集成
- **接收工作区3**: 接收HTML内容和配置参数
- **返回文件流**: 直接返回可下载的文档文件

## 📁 项目结构
```
workspace-4-html-export/
├── app/api/               # API路由
├── engines/               # 导出引擎
├── components/            # UI组件
├── lib/                   # 工具库
├── templates/             # 导出模板
└── types/                 # 类型定义
```

## 🛠️ 技术栈
- **框架**: Next.js 14 API Routes
- **语言**: TypeScript
- **Word导出**: docx.js + JSZip
- **PDF导出**: jsPDF + html2canvas
- **HTML解析**: Cheerio
- **文件处理**: FileSaver.js

## 📄 支持的HTML元素

### Word导出支持
- ✅ 标题 (H1-H6)
- ✅ 段落 (P)
- ✅ 列表 (UL, OL, LI)
- ✅ 表格 (TABLE, TR, TD, TH)
- ✅ 引用块 (BLOCKQUOTE)
- ✅ 分隔线 (HR)
- ✅ 文本格式 (STRONG, EM)
- ⚠️ 图片 (IMG) - 基础支持
- ❌ 复杂CSS样式

### PDF导出支持
- ✅ 标题 (H1-H6)
- ✅ 段落 (P)
- ✅ 列表 (UL, OL, LI)
- ✅ 引用块 (BLOCKQUOTE)
- ✅ 分隔线 (HR)
- ✅ 文本格式和颜色
- ✅ 图片 (IMG)
- ✅ 基础CSS样式
- ⚠️ 表格 - 简化支持

## 💧 水印处理
### Word文档水印
- 使用docx.js的水印功能 (简化实现)
- 支持文本水印的基本参数
- 在文档中永久嵌入

### PDF文档水印
- 使用Canvas API绘制水印
- 支持完整的水印配置参数
- 透明度、旋转、位置等完全支持

## 📚 开发指南
1. 查看 `/.kiro/specs/workspace-4-html-export/requirements.md` 了解详细需求
2. 参考原项目的导出功能了解业务需求
3. 确保导出的文档与预览效果一致
4. 重点关注水印在导出文档中的保持

## 🧪 测试
```bash
# 运行测试
npm test

# 测试Word导出API
curl -X POST http://localhost:3004/api/export-word \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1>测试</h1>","watermarkConfig":{"enabled":true,"text":"测试水印"}}'

# 测试PDF导出API
curl -X POST http://localhost:3004/api/export-pdf \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1>测试</h1>","watermarkConfig":{"enabled":true,"text":"测试水印"}}'

# 健康检查
curl http://localhost:3004/api/health
```

## ⚡ 性能指标
- **Word导出**: < 5秒 (标准文档)
- **PDF导出**: < 8秒 (标准文档)
- **内存使用**: < 200MB (单次导出)
- **并发支持**: 支持多个同时导出

## 🔧 导出配置
```typescript
// Word导出配置
const wordExportSettings = {
  filename: '店铺IP方案',
  margins: {
    top: 720,    // 0.5英寸 = 720 twips
    right: 720,
    bottom: 720,
    left: 720
  }
}

// PDF导出配置
const pdfExportSettings = {
  filename: '店铺IP方案',
  orientation: 'portrait',
  format: 'a4',
  scale: 2      // 高清模式
}
```

---
**这是多工作区协作开发架构的导出工作区，负责将HTML内容转换为可下载的文档文件。**