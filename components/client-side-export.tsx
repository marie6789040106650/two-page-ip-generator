"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, File, ChevronDown, Shield } from "lucide-react"
import type { FormData } from '@/lib/types'

interface ClientSideExportProps {
  content: string
  formData: FormData | null
  disabled?: boolean
  className?: string
}

export function ClientSideExport({
  content,
  formData,
  disabled = false,
  className = ""
}: ClientSideExportProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState<'word' | 'pdf' | null>(null)

  // 将Markdown转换为HTML
  const convertMarkdownToHtml = (markdown: string): string => {
    if (!formData) return markdown

    // 基础的Markdown到HTML转换
    let html = markdown
      .replace(/^# (.*$)/gm, '<h1 class="title">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="heading1">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="heading2">$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4 class="heading3">$1</h4>')
      .replace(/^\*\*(.*?)\*\*/gm, '<strong>$1</strong>')
      .replace(/^\* (.*$)/gm, '<li>$1</li>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')

    // 包装在段落标签中
    html = '<p>' + html + '</p>'
    
    // 处理列表
    html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>')

    return html
  }

  // 生成完整的HTML文档
  const generateFullHtml = (content: string): string => {
    if (!formData) return content

    const htmlContent = convertMarkdownToHtml(content)
    
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.storeName} - 老板IP打造方案</title>
    <style>
        @page {
            size: A4;
            margin: 2.54cm 3.17cm;
        }
        
        body {
            font-family: "Source Han Sans SC", "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", sans-serif;
            line-height: 1.5;
            color: #000000;
            margin: 0;
            padding: 0;
            background-color: white;
        }
        
        .title {
            font-family: "Source Han Serif SC", "Microsoft YaHei", serif;
            font-size: 18pt;
            font-weight: bold;
            text-align: center;
            margin: 12pt 0 6pt 0;
            color: #000000;
        }
        
        .heading1 {
            font-family: "Source Han Serif SC", "Microsoft YaHei", serif;
            font-size: 16pt;
            font-weight: bold;
            margin: 12pt 0 6pt 0;
            color: #000000;
        }
        
        .heading2 {
            font-family: "Source Han Serif SC", "Microsoft YaHei", serif;
            font-size: 14pt;
            font-weight: bold;
            margin: 6pt 0 4pt 0;
            color: #000000;
        }
        
        .heading3 {
            font-family: "Source Han Sans SC", "Microsoft YaHei", sans-serif;
            font-size: 12pt;
            font-weight: bold;
            margin: 3pt 0;
            color: #000000;
        }
        
        p {
            font-size: 11pt;
            margin-bottom: 6pt;
            text-indent: 0.74cm;
            color: #000000;
        }
        
        ul {
            margin: 6pt 0;
            padding-left: 0.74cm;
        }
        
        li {
            font-size: 11pt;
            margin-bottom: 3pt;
            color: #000000;
        }
        
        strong {
            font-weight: bold;
        }
        
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 36pt;
            color: rgba(229, 231, 235, 0.3);
            z-index: -1;
            pointer-events: none;
            font-family: "Source Han Sans SC", "Microsoft YaHei", sans-serif;
        }
        
        .footer {
            position: fixed;
            bottom: 1cm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10pt;
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="watermark">星光传媒 AI 生成</div>
    
    <div class="content">
        ${htmlContent}
    </div>
    
    <div class="footer">
        生成时间：${new Date().toLocaleString('zh-CN')} | 由星光传媒AI智能生成
    </div>
</body>
</html>
    `.trim()
  } 
 // Word导出功能 - 使用html-docx-js
  const handleWordExport = async () => {
    if (!content || !formData) return

    setIsExporting(true)
    setExportType('word')

    try {
      // 动态导入html-docx-js
      const { default: htmlDocx } = await import('html-docx-js/dist/html-docx')
      
      const htmlContent = generateFullHtml(content)
      
      // 转换为Word文档
      const converted = htmlDocx.asBlob(htmlContent)
      
      // 创建下载链接
      const url = URL.createObjectURL(converted)
      const link = document.createElement('a')
      link.href = url
      link.download = `${formData.storeName || '店铺'}-IP打造方案-${new Date().toLocaleDateString('zh-CN').replace(/\//g, '')}.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.log('✅ Word文档导出成功')
    } catch (error) {
      console.error('Word导出失败:', error)
      alert('Word导出失败，请稍后重试。错误信息：' + (error instanceof Error ? error.message : '未知错误'))
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }

  // PDF导出功能 - 使用jsPDF
  const handlePdfExport = async () => {
    if (!content || !formData) return

    setIsExporting(true)
    setExportType('pdf')

    try {
      // 动态导入jsPDF
      const { default: jsPDF } = await import('jspdf')
      
      // 创建PDF实例
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // 设置中文字体支持
      pdf.setFont('helvetica')
      
      // 解析内容为行
      const lines = content.split('\n').filter(line => line.trim())
      let yPosition = 20
      const pageHeight = pdf.internal.pageSize.height
      const margin = 20

      // 添加标题
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      const title = `${formData.storeName} - 老板IP打造方案`
      const titleWidth = pdf.getTextWidth(title)
      const pageWidth = pdf.internal.pageSize.width
      pdf.text(title, (pageWidth - titleWidth) / 2, yPosition)
      yPosition += 15

      // 添加副标题
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      const subtitle = '由星光传媒专业团队为您量身定制'
      const subtitleWidth = pdf.getTextWidth(subtitle)
      pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, yPosition)
      yPosition += 10

      // 添加生成时间
      pdf.setFontSize(10)
      const dateText = `生成时间：${new Date().toLocaleString('zh-CN')}`
      const dateWidth = pdf.getTextWidth(dateText)
      pdf.text(dateText, (pageWidth - dateWidth) / 2, yPosition)
      yPosition += 20

      // 处理内容
      lines.forEach(line => {
        const trimmedLine = line.trim()
        if (!trimmedLine) return

        // 检查是否需要新页面
        if (yPosition > pageHeight - margin) {
          pdf.addPage()
          yPosition = margin
        }

        // 处理标题
        const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/)
        if (headingMatch) {
          const level = headingMatch[1].length
          const title = headingMatch[2]
          
          pdf.setFontSize(level === 1 ? 16 : level === 2 ? 14 : level === 3 ? 12 : 11)
          pdf.setFont('helvetica', 'bold')
          
          // 分行处理长标题
          const splitTitle = pdf.splitTextToSize(title, pageWidth - 2 * margin)
          pdf.text(splitTitle, margin, yPosition)
          yPosition += splitTitle.length * (level === 1 ? 8 : level === 2 ? 7 : 6) + 5
        } else {
          // 处理普通段落
          pdf.setFontSize(11)
          pdf.setFont('helvetica', 'normal')
          
          // 移除Markdown格式
          const cleanText = trimmedLine
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/^[-*]\s+/, '• ')
          
          // 分行处理长段落
          const splitText = pdf.splitTextToSize(cleanText, pageWidth - 2 * margin)
          pdf.text(splitText, margin, yPosition)
          yPosition += splitText.length * 5 + 3
        }
      })

      // 添加水印
      pdf.setFontSize(36)
      pdf.setTextColor(200, 200, 200)
      pdf.setFont('helvetica', 'normal')
      
      // 计算水印位置
      const watermarkText = '星光传媒 AI 生成'
      const watermarkWidth = pdf.getTextWidth(watermarkText)
      const centerX = pageWidth / 2
      const centerY = pageHeight / 2
      
      // 旋转并添加水印
      pdf.text(watermarkText, centerX - watermarkWidth / 2, centerY, {
        angle: -45
      })

      // 添加页脚
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.setFont('helvetica', 'italic')
      const footerText = '本方案由星光传媒AI智能生成 | 专注于服务本地实体商家的IP内容机构'
      const footerWidth = pdf.getTextWidth(footerText)
      pdf.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 10)

      // 保存PDF
      const fileName = `${formData.storeName || '店铺'}-IP打造方案-${new Date().toLocaleDateString('zh-CN').replace(/\//g, '')}.pdf`
      pdf.save(fileName)

      console.log('✅ PDF文档导出成功')
    } catch (error) {
      console.error('PDF导出失败:', error)
      alert('PDF导出失败，请稍后重试。错误信息：' + (error instanceof Error ? error.message : '未知错误'))
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {/* 水印状态指示 */}
      <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
        <Shield className="h-3 w-3 mr-1" />
        <span className="hidden sm:inline">前端导出</span>
      </div>

      {/* 导出按钮 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="sm"
            disabled={disabled || isExporting}
            className={`bg-purple-600 hover:bg-purple-700 text-white ${className}`}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                {exportType === 'word' ? '导出Word中...' : '导出PDF中...'}
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">导出文档</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleWordExport} disabled={isExporting}>
            <FileText className="h-4 w-4 mr-2" />
            <div className="flex flex-col">
              <span>导出为 Word</span>
              <span className="text-xs text-gray-500">前端HTML转Word格式</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePdfExport} disabled={isExporting}>
            <File className="h-4 w-4 mr-2" />
            <div className="flex flex-col">
              <span>导出为 PDF</span>
              <span className="text-xs text-gray-500">前端HTML转PDF格式</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}