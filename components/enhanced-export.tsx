"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { FormData } from '@/lib/types'

interface EnhancedExportProps {
  content: string
  formData: FormData | null
  disabled?: boolean
  className?: string
}

export function EnhancedExport({ 
  content, 
  formData, 
  disabled = false, 
  className = "" 
}: EnhancedExportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportWord = async () => {
    if (!formData || !content) return
    
    setIsExporting(true)
    try {
      // 生成Word格式的HTML内容
      const wordContent = generateWordContent(formData, content)
      const blob = new Blob([wordContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${formData.storeName || '老板'}_IP打造方案.doc`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPDF = async () => {
    if (!formData || !content) return
    
    setIsExporting(true)
    try {
      // 使用浏览器打印功能生成PDF
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        const pdfContent = generatePDFContent(formData, content)
        printWindow.document.write(pdfContent)
        printWindow.document.close()
        printWindow.focus()
        
        // 延迟执行打印，确保内容加载完成
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 500)
      }
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPreview = async () => {
    if (!formData || !content) return
    
    setIsExporting(true)
    try {
      // 在新窗口中预览内容
      const previewWindow = window.open('', '_blank')
      if (previewWindow) {
        const previewContent = generatePreviewContent(formData, content)
        previewWindow.document.write(previewContent)
        previewWindow.document.close()
      }
    } finally {
      setIsExporting(false)
    }
  }

  const generateWordContent = (data: FormData, content: string): string => {
    // 生成Word兼容的HTML格式
    const wordHtml = content
      .replace(/^# (.*$)/gm, '<h1 style="font-family: \'Source Han Serif SC\', \'Microsoft YaHei\', serif; font-size: 18pt; font-weight: bold; text-align: center; margin: 12pt 0 6pt 0; color: #000000;">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 style="font-family: \'Source Han Serif SC\', \'Microsoft YaHei\', serif; font-size: 16pt; font-weight: bold; margin: 12pt 0 6pt 0; color: #000000;">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 style="font-family: \'Source Han Serif SC\', \'Microsoft YaHei\', serif; font-size: 14pt; font-weight: bold; margin: 6pt 0 4pt 0; color: #000000;">$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4 style="font-family: \'Source Han Sans SC\', \'Microsoft YaHei\', sans-serif; font-size: 12pt; font-weight: bold; margin: 3pt 0; color: #000000;">$1</h4>')
      .replace(/^- (.*$)/gm, '<p style="font-family: \'Source Han Sans SC\', \'Microsoft YaHei\', sans-serif; font-size: 11pt; margin-bottom: 6pt; padding-left: 0.74cm; color: #000000;">• $1</p>')
      .replace(/\n\n/g, '</p><p style="font-family: \'Source Han Sans SC\', \'Microsoft YaHei\', sans-serif; font-size: 11pt; margin-bottom: 6pt; text-indent: 0.74cm; color: #000000;">')
      .replace(/\n/g, '<br>')

    return `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta charset="utf-8">
    <title>${data.storeName || '店铺名称'} - 老板IP打造方案</title>
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
        }
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 36pt;
            color: #E5E7EB;
            opacity: 0.3;
            z-index: -1;
        }
    </style>
</head>
<body>
    <div class="watermark">星光传媒 AI 生成</div>
    ${wordHtml}
    <div style="font-family: 'Source Han Sans SC', 'Microsoft YaHei', sans-serif; font-size: 10pt; font-style: italic; text-align: center; margin-top: 20pt; color: #666;">
        生成时间：${new Date().toLocaleString()}<br>
        由星光传媒AI智能生成 | 专注于服务本地实体商家的IP内容机构
    </div>
</body>
</html>
    `.trim()
  }

  const generatePDFContent = (data: FormData, content: string): string => {
    // 生成适合打印为PDF的HTML内容
    const pdfHtml = content
      .replace(/^# (.*$)/gm, '<h1 style="font-family: \'Source Han Serif SC\', \'Microsoft YaHei\', serif; font-size: 18pt; font-weight: bold; text-align: center; margin: 12pt 0 6pt 0; color: #000000; page-break-after: avoid;">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 style="font-family: \'Source Han Serif SC\', \'Microsoft YaHei\', serif; font-size: 16pt; font-weight: bold; margin: 12pt 0 6pt 0; color: #000000; page-break-after: avoid;">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 style="font-family: \'Source Han Serif SC\', \'Microsoft YaHei\', serif; font-size: 14pt; font-weight: bold; margin: 6pt 0 4pt 0; color: #000000; page-break-after: avoid;">$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4 style="font-family: \'Source Han Sans SC\', \'Microsoft YaHei\', sans-serif; font-size: 12pt; font-weight: bold; margin: 3pt 0; color: #000000;">$1</h4>')
      .replace(/^- (.*$)/gm, '<p style="font-family: \'Source Han Sans SC\', \'Microsoft YaHei\', sans-serif; font-size: 11pt; margin-bottom: 6pt; padding-left: 0.74cm; color: #000000;">• $1</p>')
      .replace(/\n\n/g, '</p><p style="font-family: \'Source Han Sans SC\', \'Microsoft YaHei\', sans-serif; font-size: 11pt; margin-bottom: 6pt; text-indent: 0.74cm; color: #000000;">')
      .replace(/\n/g, '<br>')

    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>${data.storeName || '店铺名称'} - 老板IP打造方案</title>
    <style>
        @page {
            size: A4;
            margin: 2.54cm 3.17cm;
        }
        @media print {
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none; }
        }
        body {
            font-family: "Source Han Sans SC", "Microsoft YaHei", sans-serif;
            line-height: 1.5;
            color: #000000;
            margin: 0;
            padding: 20px;
        }
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 36pt;
            color: #E5E7EB;
            opacity: 0.3;
            z-index: -1;
            pointer-events: none;
        }
        .footer {
            font-size: 10pt;
            font-style: italic;
            text-align: center;
            margin-top: 20pt;
            color: #666;
            page-break-inside: avoid;
        }
    </style>
</head>
<body>
    <div class="watermark">星光传媒 AI 生成</div>
    ${pdfHtml}
    <div class="footer">
        生成时间：${new Date().toLocaleString()}<br>
        由星光传媒AI智能生成 | 专注于服务本地实体商家的IP内容机构
    </div>
</body>
</html>
    `.trim()
  }

  const generatePreviewContent = (data: FormData, content: string): string => {
    // 生成预览内容
    return generatePDFContent(data, content)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={disabled || isExporting}
          className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover-lift transition-all duration-300 ${className}`}
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {isExporting ? '导出中...' : '导出'}
          <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={handleExportWord}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div className="flex flex-col">
            <span>导出为Word</span>
            <span className="text-xs text-gray-500">Microsoft Word格式</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleExportPDF}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <div className="flex flex-col">
            <span>导出为PDF</span>
            <span className="text-xs text-gray-500">便携式文档格式</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleExportPreview}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <div className="flex flex-col">
            <span>预览方案</span>
            <span className="text-xs text-gray-500">新窗口预览</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}