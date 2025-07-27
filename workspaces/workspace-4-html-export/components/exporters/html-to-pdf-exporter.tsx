'use client'

import { useState } from 'react'
import { saveAs } from 'file-saver'

interface WatermarkConfig {
  enabled: boolean
  text?: string
  opacity?: number
  fontSize?: number
  color?: string
  rotation?: number
  repeat?: boolean
}

interface PDFExportSettings {
  filename?: string
  orientation?: 'portrait' | 'landscape'
  scale?: number
  pageWidth?: number
  pageHeight?: number
}

interface HTMLToPDFExporterProps {
  htmlContent: string
  watermarkConfig?: WatermarkConfig
  exportSettings?: PDFExportSettings
  onProgress?: (progress: number) => void
  onComplete?: (blob: Blob) => void
  onError?: (error: Error) => void
  className?: string
  disabled?: boolean
}

export function HTMLToPDFExporter({
  htmlContent,
  watermarkConfig,
  exportSettings,
  onProgress,
  onComplete,
  onError,
  className = '',
  disabled = false
}: HTMLToPDFExporterProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleExport = async () => {
    if (!htmlContent.trim()) {
      onError?.(new Error('HTML内容不能为空'))
      return
    }

    try {
      setIsExporting(true)
      setProgress(0)
      onProgress?.(0)

      // 准备请求数据
      const requestData = {
        html: htmlContent,
        watermarkConfig: watermarkConfig || { enabled: false },
        styleConfig: {
          pageWidth: exportSettings?.pageWidth || 794,
          pageHeight: exportSettings?.pageHeight || 1123,
          orientation: exportSettings?.orientation || 'portrait',
          scale: exportSettings?.scale || 2
        },
        metadata: {
          title: exportSettings?.filename || '店铺IP方案'
        }
      }

      setProgress(20)
      onProgress?.(20)

      // 调用导出API
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      setProgress(60)
      onProgress?.(60)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'PDF导出失败')
      }

      // 获取文件流
      const blob = await response.blob()
      
      setProgress(90)
      onProgress?.(90)

      // 触发下载
      const filename = `${exportSettings?.filename || '店铺IP方案'}_${new Date().toISOString().slice(0, 10)}.pdf`
      saveAs(blob, filename)

      setProgress(100)
      onProgress?.(100)
      onComplete?.(blob)

    } catch (error) {
      console.error('PDF导出失败:', error)
      onError?.(error as Error)
    } finally {
      setIsExporting(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  return (
    <div className={`pdf-exporter ${className}`}>
      <button
        onClick={handleExport}
        disabled={isExporting || disabled || !htmlContent.trim()}
        className={`export-button pdf-export ${isExporting ? 'exporting' : ''}`}
        style={{
          padding: '12px 24px',
          backgroundColor: isExporting ? '#6b7280' : '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: isExporting || disabled ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'all 0.2s',
          opacity: disabled ? 0.5 : 1
        }}
      >
        {isExporting ? `导出中... ${progress}%` : '导出为PDF'}
      </button>
      
      {isExporting && (
        <div className="export-progress" style={{ marginTop: '8px' }}>
          <div 
            style={{
              width: '100%',
              height: '4px',
              backgroundColor: '#e5e7eb',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <div 
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#dc2626',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            {progress < 20 && '准备导出...'}
            {progress >= 20 && progress < 60 && '处理HTML内容...'}
            {progress >= 60 && progress < 90 && '生成PDF文档...'}
            {progress >= 90 && '下载文件...'}
          </div>
        </div>
      )}
    </div>
  )
}