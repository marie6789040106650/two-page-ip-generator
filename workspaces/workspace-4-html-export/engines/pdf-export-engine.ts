import jsPDF from 'jspdf'
import * as cheerio from 'cheerio'

interface ExportOptions {
  html: string
  watermarkConfig?: any
  styleConfig?: any
  metadata?: any
}

interface ExportResult {
  buffer: Buffer
  filename: string
  metadata: {
    exportTime: number
    fileSize: number
    pageCount: number
  }
}

export class PDFExportEngine {
  // 为了支持中文，我们需要使用编码处理
  private encodeText(text: string): string {
    try {
      // 对于中文字符，我们使用简单的替换策略
      // 这是一个临时解决方案，实际应用中可能需要更复杂的处理
      return text.replace(/[\u4e00-\u9fff]/g, '?')
    } catch {
      return text
    }
  }

  async exportToPDF(options: ExportOptions): Promise<ExportResult> {
    const startTime = Date.now()
    
    try {
      // 创建PDF文档
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      })
      
      // 解析HTML内容，确保正确处理中文字符
      const $ = cheerio.load(options.html, { decodeEntities: false })
      
      // 设置字体和样式
      pdf.setFont('helvetica')
      pdf.setFontSize(12)
      
      let yPosition = 50
      const pageHeight = pdf.internal.pageSize.height
      const pageWidth = pdf.internal.pageSize.width
      const margin = 50
      const lineHeight = 20
      
      // 添加水印
      if (options.watermarkConfig?.enabled && options.watermarkConfig?.text) {
        this.addWatermarkToPDF(pdf, options.watermarkConfig)
      }
      
      // 转换HTML内容为PDF
      yPosition = await this.convertHTMLToPDF(pdf, $, yPosition, margin, pageWidth, lineHeight)
      
      // 生成PDF缓冲区
      const pdfOutput = pdf.output('arraybuffer')
      const buffer = Buffer.from(pdfOutput)
      
      const exportTime = Date.now() - startTime
      const filename = `${this.encodeText(options.metadata?.title || 'Document')}_${new Date().toISOString().slice(0, 10)}.pdf`
      
      return {
        buffer,
        filename,
        metadata: {
          exportTime,
          fileSize: buffer.length,
          pageCount: pdf.getNumberOfPages()
        }
      }
      
    } catch (error) {
      console.error('PDF export failed:', error)
      throw new Error(`PDF导出失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }
  
  private async convertHTMLToPDF(
    pdf: jsPDF, 
    $: cheerio.Root, 
    startY: number, 
    margin: number, 
    pageWidth: number, 
    lineHeight: number
  ): Promise<number> {
    let yPosition = startY
    const maxWidth = pageWidth - 2 * margin
    
    // 遍历HTML元素
    $('body').children().each((index, element) => {
      const $element = $(element)
      const tagName = (element as any).tagName?.toLowerCase()
      const text = $element.text().trim()
      
      if (!text) return
      
      // 检查是否需要新页面
      if (yPosition > pdf.internal.pageSize.height - 100) {
        pdf.addPage()
        yPosition = 50
        
        // 在新页面添加水印
        if (pdf.internal.getCurrentPageInfo().pageNumber > 1) {
          this.addWatermarkToPDF(pdf, { enabled: true, text: 'Watermark', opacity: 0.1 })
        }
      }
      
      switch (tagName) {
        case 'h1':
          pdf.setFontSize(20)
          pdf.setFont('helvetica', 'bold')
          yPosition += 10
          
          // 居中标题
          const encodedText = this.encodeText(text)
          const h1Width = pdf.getTextWidth(encodedText)
          const h1X = (pageWidth - h1Width) / 2
          pdf.text(encodedText, h1X, yPosition)
          
          yPosition += lineHeight * 1.5
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(12)
          break
          
        case 'h2':
          pdf.setFontSize(16)
          pdf.setFont('helvetica', 'bold')
          yPosition += 15
          
          const encodedH2Text = this.encodeText(text)
          pdf.text(encodedH2Text, margin, yPosition)
          
          // 添加下划线
          pdf.line(margin, yPosition + 5, margin + pdf.getTextWidth(encodedH2Text), yPosition + 5)
          
          yPosition += lineHeight * 1.2
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(12)
          break
          
        case 'h3':
          pdf.setFontSize(14)
          pdf.setFont('helvetica', 'bold')
          yPosition += 10
          
          pdf.text(this.encodeText(text), margin, yPosition)
          
          yPosition += lineHeight
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(12)
          break
          
        case 'p':
          yPosition += 5
          
          // 处理长文本换行
          const encodedPText = this.encodeText(text)
          const lines = pdf.splitTextToSize(encodedPText, maxWidth)
          pdf.text(lines, margin, yPosition)
          
          yPosition += lines.length * lineHeight + 5
          break
          
        case 'ul':
        case 'ol':
          yPosition += 5
          
          $element.find('li').each((liIndex, liElement) => {
            const liText = $(liElement).text().trim()
            if (liText) {
              const bullet = tagName === 'ol' ? `${liIndex + 1}. ` : '• '
              const fullText = bullet + liText
              const encodedLiText = this.encodeText(fullText)
              
              const liLines = pdf.splitTextToSize(encodedLiText, maxWidth - 20)
              pdf.text(liLines, margin + 20, yPosition)
              
              yPosition += liLines.length * lineHeight
            }
          })
          
          yPosition += 5
          break
          
        case 'blockquote':
          yPosition += 10
          
          pdf.setFont('helvetica', 'italic')
          pdf.setTextColor(100, 100, 100)
          
          // 添加引用线
          pdf.line(margin, yPosition - 5, margin, yPosition + 15)
          
          const encodedQuoteText = this.encodeText(text)
          const quoteLines = pdf.splitTextToSize(encodedQuoteText, maxWidth - 30)
          pdf.text(quoteLines, margin + 15, yPosition)
          
          yPosition += quoteLines.length * lineHeight + 10
          
          pdf.setFont('helvetica', 'normal')
          pdf.setTextColor(0, 0, 0)
          break
          
        case 'hr':
          yPosition += 10
          pdf.line(margin, yPosition, pageWidth - margin, yPosition)
          yPosition += 10
          break
          
        default:
          if (text && !['script', 'style', 'meta', 'link'].includes(tagName || '')) {
            const encodedDefaultText = this.encodeText(text)
            const defaultLines = pdf.splitTextToSize(encodedDefaultText, maxWidth)
            pdf.text(defaultLines, margin, yPosition)
            yPosition += defaultLines.length * lineHeight + 5
          }
          break
      }
    })
    
    return yPosition
  }
  
  private addWatermarkToPDF(pdf: jsPDF, watermarkConfig: any) {
    if (!watermarkConfig?.enabled || !watermarkConfig?.text) return
    
    const pageWidth = pdf.internal.pageSize.width
    const pageHeight = pdf.internal.pageSize.height
    
    // 保存当前状态
    pdf.saveGraphicsState()
    
    // 设置水印样式 - 与工作区3保持一致
    const opacity = watermarkConfig.opacity / 100 // 工作区3使用百分比
    const fontSize = watermarkConfig.fontSize || 48
    const rotation = watermarkConfig.rotation || -45
    const text = this.encodeText(watermarkConfig.text)
    
    // 颜色映射 - 与工作区3保持一致
    const colorMap = {
      gray: [107, 114, 128],
      red: [239, 68, 68],
      blue: [59, 130, 246],
      black: [0, 0, 0]
    }
    
    const [r, g, b] = colorMap[watermarkConfig.color] || colorMap.gray
    pdf.setTextColor(r, g, b)
    pdf.setFontSize(fontSize)
    pdf.setFont('helvetica', 'bold')
    
    // 设置透明度
    pdf.setGState(new pdf.GState({ opacity }))
    
    // 根据重复模式绘制水印 - 与工作区3保持一致
    switch (watermarkConfig.repeat) {
      case 'diagonal':
        // 对角线重复模式 - 25个水印
        Array.from({ length: 25 }, (_, i) => {
          const row = Math.floor(i / 5) - 2
          const col = (i % 5) - 2
          const x = pageWidth * (0.5 + col * 0.25)
          const y = pageHeight * (0.5 + row * 0.2)
          
          pdf.text(text, x, y, {
            angle: rotation,
            align: 'center',
            baseline: 'middle'
          })
        })
        break
        
      case 'grid':
        // 网格重复模式 - 35个水印
        Array.from({ length: 35 }, (_, i) => {
          const row = Math.floor(i / 7)
          const col = i % 7
          const x = pageWidth * (0.1 + col * 0.13)
          const y = pageHeight * (0.1 + row * 0.15)
          
          pdf.text(text, x, y, {
            angle: rotation,
            align: 'center',
            baseline: 'middle'
          })
        })
        break
        
      case 'none':
      default:
        // 单个水印 - 根据位置设置
        const position = this.getWatermarkPosition(watermarkConfig.position, pageWidth, pageHeight)
        pdf.text(text, position.x, position.y, {
          angle: rotation,
          align: 'center',
          baseline: 'middle'
        })
        break
    }
    
    // 恢复状态
    pdf.restoreGraphicsState()
  }
  
  private getWatermarkPosition(position: string, pageWidth: number, pageHeight: number) {
    switch (position) {
      case 'center':
        return { x: pageWidth / 2, y: pageHeight / 2 }
      case 'top-left':
        return { x: pageWidth * 0.1, y: pageHeight * 0.1 }
      case 'top-right':
        return { x: pageWidth * 0.9, y: pageHeight * 0.1 }
      case 'bottom-left':
        return { x: pageWidth * 0.1, y: pageHeight * 0.9 }
      case 'bottom-right':
        return { x: pageWidth * 0.9, y: pageHeight * 0.9 }
      default:
        return { x: pageWidth / 2, y: pageHeight / 2 }
    }
  }
}