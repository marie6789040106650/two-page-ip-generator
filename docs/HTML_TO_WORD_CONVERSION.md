# HTML到Word转换技术方案

## 核心技术栈

### 主要库选择
- **html-docx-js**: 浏览器端HTML到Word转换
- **mammoth.js**: Word文档处理（备选）
- **docx**: 纯JavaScript Word文档生成（备选）

## 实现方案

### 1. HTML预处理
```typescript
// lib/html-preprocessor.ts
export class HtmlPreprocessor {
  static prepareForWordConversion(html: string): string {
    return html
      // 转换CSS样式为内联样式
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      // 优化表格结构
      .replace(/<table/g, '<table border="1" cellpadding="5" cellspacing="0"')
      // 处理图片
      .replace(/<img([^>]*)>/g, '<img$1 style="max-width:100%">')
      // 标准化段落
      .replace(/<p([^>]*)>/g, '<p$1 style="margin:6pt 0;text-indent:0.74cm;">')
  }
}
```

### 2. Word样式映射
```typescript
// lib/word-style-mapper.ts
export class WordStyleMapper {
  private static styleMap = {
    'h1': 'font-size:18pt;font-weight:bold;text-align:center;margin:12pt 0 6pt 0;',
    'h2': 'font-size:16pt;font-weight:bold;margin:12pt 0 6pt 0;',
    'h3': 'font-size:14pt;font-weight:bold;margin:6pt 0 4pt 0;',
    'p': 'font-size:11pt;margin-bottom:6pt;text-indent:0.74cm;',
    'li': 'font-size:11pt;margin-bottom:3pt;'
  }

  static applyWordStyles(html: string): string {
    let styledHtml = html
    
    Object.entries(this.styleMap).forEach(([tag, style]) => {
      const regex = new RegExp(`<${tag}([^>]*)>`, 'gi')
      styledHtml = styledHtml.replace(regex, `<${tag}$1 style="${style}">`)
    })
    
    return styledHtml
  }
}
```

### 3. Word文档生成
```typescript
// lib/html-to-word-converter.ts
import htmlDocx from 'html-docx-js/dist/html-docx'

export class HtmlToWordConverter {
  static async convert(html: string, filename: string): Promise<void> {
    try {
      // 预处理HTML
      const processedHtml = HtmlPreprocessor.prepareForWordConversion(html)
      
      // 应用Word样式
      const styledHtml = WordStyleMapper.applyWordStyles(processedHtml)
      
      // 包装完整HTML文档
      const fullHtml = this.wrapInWordDocument(styledHtml)
      
      // 转换为Word文档
      const converted = htmlDocx.asBlob(fullHtml)
      
      // 下载文件
      this.downloadFile(converted, filename)
      
    } catch (error) {
      console.error('Word转换失败:', error)
      throw new Error('Word文档生成失败')
    }
  }

  private static wrapInWordDocument(content: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { 
      font-family: "Source Han Sans SC", "Microsoft YaHei", sans-serif;
      line-height: 1.5;
      color: #000000;
    }
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 36pt;
      color: rgba(229, 231, 235, 0.3);
      z-index: -1;
    }
  </style>
</head>
<body>
  <div class="watermark">星光传媒 AI 生成</div>
  ${content}
  <div style="text-align:center;margin-top:20pt;font-size:10pt;color:#666;">
    生成时间：${new Date().toLocaleString('zh-CN')}<br>
    由星光传媒AI智能生成 | 专注于服务本地实体商家的IP内容机构
  </div>
</body>
</html>
    `
  }

  private static downloadFile(blob: Blob, filename: string): void {
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