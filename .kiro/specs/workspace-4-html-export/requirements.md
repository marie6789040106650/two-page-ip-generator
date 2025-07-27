# 工作区4: HTML导出和文档生成 - 需求规格

## 项目背景

### 原项目架构
- **导出功能**: 服务端转换，使用Puppeteer等工具
- **导出格式**: 主要支持PDF导出
- **处理方式**: 在服务器端渲染HTML并转换为文档
- **水印处理**: 服务端处理水印叠加

### 重构目标
将原项目的导出功能重构为**前端导出方案**，创建独立的导出工作区，专注于**HTML到文档的前端转换**，支持Word和PDF格式。

## 需求概述

创建独立的文档导出工作区，负责接收HTML内容和水印配置，在前端将其转换为Word和PDF格式的文档，并提供文件下载功能。

## 功能需求

### 需求1: HTML到Word导出

**用户故事**: 作为用户，我希望能够将渲染的HTML内容导出为Word文档，保持原有的格式和水印

#### 验收标准
1. WHEN 工作区3发送导出请求 THEN 系统应接收HTML内容和配置参数
2. WHEN 处理HTML内容时 THEN 系统应正确解析标题、段落、列表、表格等元素
3. WHEN 转换为Word格式时 THEN 文档应保持与HTML相同的样式和布局
4. WHEN 包含水印时 THEN 水印应正确嵌入到Word文档中

### 需求2: HTML到PDF导出

**用户故事**: 作为用户，我希望能够将渲染的HTML内容导出为PDF文档，保持高质量的显示效果

#### 验收标准
1. WHEN 接收到PDF导出请求 THEN 系统应使用前端PDF生成库处理
2. WHEN 转换HTML内容时 THEN 系统应保持文本的清晰度和可读性
3. WHEN 处理图片内容时 THEN 图片应保持原有的分辨率和质量
4. WHEN 添加水印时 THEN 水印应以适当的透明度叠加在内容上

### 需求3: 水印处理和保持

**用户故事**: 作为用户，我希望导出的文档中水印效果与预览时完全一致

#### 验收标准
1. WHEN 接收水印配置时 THEN 系统应支持所有原项目的水印参数
2. WHEN 处理文本水印时 THEN 透明度、旋转角度、位置应与预览一致
3. WHEN 处理重复水印时 THEN 间距和排列应与预览效果相同
4. WHEN 导出完成时 THEN 水印应在文档中永久保留，不可编辑

### 需求4: 批量导出功能

**用户故事**: 作为用户，我希望能够同时导出多种格式的文档，提高工作效率

#### 验收标准
1. WHEN 用户选择批量导出时 THEN 系统应支持同时生成Word和PDF
2. WHEN 处理批量请求时 THEN 系统应显示导出进度
3. WHEN 批量导出完成时 THEN 系统应提供打包下载功能
4. WHEN 某个格式导出失败时 THEN 不应影响其他格式的导出

### 需求5: 文件下载管理

**用户故事**: 作为用户，我希望导出的文件能够方便地下载和管理

#### 验收标准
1. WHEN 导出完成时 THEN 系统应自动触发文件下载
2. WHEN 生成文件名时 THEN 应包含文档标题和生成时间
3. WHEN 文件较大时 THEN 系统应显示下载进度
4. WHEN 下载失败时 THEN 系统应提供重新下载选项

## 技术需求

### 需求6: 前端导出引擎

**用户故事**: 作为系统，我需要在浏览器端完成文档转换，不依赖服务器端处理

#### 验收标准
1. WHEN 使用Word导出时 THEN 系统应使用docx.js库进行前端转换
2. WHEN 使用PDF导出时 THEN 系统应使用jsPDF和html2canvas进行转换
3. WHEN 处理复杂HTML时 THEN 系统应正确解析DOM结构
4. WHEN 转换完成时 THEN 生成的文件应符合标准格式规范

### 需求7: API接口设计

**用户故事**: 作为工作区3，我需要调用标准化的导出API接口

#### 验收标准
1. WHEN 调用Word导出API时 THEN 接口应为 `POST /api/export-word`
2. WHEN 调用PDF导出API时 THEN 接口应为 `POST /api/export-pdf`
3. WHEN 发送请求时 THEN 应包含HTML内容、水印配置、样式配置等参数
4. WHEN 导出成功时 THEN 应返回文件流供直接下载

### 需求8: 性能优化

**用户故事**: 作为用户，我希望导出过程快速高效，不会长时间等待

#### 验收标准
1. WHEN 导出Word文档时 THEN 处理时间应在5秒内完成
2. WHEN 导出PDF文档时 THEN 处理时间应在8秒内完成
3. WHEN 处理大量内容时 THEN 系统应分块处理，避免浏览器卡顿
4. WHEN 内存使用时 THEN 应及时释放临时对象，避免内存泄漏

### 需求9: 错误处理和恢复

**用户故事**: 作为用户，当导出失败时，我希望能够了解失败原因并重试

#### 验收标准
1. WHEN HTML解析失败时 THEN 系统应返回具体的错误信息
2. WHEN 文件生成失败时 THEN 系统应提供重试选项
3. WHEN 浏览器不支持某些功能时 THEN 系统应提供降级方案
4. WHEN 网络问题导致失败时 THEN 系统应支持离线导出

## 与原项目的主要区别

### 架构变化
- **原项目**: 服务端导出，使用Puppeteer等服务器端工具
- **新架构**: 前端导出，使用JavaScript库在浏览器中完成转换

### 技术栈变化
- **原项目**: Puppeteer + 服务器端HTML渲染
- **新技术**: docx.js + jsPDF + html2canvas + 前端处理

### 性能优势
- **原项目**: 需要服务器资源，处理能力有限
- **新方案**: 利用客户端资源，可并行处理多个导出任务

### 部署简化
- **原项目**: 需要在服务器安装Chrome等依赖
- **新方案**: 纯前端实现，部署更简单

## API接口规范

### POST /api/export-word

**请求格式**:
```json
{
  "html": "<h1>标题</h1><p>内容...</p>",
  "watermarkConfig": {
    "enabled": true,
    "text": "水印文本",
    "opacity": 0.1,
    "fontSize": 16,
    "color": "#cccccc",
    "rotation": -45,
    "position": "center",
    "repeat": true
  },
  "styleConfig": {
    "pageWidth": 794,
    "pageHeight": 1123,
    "margins": {
      "top": 96,
      "right": 96,
      "bottom": 96,
      "left": 96
    }
  },
  "metadata": {
    "title": "文档标题",
    "wordCount": 1200
  }
}
```

**响应**: 文件流 (application/vnd.openxmlformats-officedocument.wordprocessingml.document)

### POST /api/export-pdf

**请求格式**:
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
  "styleConfig": {
    "pageWidth": 794,
    "pageHeight": 1123
  },
  "metadata": {
    "title": "文档标题"
  }
}
```

**响应**: 文件流 (application/pdf)

### GET /api/health

**响应格式**:
```json
{
  "status": "healthy",
  "services": {
    "wordExport": "active",
    "pdfExport": "active",
    "watermarkProcessing": "active"
  },
  "capabilities": {
    "wordFormats": ["docx"],
    "pdfFormats": ["pdf"],
    "watermarkSupport": true,
    "batchExport": true
  }
}
```

## 支持的HTML元素

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

## 开发优先级

### P0 (必须实现)
- HTML到Word导出基础功能
- HTML到PDF导出基础功能
- 基础的水印处理

### P1 (重要功能)
- 完整的水印配置支持
- 错误处理和用户反馈
- 文件下载管理

### P2 (增强功能)
- 批量导出功能
- 性能优化
- 高级HTML元素支持

## 验收测试场景

### 场景1: Word导出流程
1. 工作区3发送Word导出请求
2. 系统解析HTML内容和配置
3. 使用docx.js生成Word文档
4. 添加水印并返回文件流
5. 用户成功下载Word文档

### 场景2: PDF导出流程
1. 工作区3发送PDF导出请求
2. 系统使用html2canvas转换HTML
3. 使用jsPDF生成PDF文档
4. 添加水印并返回文件流
5. 用户成功下载PDF文档

### 场景3: 水印保持测试
1. 在工作区3配置复杂的水印设置
2. 导出Word和PDF文档
3. 打开导出的文档
4. 验证水印效果与预览一致

### 场景4: 错误处理测试
1. 发送无效的HTML内容
2. 验证系统返回适当的错误信息
3. 模拟导出过程中的异常
4. 验证用户能够重试导出

## 参考资料

### 原项目文件参考
- 原项目的导出功能实现
- 水印处理的相关代码
- 文档格式和样式定义

### 技术文档
- docx.js 官方文档
- jsPDF 使用指南
- html2canvas API文档
- 工作区3的HTML输出格式

### 相关规范
- Microsoft Word文档格式规范
- PDF格式标准
- 水印嵌入技术规范