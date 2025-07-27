# 更新的技术需求规范

## 📋 功能模块详细说明

### 1. Markdown 解析模块
**技术要求**:
- 支持标准Markdown语法
- 保留文档结构：段落、标题、列表、链接等
- 输出干净的HTML结构

**实现方案**:
```typescript
// lib/markdown-parser.ts
import { marked } from 'marked'

export class MarkdownParser {
  private renderer: marked.Renderer

  constructor() {
    this.renderer = new marked.Renderer()
    this.setupCustomRenderer()
  }

  private setupCustomRenderer() {
    // 标题渲染
    this.renderer.heading = (text, level) => {
      const className = `heading-${level}`
      return `<h${level} class="${className}">${text}</h${level}>`
    }

    // 段落渲染
    this.renderer.paragraph = (text) => {
      return `<p class="paragraph">${text}</p>`
    }

    // 列表渲染
    this.renderer.list = (body, ordered) => {
      const tag = ordered ? 'ol' : 'ul'
      return `<${tag} class="list">${body}</${tag}>`
    }

    // 链接渲染
    this.renderer.link = (href, title, text) => {
      return `<a href="${href}" class="link" ${title ? `title="${title}"` : ''}>${text}</a>`
    }
  }

  public parse(markdown: string): string {
    marked.setOptions({
      renderer: this.renderer,
      gfm: true,
      breaks: true,
      sanitize: false
    })

    return marked(markdown)
  }
}
```

### 2. 内容展示区模块
**技术要求**:
- 限定DOM容器 (#export-area)
- 应用文档风格CSS (A4尺寸)
- 支持实时预览

**实现方案**:
```typescript
// components/export-area-container.tsx
export function ExportAreaContainer({ content }: { content: string }) {
  return (
    <div 
      id="export-area" 
      className="export-container"
      style={{
        width: '21cm',
        minHeight: '29.7cm',
        margin: '0 auto',
        padding: '2.54cm',
        backgroundColor: 'white',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        fontFamily: '"Source Han Sans SC", "Microsoft YaHei", sans-serif',
        fontSize: '11pt',
        lineHeight: '1.5',
        color: '#000000'
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
```

### 3. 水印生成模块
**技术要求**:
- 支持中文水印配置
- 参数：文字、颜色、透明度、角度、字体大小、重复/单次、位置
- 实时预览功能

**实现方案**:
```typescript
// lib/watermark-generator.ts
export interface WatermarkConfig {
  text: string
  color: string
  opacity: number
  angle: number
  fontSize: number
  repeat: boolean
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export class WatermarkGenerator {
  static generateWatermarkCSS(config: WatermarkConfig): string {
    const baseStyle = `
      position: absolute;
      color: ${config.color};
      opacity: ${config.opacity};
      font-size: ${config.fontSize}pt;
      transform: rotate(${config.angle}deg);
      pointer-events: none;
      z-index: 1;
      font-family: "Source Han Sans SC", "Microsoft YaHei", sans-serif;
    `

    if (config.repeat) {
      return `
        ${baseStyle}
        background-image: url("data:image/svg+xml,${this.generateSVGPattern(config)}");
        background-repeat: repeat;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      `
    } else {
      const position = this.getPositionStyle(config.position)
      return `${baseStyle} ${position}`
    }
  }

  private static generateSVGPattern(config: WatermarkConfig): string {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <text x="100" y="100" 
              text-anchor="middle" 
              dominant-baseline="middle"
              fill="${config.color}" 
              opacity="${config.opacity}"
              font-size="${config.fontSize}"
              transform="rotate(${config.angle} 100 100)">
          ${config.text}
        </text>
      </svg>
    `
    return encodeURIComponent(svg)
  }

  private static getPositionStyle(position: string): string {
    switch (position) {
      case 'center': return 'top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(var(--angle));'
      case 'top-left': return 'top: 10%; left: 10%;'
      case 'top-right': return 'top: 10%; right: 10%;'
      case 'bottom-left': return 'bottom: 10%; left: 10%;'
      case 'bottom-right': return 'bottom: 10%; right: 10%;'
      default: return 'top: 50%; left: 50%; transform: translate(-50%, -50%);'
    }
  }
}
```

### 4. PDF导出模块 (使用html2pdf.js)
**技术要求**:
- 使用html2pdf.js库
- 支持A4分页
- 中文字体嵌入

**实现方案**:
```typescript
// lib/html-to-pdf-converter.ts
import html2pdf from 'html2pdf.js'

export class HtmlToPdfConverter {
  static async convert(elementId: string, filename: string): Promise<void> {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('导出区域未找到')
    }

    const options = {
      margin: 0,
      filename: filename,
      image: { 
        type: 'jpeg', 
        quality: 0.98 
      },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after'
      }
    }

    try {
      await html2pdf().set(options).from(element).save()
      console.log('✅ PDF导出成功')
    } catch (error) {
      console.error('PDF导出失败:', error)
      throw new Error('PDF导出失败')
    }
  }
}
```

### 5. Word导出模块 (使用html-docx-js)
**技术要求**:
- 使用html-docx-js库
- 将HTML DOM转换为.docx文件
- 保持格式完整性

**实现方案**:
```typescript
// lib/html-to-word-converter.ts
import htmlDocx from 'html-docx-js/dist/html-docx'

export class HtmlToWordConverter {
  static async convert(elementId: string, filename: string): Promise<void> {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('导出区域未找到')
    }

    try {
      // 获取HTML内容
      const htmlContent = element.outerHTML
      
      // 预处理HTML以提高Word兼容性
      const processedHtml = this.preprocessHtmlForWord(htmlContent)
      
      // 转换为Word文档
      const converted = htmlDocx.asBlob(processedHtml)
      
      // 下载文件
      this.downloadBlob(converted, filename)
      
      console.log('✅ Word导出成功')
    } catch (error) {
      console.error('Word导出失败:', error)
      throw new Error('Word导出失败')
    }
  }

  private static preprocessHtmlForWord(html: string): string {
    return html
      // 添加Word文档头部
      .replace('<div', '<html><head><meta charset="utf-8"></head><body><div')
      .replace('</div>', '</div></body></html>')
      // 转换CSS类为内联样式
      .replace(/class="([^"]*)"/g, (match, className) => {
        return this.convertClassToInlineStyle(className)
      })
  }

  private static convertClassToInlineStyle(className: string): string {
    const styleMap: Record<string, string> = {
      'heading-1': 'style="font-size:18pt;font-weight:bold;margin:12pt 0 6pt 0;"',
      'heading-2': 'style="font-size:16pt;font-weight:bold;margin:12pt 0 6pt 0;"',
      'heading-3': 'style="font-size:14pt;font-weight:bold;margin:6pt 0 4pt 0;"',
      'paragraph': 'style="font-size:11pt;margin-bottom:6pt;text-indent:0.74cm;"',
      'list': 'style="margin:6pt 0;padding-left:0.74cm;"'
    }
    
    return styleMap[className] || ''
  }

  private static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}
```

### 6. 自定义水印面板模块
**技术要求**:
- 用户通过表单设置水印参数
- 实时预览功能
- 直观的用户界面

**实现方案**:
```typescript
// components/watermark-config-panel.tsx
export function WatermarkConfigPanel({ 
  onConfigChange 
}: { 
  onConfigChange: (config: WatermarkConfig) => void 
}) {
  const [config, setConfig] = useState<WatermarkConfig>({
    text: '星光传媒 AI 生成',
    color: '#E5E7EB',
    opacity: 0.3,
    angle: -45,
    fontSize: 36,
    repeat: true,
    position: 'center'
  })

  const handleConfigChange = (key: keyof WatermarkConfig, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  return (
    <div className="watermark-config-panel">
      <h3>水印设置</h3>
      
      <div className="config-group">
        <label>水印文字</label>
        <input 
          type="text" 
          value={config.text}
          onChange={(e) => handleConfigChange('text', e.target.value)}
        />
      </div>

      <div className="config-group">
        <label>颜色</label>
        <input 
          type="color" 
          value={config.color}
          onChange={(e) => handleConfigChange('color', e.target.value)}
        />
      </div>

      <div className="config-group">
        <label>透明度: {config.opacity}</label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1"
          value={config.opacity}
          onChange={(e) => handleConfigChange('opacity', parseFloat(e.target.value))}
        />
      </div>

      <div className="config-group">
        <label>角度: {config.angle}°</label>
        <input 
          type="range" 
          min="-180" 
          max="180" 
          value={config.angle}
          onChange={(e) => handleConfigChange('angle', parseInt(e.target.value))}
        />
      </div>

      <div className="config-group">
        <label>字体大小: {config.fontSize}pt</label>
        <input 
          type="range" 
          min="12" 
          max="72" 
          value={config.fontSize}
          onChange={(e) => handleConfigChange('fontSize', parseInt(e.target.value))}
        />
      </div>

      <div className="config-group">
        <label>
          <input 
            type="checkbox" 
            checked={config.repeat}
            onChange={(e) => handleConfigChange('repeat', e.target.checked)}
          />
          重复水印
        </label>
      </div>

      {!config.repeat && (
        <div className="config-group">
          <label>位置</label>
          <select 
            value={config.position}
            onChange={(e) => handleConfigChange('position', e.target.value)}
          >
            <option value="center">居中</option>
            <option value="top-left">左上角</option>
            <option value="top-right">右上角</option>
            <option value="bottom-left">左下角</option>
            <option value="bottom-right">右下角</option>
          </select>
        </div>
      )}
    </div>
  )
}
```

### 7. 移动端兼容模块
**技术要求**:
- 支持手机浏览器查看
- 生成文档功能
- 推荐导出由PC操作

**实现方案**:
```typescript
// hooks/use-mobile-detection.ts
export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      setIsMobile(mobileRegex.test(userAgent) || window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return { isMobile }
}

// components/mobile-export-warning.tsx
export function MobileExportWarning() {
  const { isMobile } = useMobileDetection()

  if (!isMobile) return null

  return (
    <div className="mobile-warning">
      <p>📱 检测到您正在使用移动设备</p>
      <p>为获得最佳导出效果，建议使用PC端进行文档导出操作</p>
    </div>
  )
}
```

## 📦 依赖包更新

```json
{
  "dependencies": {
    "marked": "^9.1.6",
    "html2pdf.js": "^0.10.1",
    "html-docx-js": "^0.3.1",
    "file-saver": "^2.0.5"
  }
}
```