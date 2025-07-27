# 工作区3: HTML渲染和样式系统 - 详细规格说明

## 🎯 工作区职责
本工作区负责将Markdown内容转换为Word样式的HTML，实现专业的文档渲染效果，并集成水印系统。

## 📋 核心任务清单

### 1. Markdown到HTML转换 (优先级: 高)
- [ ] 实现Markdown解析和HTML渲染
- [ ] 应用Word样式的CSS样式系统
- [ ] 支持复杂的文档结构和格式
- [ ] 实现响应式布局适配

### 2. 水印系统集成 (优先级: 高)
- [ ] 集成现有的水印系统组件
- [ ] 实现水印的实时预览功能
- [ ] 支持多种水印样式和位置
- [ ] 确保水印在导出时正确显示

### 3. 样式系统优化 (优先级: 中)
- [ ] 实现Word文档样式模拟
- [ ] 支持自定义主题和样式
- [ ] 优化打印样式和导出样式
- [ ] 实现样式的动态切换

## 🏗️ 技术架构

### 组件结构
```
workspace-3-html-rendering/
├── components/
│   ├── renderers/                   # 渲染组件
│   │   ├── markdown-renderer.tsx
│   │   ├── word-style-renderer.tsx
│   │   ├── section-renderer.tsx
│   │   └── content-renderer.tsx
│   ├── watermark/                   # 水印组件
│   │   ├── watermark-overlay.tsx
│   │   ├── watermark-config.tsx
│   │   ├── watermark-preview.tsx
│   │   └── watermark-manager.tsx
│   ├── layout/                      # 布局组件
│   │   ├── document-layout.tsx
│   │   ├── page-layout.tsx
│   │   ├── header-layout.tsx
│   │   └── footer-layout.tsx
│   └── styling/                     # 样式组件
│       ├── theme-provider.tsx
│       ├── style-injector.tsx
│       └── css-generator.tsx
├── lib/                            # 核心库
│   ├── markdown-parser.ts
│   ├── html-generator.ts
│   ├── style-processor.ts
│   ├── watermark-engine.ts
│   └── theme-manager.ts
├── styles/                         # 样式文件
│   ├── word-document.css
│   ├── watermark-styles.css
│   ├── print-styles.css
│   ├── export-styles.css
│   └── responsive-styles.css
├── themes/                         # 主题配置
│   ├── default-theme.json
│   ├── professional-theme.json
│   ├── modern-theme.json
│   └── custom-theme.json
├── hooks/                          # 自定义Hook
│   ├── use-markdown-renderer.ts
│   ├── use-watermark-config.ts
│   ├── use-theme-manager.ts
│   └── use-style-injector.ts
└── types/                          # 类型定义
    ├── renderer-types.ts
    ├── watermark-types.ts
    ├── theme-types.ts
    └── style-types.ts
```

### 技术栈
- **框架**: React 18+ with TypeScript
- **Markdown解析**: remark + rehype
- **样式处理**: styled-components + CSS-in-JS
- **水印**: Canvas API + SVG
- **主题系统**: CSS Variables + JSON配置
- **响应式**: CSS Grid + Flexbox

## 📦 核心功能实现

### 1. Markdown渲染器
```typescript
// components/renderers/markdown-renderer.tsx
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { WatermarkOverlay } from '../watermark/watermark-overlay'

interface MarkdownRendererProps {
  content: string
  theme: ThemeConfig
  watermarkConfig: WatermarkConfig
  className?: string
}

export function MarkdownRenderer({
  content,
  theme,
  watermarkConfig,
  className
}: MarkdownRendererProps) {
  const [htmlContent, setHtmlContent] = useState('')
  
  useEffect(() => {
    const processMarkdown = async () => {
      const result = await remark()
        .use(remarkHtml, { sanitize: false })
        .process(content)
      
      setHtmlContent(String(result))
    }
    
    processMarkdown()
  }, [content])

  return (
    <div className={`markdown-renderer ${className}`}>
      <div 
        className="document-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={{
          '--primary-color': theme.primaryColor,
          '--secondary-color': theme.secondaryColor,
          '--font-family': theme.fontFamily,
          '--line-height': theme.lineHeight
        } as CSSProperties}
      />
      <WatermarkOverlay config={watermarkConfig} />
    </div>
  )
}
```

### 2. Word样式渲染器
```typescript
// components/renderers/word-style-renderer.tsx
interface WordStyleRendererProps {
  children: React.ReactNode
  styleConfig: WordStyleConfig
  watermarkConfig: WatermarkConfig
}

export function WordStyleRenderer({
  children,
  styleConfig,
  watermarkConfig
}: WordStyleRendererProps) {
  const { injectStyles } = useStyleInjector()
  
  useEffect(() => {
    // 注入Word样式
    const wordStyles = generateWordStyles(styleConfig)
    injectStyles('word-document', wordStyles)
  }, [styleConfig, injectStyles])

  return (
    <div className="word-document-container">
      <div className="word-document-page">
        <div className="word-document-content">
          {children}
        </div>
        <WatermarkOverlay config={watermarkConfig} />
      </div>
    </div>
  )
}

// 生成Word样式的函数
function generateWordStyles(config: WordStyleConfig): string {
  return `
    .word-document-container {
      max-width: ${config.pageWidth}px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    
    .word-document-page {
      padding: ${config.margins.top}px ${config.margins.right}px 
               ${config.margins.bottom}px ${config.margins.left}px;
      min-height: ${config.pageHeight}px;
      position: relative;
    }
    
    .word-document-content h1 {
      font-size: ${config.headingStyles.h1.fontSize}px;
      font-weight: ${config.headingStyles.h1.fontWeight};
      color: ${config.headingStyles.h1.color};
      margin: ${config.headingStyles.h1.margin};
      text-align: ${config.headingStyles.h1.textAlign};
    }
    
    .word-document-content h2 {
      font-size: ${config.headingStyles.h2.fontSize}px;
      font-weight: ${config.headingStyles.h2.fontWeight};
      color: ${config.headingStyles.h2.color};
      margin: ${config.headingStyles.h2.margin};
      border-bottom: ${config.headingStyles.h2.borderBottom};
    }
    
    .word-document-content p {
      font-size: ${config.paragraphStyle.fontSize}px;
      line-height: ${config.paragraphStyle.lineHeight};
      margin: ${config.paragraphStyle.margin};
      text-align: ${config.paragraphStyle.textAlign};
      text-indent: ${config.paragraphStyle.textIndent}px;
    }
  `
}
```

### 3. 水印系统集成
```typescript
// components/watermark/watermark-overlay.tsx
interface WatermarkOverlayProps {
  config: WatermarkConfig
  className?: string
}

export function WatermarkOverlay({ config, className }: WatermarkOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    if (!canvasRef.current || !config.enabled) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 设置水印样式
    ctx.font = `${config.fontSize}px ${config.fontFamily}`
    ctx.fillStyle = config.color
    ctx.globalAlpha = config.opacity
    
    // 旋转画布
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((config.rotation * Math.PI) / 180)
    
    // 绘制水印文本
    const textWidth = ctx.measureText(config.text).width
    ctx.fillText(config.text, -textWidth / 2, 0)
    
    ctx.restore()
  }, [config])
  
  if (!config.enabled) return null
  
  return (
    <canvas
      ref={canvasRef}
      className={`watermark-overlay ${className}`}
      width={800}
      height={600}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: config.zIndex || 1000
      }}
    />
  )
}
```

### 4. 主题管理系统
```typescript
// lib/theme-manager.ts
export class ThemeManager {
  private static themes: Map<string, ThemeConfig> = new Map()
  
  static registerTheme(name: string, config: ThemeConfig) {
    this.themes.set(name, config)
  }
  
  static getTheme(name: string): ThemeConfig | undefined {
    return this.themes.get(name)
  }
  
  static applyTheme(name: string, element: HTMLElement) {
    const theme = this.getTheme(name)
    if (!theme) return
    
    // 应用CSS变量
    Object.entries(theme.cssVariables).forEach(([key, value]) => {
      element.style.setProperty(`--${key}`, value)
    })
    
    // 应用类名
    if (theme.className) {
      element.classList.add(theme.className)
    }
  }
  
  static generateCSS(theme: ThemeConfig): string {
    let css = ':root {\n'
    
    Object.entries(theme.cssVariables).forEach(([key, value]) => {
      css += `  --${key}: ${value};\n`
    })
    
    css += '}\n'
    
    // 添加组件样式
    if (theme.componentStyles) {
      Object.entries(theme.componentStyles).forEach(([selector, styles]) => {
        css += `${selector} {\n`
        Object.entries(styles).forEach(([property, value]) => {
          css += `  ${property}: ${value};\n`
        })
        css += '}\n'
      })
    }
    
    return css
  }
}
```

## 🔧 开发规范

### 组件设计规范
- 所有渲染组件必须支持主题切换
- 水印组件必须与内容分离
- 样式必须支持打印和导出
- 组件必须支持服务端渲染

### 样式规范
```css
/* styles/word-document.css */
.word-document-container {
  /* 模拟Word文档的容器样式 */
  max-width: 210mm; /* A4纸宽度 */
  min-height: 297mm; /* A4纸高度 */
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  position: relative;
}

.word-document-page {
  /* 页面内容区域 */
  padding: 2.54cm; /* Word默认边距 */
  font-family: 'Times New Roman', serif;
  font-size: 12pt;
  line-height: 1.5;
  color: #000;
}

/* 标题样式 */
.word-document-content h1 {
  font-size: 18pt;
  font-weight: bold;
  text-align: center;
  margin: 0 0 24pt 0;
  page-break-after: avoid;
}

.word-document-content h2 {
  font-size: 14pt;
  font-weight: bold;
  margin: 18pt 0 12pt 0;
  border-bottom: 1px solid #000;
  page-break-after: avoid;
}

.word-document-content h3 {
  font-size: 12pt;
  font-weight: bold;
  margin: 12pt 0 6pt 0;
  page-break-after: avoid;
}

/* 段落样式 */
.word-document-content p {
  margin: 0 0 12pt 0;
  text-align: justify;
  text-indent: 2em; /* 首行缩进 */
}

/* 列表样式 */
.word-document-content ul,
.word-document-content ol {
  margin: 6pt 0 12pt 24pt;
}

.word-document-content li {
  margin: 3pt 0;
}

/* 表格样式 */
.word-document-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 12pt 0;
}

.word-document-content th,
.word-document-content td {
  border: 1px solid #000;
  padding: 6pt;
  text-align: left;
}

.word-document-content th {
  background-color: #f0f0f0;
  font-weight: bold;
}

/* 打印样式 */
@media print {
  .word-document-container {
    box-shadow: none;
    margin: 0;
    max-width: none;
  }
  
  .word-document-page {
    page-break-inside: avoid;
  }
  
  .word-document-content h1,
  .word-document-content h2,
  .word-document-content h3 {
    page-break-after: avoid;
  }
}
```

## 🔄 与其他工作区的接口

### 数据接口
```typescript
// 接收工作区2的Markdown内容
interface MarkdownFromAPI {
  content: string
  metadata: {
    title: string
    wordCount: number
    sections: string[]
    generatedAt: string
  }
  bannerUrl?: string
}

// 向工作区4提供渲染后的HTML
interface HTMLToExport {
  html: string
  css: string
  watermarkConfig: WatermarkConfig
  metadata: RenderMetadata
}
```

### 事件接口
```typescript
// 渲染完成事件
interface RenderCompleteEvent {
  type: 'RENDER_COMPLETE'
  payload: {
    html: string
    renderTime: number
    wordCount: number
  }
}

// 水印配置变更事件
interface WatermarkConfigChangeEvent {
  type: 'WATERMARK_CONFIG_CHANGE'
  payload: WatermarkConfig
}
```

## 📅 开发时间线

### 第1周: 基础渲染功能
- Day 1-2: 实现Markdown到HTML转换
- Day 3-4: 开发Word样式系统
- Day 5-7: 集成基础水印功能

### 第2周: 高级功能开发
- Day 8-10: 完善水印系统集成
- Day 11-12: 实现主题管理系统
- Day 13-14: 优化响应式布局

### 第3周: 优化和测试
- Day 15-17: 样式优化和打印适配
- Day 18-19: 性能优化和测试
- Day 20-21: 集成测试和bug修复

## ✅ 验收标准

### 功能验收
- [ ] Markdown正确转换为HTML
- [ ] Word样式完美模拟
- [ ] 水印系统正常工作
- [ ] 主题切换功能正常
- [ ] 打印样式正确

### 质量验收
- [ ] 渲染性能符合要求
- [ ] 样式在各浏览器一致
- [ ] 水印不影响内容显示
- [ ] 响应式布局完美
- [ ] 无样式冲突

## 🚀 部署和集成

### 构建配置
```json
{
  "scripts": {
    "dev": "next dev -p 3003",
    "build": "next build",
    "test": "jest",
    "storybook": "start-storybook -p 6006"
  }
}
```

---
**工作区3准备就绪，等待开发团队接手！** 🎨