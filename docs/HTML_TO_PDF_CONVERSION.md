# HTML到PDF转换技术方案

## 核心技术栈

### 主要库选择
- **jsPDF**: 纯JavaScript PDF生成
- **html2canvas**: HTML到Canvas转换
- **Puppeteer**: 服务端HTML到PDF（备选）

## 实现方案

### 1. HTML到PDF转换引擎
```typescript
// lib/html-to-pdf-converter.ts
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export class HtmlToPdfConverter {
  static async convert(html: string, filename: string): Promise<void> {
    try {
      // 创建临时DOM元素
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      tempDiv.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: 794px;
        background: white;
        font-family: "Source Han Sans SC", "Microsoft YaHei", sans-serif;
        line-height: 1.5;
        color: #000000;
        padding: 40px;
      `
      document.body.appendChild(tempDiv)

      // 转换为Canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      // 移除临时元素
      document.body.removeChild(tempDiv)

      // 创建PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // 计算图片尺寸
      const imgWidth = 210 // A4宽度
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      // 添加图片到PDF
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        imgWidth,
        imgHeight
      )

      // 添加水印
      this.addWatermark(pdf)

      // 保存PDF
      pdf.save(filename)

    } catch (error) {
      console.error('PDF转换失败:', error)
      throw new Error('PDF文档生成失败')
    }
  }

  private static addWatermark(pdf: jsPDF): void {
    const pageCount = pdf.getNumberOfPages()
    
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFontSize(36)
      pdf.setTextColor(200, 200, 200)
      
      // 计算水印位置
      const pageWidth = pdf.internal.pageSize.width
      const pageHeight = pdf.internal.pageSize.height
      const centerX = pageWidth / 2
      const centerY = pageHeight / 2
      
      // 添加旋转水印
      pdf.text('星光传媒 AI 生成', centerX, centerY, {
        angle: -45,
        align: 'center'
      })
    }
  }
}
```

### 2. 高级PDF生成（使用jsPDF-AutoTable）
```typescript
// lib/advanced-pdf-generator.ts
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export class AdvancedPdfGenerator {
  static async generateFromStructuredData(data: any, filename: string): Promise<void> {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    let yPosition = 20

    // 添加标题
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    const title = `${data.storeName} - 老板IP打造方案`
    pdf.text(title, 105, yPosition, { align: 'center' })
    yPosition += 15

    // 添加副标题
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text('由星光传媒专业团队为您量身定制', 105, yPosition, { align: 'center' })
    yPosition += 20

    // 添加基本信息表格
    const basicInfo = [
      ['店铺名称', data.storeName],
      ['店铺品类', data.storeCategory],
      ['店铺位置', data.storeLocation],
      ['经营时长', data.businessDuration],
      ['店铺特色', data.storeFeatures],
      ['老板特色', `${data.ownerName}老板 - ${data.ownerFeatures}`]
    ]

    pdf.autoTable({
      startY: yPosition,
      head: [['项目', '内容']],
      body: basicInfo,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold'
      }
    })

    // 添加内容部分
    yPosition = pdf.lastAutoTable.finalY + 20

    // 解析并添加Markdown内容
    this.addMarkdownContent(pdf, data.content, yPosition)

    // 添加水印和页脚
    this.addWatermarkAndFooter(pdf)

    // 保存PDF
    pdf.save(filename)
  }

  private static addMarkdownContent(pdf: jsPDF, content: string, startY: number): void {
    const lines = content.split('\n').filter(line => line.trim())
    let yPosition = startY

    lines.forEach(line => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return

      // 检查是否需要新页面
      if (yPosition > 270) {
        pdf.addPage()
        yPosition = 20
      }

      // 处理标题
      const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/)
      if (headingMatch) {
        const level = headingMatch[1].length
        const title = headingMatch[2]
        
        pdf.setFontSize(level === 1 ? 16 : level === 2 ? 14 : level === 3 ? 12 : 11)
        pdf.setFont('helvetica', 'bold')
        
        const splitTitle = pdf.splitTextToSize(title, 170)
        pdf.text(splitTitle, 20, yPosition)
        yPosition += splitTitle.length * (level === 1 ? 8 : level === 2 ? 7 : 6) + 5
      } else {
        // 处理普通段落
        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'normal')
        
        const cleanText = trimmedLine
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/^[-*]\s+/, '• ')
        
        const splitText = pdf.splitTextToSize(cleanText, 170)
        pdf.text(splitText, 20, yPosition)
        yPosition += splitText.length * 5 + 3
      }
    })
  }

  private static addWatermarkAndFooter(pdf: jsPDF): void {
    const pageCount = pdf.getNumberOfPages()
    
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      
      // 添加水印
      pdf.setFontSize(36)
      pdf.setTextColor(200, 200, 200)
      pdf.text('星光传媒 AI 生成', 105, 148, {
        angle: -45,
        align: 'center'
      })
      
      // 添加页脚
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.setFont('helvetica', 'italic')
      const footerText = '本方案由星光传媒AI智能生成 | 专注于服务本地实体商家的IP内容机构'
      pdf.text(footerText, 105, 287, { align: 'center' })
      
      // 添加页码
      pdf.text(`第 ${i} 页，共 ${pageCount} 页`, 105, 292, { align: 'center' })
    }
  }
}
```