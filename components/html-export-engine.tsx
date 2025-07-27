"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, File, ChevronDown, Shield, Settings } from "lucide-react"
import type { FormData } from '@/lib/types'

// 水印配置接口
interface WatermarkConfig {
  enabled: boolean
  text: string
  opacity: number
  fontSize: number
  rotation: number
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  repeat: 'none' | 'diagonal' | 'grid'
  color: 'gray' | 'red' | 'blue' | 'black'
}

interface HtmlExportEngineProps {
  content: string
  formData: FormData | null
  disabled?: boolean
  className?: string
}

export function HtmlExportEngine({
  content,
  formData,
  disabled = false,
  className = ""
}: HtmlExportEngineProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState<'word' | 'pdf' | null>(null)
  
  // 水印配置状态
  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('watermarkConfig')
        if (saved) {
          return JSON.parse(saved)
        }
      } catch (error) {
        console.warn('加载水印配置失败:', error)
      }
    }
    
    // 默认水印配置
    return {
      enabled: true,
      text: '星光传媒 AI 生成',
      opacity: 20,
      fontSize: 48,
      rotation: 45,
      position: 'center',
      repeat: 'diagonal',
      color: 'gray'
    }
  })

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
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^\* (.*$)/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')

    // 包装在段落标签中
    html = '<p>' + html + '</p>'
    
    // 处理列表
    html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>')

    return html
  }

  // 生成水印样式
  const generateWatermarkCSS = (config: WatermarkConfig): string => {
    const colorMap = {
      gray: 'rgba(107, 114, 128, ' + config.opacity / 100 + ')',
      red: 'rgba(239, 68, 68, ' + config.opacity / 100 + ')',
      blue: 'rgba(59, 130, 246, ' + config.opacity / 100 + ')',
      black: 'rgba(0, 0, 0, ' + config.opacity / 100 + ')'
    }
    
    return `
      .watermark-element {
        position: fixed;
        color: ${colorMap[config.color]};
        font-size: ${config.fontSize}pt;
        font-weight: bold;
        pointer-events: none;
        user-select: none;
        z-index: -1;
        transform: rotate(-${config.rotation}deg);
        transform-origin: center;
        white-space: nowrap;
      }
    `
  }

  // 生成水印HTML
  const generateWatermarkHTML = (config: WatermarkConfig): string => {
    if (!config.enabled) return ''
    
    switch (config.repeat) {
      case 'diagonal':
        return generateDiagonalWatermarks(config)
      case 'grid':
        return generateGridWatermarks(config)
      case 'none':
      default:
        return generateSingleWatermark(config)
    }
  }

  const generateSingleWatermark = (config: WatermarkConfig): string => {
    const position = getPositionStyle(config.position)
    return `<div class="watermark-element" style="${position}">${config.text}</div>`
  }

  const generateDiagonalWatermarks = (config: WatermarkConfig): string => {
    let html = ''
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        html += `
          <div class="watermark-element" style="
            top: ${50 + i * 30}%;
            left: ${50 + j * 30}%;
            transform: translate(-50%, -50%) rotate(-${config.rotation}deg);
          ">
            ${config.text}
          </div>
        `
      }
    }
    return html
  }

  const generateGridWatermarks = (config: WatermarkConfig): string => {
    let html = ''
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        html += `
          <div class="watermark-element" style="
            top: ${20 + i * 25}%;
            left: ${20 + j * 30}%;
            transform: translate(-50%, -50%) rotate(-${config.rotation}deg);
          ">
            ${config.text}
          </div>
        `
      }
    }
    return html
  }

  const getPositionStyle = (position: WatermarkConfig['position']): string => {
    switch (position) {
      case 'center':
        return 'top: 50%; left: 50%; transform: translate(-50%, -50%);'
      case 'top-left':
        return 'top: 10%; left: 10%;'
      case 'top-right':
        return 'top: 10%; right: 10%;'
      case 'bottom-left':
        return 'bottom: 10%; left: 10%;'
      case 'bottom-right':
        return 'bottom: 10%; right: 10%;'
      default:
        return 'top: 50%; left: 50%; transform: translate(-50%, -50%);'
    }
  }

  // 生成Word兼容的HTML
  const generateWordCompatibleHtml = (htmlContent: string): string => {
    if (!formData) return htmlContent

    const watermarkCSS = generateWatermarkCSS(watermarkConfig)
    const watermarkHTML = generateWatermarkHTML(watermarkConfig)

    return `
<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:w="urn:schemas-microsoft-com:office:word" 
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta charset="utf-8">
    <title>${formData.storeName} - 老板IP打造方案</title>
    <!--[if gte mso 9]>
    <xml>
        <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>90</w:Zoom>
            <w:DoNotPromptForConvert/>
            <w:DoNotShowInsertionsAndDeletions/>
        </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
        @page {
            size: A4;
            margin: 2.54cm 3.17cm;
        }
        body {
            font-family: "Source Han Sans SC", "Microsoft YaHei", sans-serif;
            line-height: 1.5;
            color: #000000;
            margin: 0;
            padding: 0;
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
        ul, ol {
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
        ${watermarkCSS}
        .footer {
            text-align: center;
            margin-top: 20pt;
            font-size: 10pt;
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    ${watermarkHTML}
    ${htmlContent}
    <div class="footer">
        生成时间：${new Date().toLocaleString('zh-CN')}<br>
        由星光传媒AI智能生成 | 专注于服务本地实体商家的IP内容机构
    </div>
</body>
</html>
    `
  }

  // Word导出功能 - HTML到Word转换
  const handleWordExport = async () => {
    if (!content || !formData) return

    setIsExporting(true)
    setExportType('word')

    try {
      // 先将Markdown转换为HTML
      const htmlContent = convertMarkdownToHtml(content)
      
      // 生成Word兼容的完整HTML
      const wordHtml = generateWordCompatibleHtml(htmlContent)
      
      // 动态导入html-docx-js
      const htmlDocx = await import('html-docx-js/dist/html-docx')
      
      // 转换为Word文档
      const converted = htmlDocx.asBlob(wordHtml)
      
      // 创建下载链接
      const filename = `${formData.storeName || '店铺'}-IP打造方案-${new Date().toLocaleDateString('zh-CN').replace(/\//g, '')}.docx`
      const url = URL.createObjectURL(converted)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
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

  // PDF导出功能 - HTML到PDF转换
  const handlePdfExport = async () => {
    if (!content || !formData) return

    setIsExporting(true)
    setExportType('pdf')

    try {
      // 先将Markdown转换为HTML
      const htmlContent = convertMarkdownToHtml(content)
      
      // 创建临时DOM元素用于渲染
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = htmlContent
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
      
      // 应用样式
      const styleElement = document.createElement('style')
      styleElement.textContent = `
        .title { font-size: 18pt; font-weight: bold; text-align: center; margin: 12pt 0 6pt 0; }
        .heading1 { font-size: 16pt; font-weight: bold; margin: 12pt 0 6pt 0; }
        .heading2 { font-size: 14pt; font-weight: bold; margin: 6pt 0 4pt 0; }
        .heading3 { font-size: 12pt; font-weight: bold; margin: 3pt 0; }
        p { font-size: 11pt; margin-bottom: 6pt; text-indent: 0.74cm; }
        ul, ol { margin: 6pt 0; padding-left: 0.74cm; }
        li { font-size: 11pt; margin-bottom: 3pt; }
      `
      tempDiv.appendChild(styleElement)
      document.body.appendChild(tempDiv)

      // 动态导入html2canvas和jsPDF
      const [html2canvas, jsPDF] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ])

      // 转换为Canvas
      const canvas = await html2canvas.default(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      // 移除临时元素
      document.body.removeChild(tempDiv)

      // 创建PDF
      const pdf = new jsPDF.default({
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
      if (watermarkConfig.enabled) {
        const colorMap = {
          gray: [128, 128, 128],
          red: [239, 68, 68],
          blue: [59, 130, 246],
          black: [0, 0, 0]
        }
        
        pdf.setFontSize(watermarkConfig.fontSize / 2)
        pdf.setTextColor(...colorMap[watermarkConfig.color])
        
        // 根据重复模式添加水印
        switch (watermarkConfig.repeat) {
          case 'diagonal':
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                pdf.text(watermarkConfig.text, 105 + j * 60, 148 + i * 60, {
                  angle: -watermarkConfig.rotation,
                  align: 'center'
                })
              }
            }
            break
          case 'grid':
            for (let i = 0; i < 3; i++) {
              for (let j = 0; j < 2; j++) {
                pdf.text(watermarkConfig.text, 70 + i * 70, 100 + j * 100, {
                  angle: -watermarkConfig.rotation,
                  align: 'center'
                })
              }
            }
            break
          case 'none':
          default:
            pdf.text(watermarkConfig.text, 105, 148, {
              angle: -watermarkConfig.rotation,
              align: 'center'
            })
            break
        }
      }

      // 添加页脚
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.setFont('helvetica', 'italic')
      const footerText = '本方案由星光传媒AI智能生成 | 专注于服务本地实体商家的IP内容机构'
      pdf.text(footerText, 105, 287, { align: 'center' })

      // 保存PDF
      const filename = `${formData.storeName || '店铺'}-IP打造方案-${new Date().toLocaleDateString('zh-CN').replace(/\//g, '')}.pdf`
      pdf.save(filename)

      console.log('✅ PDF文档导出成功')
    } catch (error) {
      console.error('PDF导出失败:', error)
      alert('PDF导出失败，请稍后重试。错误信息：' + (error instanceof Error ? error.message : '未知错误'))
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }

  // 水印配置更新处理
  const handleWatermarkConfigChange = (config: WatermarkConfig) => {
    setWatermarkConfig(config)
    localStorage.setItem('watermarkConfig', JSON.stringify(config))
  }

  return (
    <div className="flex items-center space-x-2">
      {/* 水印状态指示 */}
      {watermarkConfig.enabled && (
        <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
          <Shield className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">已启用水印</span>
        </div>
      )}

      {/* HTML导出标识 */}
      <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
        <Shield className="h-3 w-3 mr-1" />
        <span className="hidden sm:inline">HTML导出</span>
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
              <span className="text-xs text-gray-500">HTML转Word格式</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePdfExport} disabled={isExporting}>
            <File className="h-4 w-4 mr-2" />
            <div className="flex flex-col">
              <span>导出为 PDF</span>
              <span className="text-xs text-gray-500">HTML转PDF格式</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}