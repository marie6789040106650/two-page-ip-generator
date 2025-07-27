# 工作区4: HTML导出和文档生成 - 详细规格说明

## 🎯 工作区职责
本工作区负责将HTML内容导出为Word和PDF格式，实现前端导出功能，替代原项目的服务端转换方案。

## 📋 核心任务清单

### 1. 前端导出引擎 (优先级: 高)
- [ ] 实现HTML到Word的前端转换
- [ ] 实现HTML到PDF的前端转换
- [ ] 保持水印在导出文档中的完整性
- [ ] 优化导出文件的质量和格式

### 2. 导出功能优化 (优先级: 高)
- [ ] 实现批量导出功能
- [ ] 添加导出进度指示
- [ ] 支持自定义导出设置
- [ ] 实现导出历史管理

### 3. 文档质量控制 (优先级: 中)
- [ ] 确保导出文档的格式一致性
- [ ] 实现文档预览功能
- [ ] 添加导出质量检查
- [ ] 支持多种导出模板

## 🏗️ 技术架构

### 组件结构
```
workspace-4-html-export/
├── components/
│   ├── exporters/                   # 导出组件
│   │   ├── html-to-word-exporter.tsx
│   │   ├── html-to-pdf-exporter.tsx
│   │   ├── batch-exporter.tsx
│   │   └── export-manager.tsx
│   ├── ui/                          # UI组件
│   │   ├── export-button.tsx
│   │   ├── export-progress.tsx
│   │   ├── export-settings.tsx
│   │   └── export-preview.tsx
│   ├── templates/                   # 导出模板
│   │   ├── word-template.tsx
│   │   ├── pdf-template.tsx
│   │   └── template-selector.tsx
│   └── quality/                     # 质量控制
│       ├── format-validator.tsx
│       ├── content-checker.tsx
│       └── export-optimizer.tsx
├── lib/                            # 核心库
│   ├── word-generator.ts
│   ├── pdf-generator.ts
│   ├── html-processor.ts
│   ├── watermark-preserver.ts
│   └── export-utils.ts
├── engines/                        # 导出引擎
│   ├── docx-engine.ts
│   ├── pdf-engine.ts
│   ├── html-parser.ts
│   └── style-converter.ts
├── templates/                      # 导出模板
│   ├── word-templates/
│   │   ├── professional.json
│   │   ├── modern.json
│   │   └── classic.json
│   └── pdf-templates/
│       ├── standard.json
│       ├── compact.json
│       └── detailed.json
├── hooks/                          # 自定义Hook
│   ├── use-export-manager.ts
│   ├── use-word-exporter.ts
│   ├── use-pdf-exporter.ts
│   └── use-export-progress.ts
└── types/                          # 类型定义
    ├── export-types.ts
    ├── template-types.ts
    ├── engine-types.ts
    └── quality-types.ts
```

### 技术栈
- **Word导出**: docx.js + JSZip
- **PDF导出**: jsPDF + html2canvas
- **HTML处理**: DOMParser + CSS解析
- **文件下载**: FileSaver.js
- **进度管理**: 自定义Progress API
- **模板系统**: JSON配置 + 动态渲染
## 📦 核心功
能实现

### 1. HTML到Word导出器
```typescript
// components/exporters/html-to-word-exporter.tsx
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import { saveAs } from 'file-saver'

interface HTMLToWordExporterProps {
  htmlContent: string
  watermarkConfig: WatermarkConfig
  exportSettings: WordExportSettings
  onProgress?: (progress: number) => void
  onComplete?: (blob: Blob) => void
  onError?: (error: Error) => void
}

export function HTMLToWordExporter({
  htmlContent,
  watermarkConfig,
  exportSettings,
  onProgress,
  onComplete,
  onError
}: HTMLToWordExporterProps) {
  const [isExporting, setIsExporting] = useState(false)
  
  const handleExport = async () => {
    try {
      setIsExporting(true)
      onProgress?.(0)
      
      // 解析HTML内容
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlContent, 'text/html')
      onProgress?.(20)
      
      // 转换为Word文档结构
      const wordDoc = await convertHTMLToWordDoc(doc, exportSettings)
      onProgress?.(60)
      
      // 添加水印
      if (watermarkConfig.enabled) {
        await addWatermarkToWordDoc(wordDoc, watermarkConfig)
      }
      onProgress?.(80)
      
      // 生成文档
      const blob = await Packer.toBlob(wordDoc)
      onProgress?.(100)
      
      onComplete?.(blob)
      
      // 自动下载
      saveAs(blob, `${exportSettings.filename || 'document'}.docx`)
      
    } catch (error) {
      onError?.(error as Error)
    } finally {
      setIsExporting(false)
    }
  }
  
  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="export-button word-export"
    >
      {isExporting ? '导出中...' : '导出为Word'}
    </button>
  )
}

// HTML到Word文档转换函数
async function convertHTMLToWordDoc(
  htmlDoc: Document, 
  settings: WordExportSettings
): Promise<Document> {
  const children: any[] = []
  
  // 遍历HTML元素并转换
  const walker = htmlDoc.createTreeWalker(
    htmlDoc.body,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
  )
  
  let node = walker.nextNode()
  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element
      
      switch (element.tagName.toLowerCase()) {
        case 'h1':
          children.push(new Paragraph({
            text: element.textContent || '',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 240 }
          }))
          break
          
        case 'h2':
          children.push(new Paragraph({
            text: element.textContent || '',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 }
          }))
          break
          
        case 'p':
          children.push(new Paragraph({
            children: [new TextRun(element.textContent || '')],
            spacing: { after: 120 }
          }))
          break
          
        case 'ul':
        case 'ol':
          // 处理列表
          const listItems = element.querySelectorAll('li')
          listItems.forEach((li, index) => {
            children.push(new Paragraph({
              children: [new TextRun(`${index + 1}. ${li.textContent}`)],
              spacing: { after: 60 }
            }))
          })
          break
      }
    }
    
    node = walker.nextNode()
  }
  
  return new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: settings.margins.top,
            right: settings.margins.right,
            bottom: settings.margins.bottom,
            left: settings.margins.left
          }
        }
      },
      children
    }]
  })
}
```

### 2. HTML到PDF导出器
```typescript
// components/exporters/html-to-pdf-exporter.tsx
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface HTMLToPDFExporterProps {
  htmlContent: string
  watermarkConfig: WatermarkConfig
  exportSettings: PDFExportSettings
  onProgress?: (progress: number) => void
  onComplete?: (blob: Blob) => void
  onError?: (error: Error) => void
}

export function HTMLToPDFExporter({
  htmlContent,
  watermarkConfig,
  exportSettings,
  onProgress,
  onComplete,
  onError
}: HTMLToPDFExporterProps) {
  const [isExporting, setIsExporting] = useState(false)
  
  const handleExport = async () => {
    try {
      setIsExporting(true)
      onProgress?.(0)
      
      // 创建临时容器
      const container = document.createElement('div')
      container.innerHTML = htmlContent
      container.style.width = `${exportSettings.pageWidth}px`
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      document.body.appendChild(container)
      
      onProgress?.(20)
      
      // 添加水印到容器
      if (watermarkConfig.enabled) {
        await addWatermarkToContainer(container, watermarkConfig)
      }
      
      onProgress?.(40)
      
      // 转换为Canvas
      const canvas = await html2canvas(container, {
        scale: exportSettings.scale || 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      onProgress?.(70)
      
      // 创建PDF
      const pdf = new jsPDF({
        orientation: exportSettings.orientation || 'portrait',
        unit: 'px',
        format: [exportSettings.pageWidth, exportSettings.pageHeight]
      })
      
      // 添加图片到PDF
      const imgData = canvas.toDataURL('image/png')
      pdf.addImage(
        imgData, 
        'PNG', 
        0, 
        0, 
        exportSettings.pageWidth, 
        canvas.height * (exportSettings.pageWidth / canvas.width)
      )
      
      onProgress?.(90)
      
      // 生成Blob
      const blob = pdf.output('blob')
      onProgress?.(100)
      
      onComplete?.(blob)
      
      // 自动下载
      pdf.save(`${exportSettings.filename || 'document'}.pdf`)
      
      // 清理临时容器
      document.body.removeChild(container)
      
    } catch (error) {
      onError?.(error as Error)
    } finally {
      setIsExporting(false)
    }
  }
  
  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="export-button pdf-export"
    >
      {isExporting ? '导出中...' : '导出为PDF'}
    </button>
  )
}
```#
## 3. 批量导出管理器
```typescript
// components/exporters/batch-exporter.tsx
interface BatchExportItem {
  id: string
  htmlContent: string
  filename: string
  format: 'word' | 'pdf'
  watermarkConfig: WatermarkConfig
}

interface BatchExporterProps {
  items: BatchExportItem[]
  onProgress?: (overall: number, current: string) => void
  onComplete?: (results: ExportResult[]) => void
  onError?: (error: Error, item: BatchExportItem) => void
}

export function BatchExporter({
  items,
  onProgress,
  onComplete,
  onError
}: BatchExporterProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [currentItem, setCurrentItem] = useState<string>('')
  
  const handleBatchExport = async () => {
    try {
      setIsExporting(true)
      const results: ExportResult[] = []
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        setCurrentItem(item.filename)
        
        try {
          let blob: Blob
          
          if (item.format === 'word') {
            blob = await exportToWord(item.htmlContent, item.watermarkConfig)
          } else {
            blob = await exportToPDF(item.htmlContent, item.watermarkConfig)
          }
          
          results.push({
            id: item.id,
            success: true,
            blob,
            filename: `${item.filename}.${item.format === 'word' ? 'docx' : 'pdf'}`
          })
          
        } catch (error) {
          results.push({
            id: item.id,
            success: false,
            error: error as Error
          })
          
          onError?.(error as Error, item)
        }
        
        onProgress?.(((i + 1) / items.length) * 100, item.filename)
      }
      
      onComplete?.(results)
      
    } catch (error) {
      onError?.(error as Error, items[0])
    } finally {
      setIsExporting(false)
      setCurrentItem('')
    }
  }
  
  return (
    <div className="batch-exporter">
      <button
        onClick={handleBatchExport}
        disabled={isExporting || items.length === 0}
        className="batch-export-button"
      >
        {isExporting ? `导出中: ${currentItem}` : `批量导出 (${items.length}个文件)`}
      </button>
      
      {isExporting && (
        <div className="batch-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(items.findIndex(item => item.filename === currentItem) + 1) / items.length * 100}%` }}
            />
          </div>
          <span className="progress-text">
            正在导出: {currentItem}
          </span>
        </div>
      )}
    </div>
  )
}
```

### 4. 导出设置组件
```typescript
// components/ui/export-settings.tsx
interface ExportSettingsProps {
  format: 'word' | 'pdf'
  settings: ExportSettings
  onSettingsChange: (settings: ExportSettings) => void
}

export function ExportSettings({
  format,
  settings,
  onSettingsChange
}: ExportSettingsProps) {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    })
  }
  
  return (
    <div className="export-settings">
      <h3>导出设置</h3>
      
      <div className="setting-group">
        <label>文件名</label>
        <input
          type="text"
          value={settings.filename || ''}
          onChange={(e) => updateSetting('filename', e.target.value)}
          placeholder="请输入文件名"
        />
      </div>
      
      {format === 'word' && (
        <>
          <div className="setting-group">
            <label>页边距 (cm)</label>
            <div className="margin-inputs">
              <input
                type="number"
                value={settings.margins?.top || 2.54}
                onChange={(e) => updateSetting('margins', {
                  ...settings.margins,
                  top: parseFloat(e.target.value)
                })}
                placeholder="上"
                step="0.1"
                min="0"
              />
              <input
                type="number"
                value={settings.margins?.right || 2.54}
                onChange={(e) => updateSetting('margins', {
                  ...settings.margins,
                  right: parseFloat(e.target.value)
                })}
                placeholder="右"
                step="0.1"
                min="0"
              />
              <input
                type="number"
                value={settings.margins?.bottom || 2.54}
                onChange={(e) => updateSetting('margins', {
                  ...settings.margins,
                  bottom: parseFloat(e.target.value)
                })}
                placeholder="下"
                step="0.1"
                min="0"
              />
              <input
                type="number"
                value={settings.margins?.left || 2.54}
                onChange={(e) => updateSetting('margins', {
                  ...settings.margins,
                  left: parseFloat(e.target.value)
                })}
                placeholder="左"
                step="0.1"
                min="0"
              />
            </div>
          </div>
          
          <div className="setting-group">
            <label>字体</label>
            <select
              value={settings.fontFamily || 'Times New Roman'}
              onChange={(e) => updateSetting('fontFamily', e.target.value)}
            >
              <option value="Times New Roman">Times New Roman</option>
              <option value="Arial">Arial</option>
              <option value="Calibri">Calibri</option>
              <option value="SimSun">宋体</option>
              <option value="SimHei">黑体</option>
            </select>
          </div>
        </>
      )}
      
      {format === 'pdf' && (
        <>
          <div className="setting-group">
            <label>页面方向</label>
            <select
              value={settings.orientation || 'portrait'}
              onChange={(e) => updateSetting('orientation', e.target.value)}
            >
              <option value="portrait">纵向</option>
              <option value="landscape">横向</option>
            </select>
          </div>
          
          <div className="setting-group">
            <label>图片质量</label>
            <select
              value={settings.scale || 2}
              onChange={(e) => updateSetting('scale', parseInt(e.target.value))}
            >
              <option value={1}>标准 (1x)</option>
              <option value={2}>高清 (2x)</option>
              <option value={3}>超高清 (3x)</option>
            </select>
          </div>
        </>
      )}
      
      <div className="setting-group">
        <label>
          <input
            type="checkbox"
            checked={settings.includeWatermark !== false}
            onChange={(e) => updateSetting('includeWatermark', e.target.checked)}
          />
          包含水印
        </label>
      </div>
    </div>
  )
}
```## 🔧 开发规范


### 导出质量标准
- Word文档必须保持原始格式
- PDF文档必须高清无失真
- 水印必须在导出文档中正确显示
- 导出速度必须在可接受范围内

### 错误处理规范
```typescript
// 统一的导出错误类型
export enum ExportErrorType {
  PARSE_ERROR = 'PARSE_ERROR',
  CONVERSION_ERROR = 'CONVERSION_ERROR',
  WATERMARK_ERROR = 'WATERMARK_ERROR',
  FILE_GENERATION_ERROR = 'FILE_GENERATION_ERROR',
  DOWNLOAD_ERROR = 'DOWNLOAD_ERROR'
}

export class ExportError extends Error {
  constructor(
    public type: ExportErrorType,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ExportError'
  }
}

// 错误处理函数
export function handleExportError(error: ExportError, context: string) {
  console.error(`Export error in ${context}:`, error)
  
  // 根据错误类型提供用户友好的消息
  const userMessage = getUserFriendlyErrorMessage(error.type)
  
  // 发送错误报告
  reportError(error, context)
  
  return userMessage
}

function getUserFriendlyErrorMessage(type: ExportErrorType): string {
  switch (type) {
    case ExportErrorType.PARSE_ERROR:
      return '文档解析失败，请检查内容格式'
    case ExportErrorType.CONVERSION_ERROR:
      return '文档转换失败，请重试'
    case ExportErrorType.WATERMARK_ERROR:
      return '水印添加失败，但文档已生成'
    case ExportErrorType.FILE_GENERATION_ERROR:
      return '文件生成失败，请重试'
    case ExportErrorType.DOWNLOAD_ERROR:
      return '文件下载失败，请检查浏览器设置'
    default:
      return '导出过程中发生未知错误'
  }
}
```

### 性能优化规范
- 大文档分块处理
- 使用Web Workers处理重计算
- 实现导出缓存机制
- 优化内存使用

## 🔄 与其他工作区的接口

### 数据接口
```typescript
// 接收工作区3的HTML内容
interface HTMLFromRenderer {
  html: string
  css: string
  watermarkConfig: WatermarkConfig
  metadata: {
    title: string
    wordCount: number
    pageCount: number
    generatedAt: string
  }
}

// 导出结果接口
interface ExportResult {
  id: string
  success: boolean
  blob?: Blob
  filename?: string
  error?: Error
  exportTime?: number
  fileSize?: number
}
```

### 事件接口
```typescript
// 导出开始事件
interface ExportStartEvent {
  type: 'EXPORT_START'
  payload: {
    format: 'word' | 'pdf'
    filename: string
    settings: ExportSettings
  }
}

// 导出进度事件
interface ExportProgressEvent {
  type: 'EXPORT_PROGRESS'
  payload: {
    progress: number
    stage: string
    filename: string
  }
}

// 导出完成事件
interface ExportCompleteEvent {
  type: 'EXPORT_COMPLETE'
  payload: ExportResult
}
```

## 📅 开发时间线

### 第1周: 基础导出功能
- Day 1-2: 实现HTML到Word导出
- Day 3-4: 实现HTML到PDF导出
- Day 5-7: 集成水印保持功能

### 第2周: 高级功能开发
- Day 8-10: 实现批量导出功能
- Day 11-12: 开发导出设置界面
- Day 13-14: 实现导出进度管理

### 第3周: 优化和测试
- Day 15-17: 性能优化和错误处理
- Day 18-19: 质量测试和格式验证
- Day 20-21: 集成测试和文档完善

## ✅ 验收标准

### 功能验收
- [ ] Word导出功能正常工作
- [ ] PDF导出功能正常工作
- [ ] 批量导出功能正常
- [ ] 水印在导出文档中正确显示
- [ ] 导出设置功能完整

### 质量验收
- [ ] 导出文档格式正确
- [ ] 导出速度符合要求
- [ ] 内存使用合理
- [ ] 错误处理完善
- [ ] 用户体验良好

### 兼容性验收
- [ ] 支持主流浏览器
- [ ] 导出文档可在Office软件中正常打开
- [ ] PDF文档可在各种PDF阅读器中正常显示
- [ ] 移动端导出功能正常

## 🚀 部署和集成

### 构建配置
```json
{
  "scripts": {
    "dev": "next dev -p 3004",
    "build": "next build",
    "test": "jest",
    "test:export": "jest --testPathPattern=export"
  },
  "dependencies": {
    "docx": "^8.0.0",
    "jspdf": "^2.5.0",
    "html2canvas": "^1.4.0",
    "file-saver": "^2.0.0",
    "jszip": "^3.10.0"
  }
}
```

### 环境变量
```env
NEXT_PUBLIC_WORKSPACE_NAME=workspace-4-html-export
NEXT_PUBLIC_MAX_EXPORT_SIZE=50MB
NEXT_PUBLIC_ENABLE_BATCH_EXPORT=true
NEXT_PUBLIC_WATERMARK_QUALITY=high
```

## 📊 性能指标

### 导出性能
- Word导出时间 < 5秒 (标准文档)
- PDF导出时间 < 8秒 (标准文档)
- 批量导出并发数 ≤ 3个
- 内存使用 < 200MB (单次导出)

### 文件质量
- Word文档格式兼容性 > 95%
- PDF文档清晰度 ≥ 300DPI
- 水印保真度 > 98%
- 文件大小优化率 > 20%

## 📞 支持和维护

### 技术支持
- 负责人：前端导出专家
- 技术栈：JavaScript + 导出库
- 支持时间：工作日 9:00-18:00

### 维护计划
- 每周性能监控
- 每月导出库更新
- 季度兼容性测试

---
**工作区4准备就绪，等待开发团队接手！** 📄