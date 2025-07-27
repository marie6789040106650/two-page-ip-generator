'use client'

import { useState } from 'react'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

interface WatermarkConfig {
  enabled: boolean
  text?: string
  opacity?: number
  fontSize?: number
  color?: string
  rotation?: number
  repeat?: boolean
}

interface BatchExportItem {
  id: string
  htmlContent: string
  filename: string
  format: 'word' | 'pdf'
  watermarkConfig?: WatermarkConfig
}

interface ExportResult {
  id: string
  success: boolean
  blob?: Blob
  filename?: string
  error?: Error
  exportTime?: number
}

interface BatchExporterProps {
  items: BatchExportItem[]
  onProgress?: (overall: number, current: string) => void
  onComplete?: (results: ExportResult[]) => void
  onError?: (error: Error, item: BatchExportItem) => void
  className?: string
  disabled?: boolean
}

export function BatchExporter({
  items,
  onProgress,
  onComplete,
  onError,
  className = '',
  disabled = false
}: BatchExporterProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [currentItem, setCurrentItem] = useState<string>('')
  const [overallProgress, setOverallProgress] = useState(0)

  const exportSingleItem = async (item: BatchExportItem): Promise<ExportResult> => {
    const startTime = Date.now()
    
    try {
      const endpoint = item.format === 'word' ? '/api/export-word' : '/api/export-pdf'
      
      const requestData = {
        html: item.htmlContent,
        watermarkConfig: item.watermarkConfig || { enabled: false },
        styleConfig: {
          pageWidth: 794,
          pageHeight: 1123,
          margins: { top: 96, right: 96, bottom: 96, left: 96 }
        },
        metadata: {
          title: item.filename
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `${item.format}导出失败`)
      }

      const blob = await response.blob()
      const extension = item.format === 'word' ? 'docx' : 'pdf'
      const filename = `${item.filename}.${extension}`

      return {
        id: item.id,
        success: true,
        blob,
        filename,
        exportTime: Date.now() - startTime
      }

    } catch (error) {
      return {
        id: item.id,
        success: false,
        error: error as Error,
        exportTime: Date.now() - startTime
      }
    }
  }

  const handleBatchExport = async () => {
    if (items.length === 0) return

    try {
      setIsExporting(true)
      setOverallProgress(0)
      const results: ExportResult[] = []

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        setCurrentItem(item.filename)
        
        const result = await exportSingleItem(item)
        results.push(result)

        if (!result.success && result.error) {
          onError?.(result.error, item)
        }

        const progress = ((i + 1) / items.length) * 100
        setOverallProgress(progress)
        onProgress?.(progress, item.filename)
      }

      // 创建ZIP文件包含所有成功导出的文件
      const successfulResults = results.filter(r => r.success && r.blob)
      
      if (successfulResults.length > 1) {
        const zip = new JSZip()
        
        successfulResults.forEach(result => {
          if (result.blob && result.filename) {
            zip.file(result.filename, result.blob)
          }
        })

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const zipFilename = `批量导出_${new Date().toISOString().slice(0, 10)}.zip`
        saveAs(zipBlob, zipFilename)
      } else if (successfulResults.length === 1) {
        // 只有一个文件时直接下载
        const result = successfulResults[0]
        if (result.blob && result.filename) {
          saveAs(result.blob, result.filename)
        }
      }

      onComplete?.(results)

    } catch (error) {
      console.error('批量导出失败:', error)
      onError?.(error as Error, items[0])
    } finally {
      setIsExporting(false)
      setCurrentItem('')
      setTimeout(() => setOverallProgress(0), 1000)
    }
  }

  const successCount = items.length
  const wordCount = items.filter(item => item.format === 'word').length
  const pdfCount = items.filter(item => item.format === 'pdf').length

  return (
    <div className={`batch-exporter ${className}`}>
      <div className="batch-info" style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '14px', color: '#374151' }}>
          准备导出 {successCount} 个文件 
          {wordCount > 0 && ` (Word: ${wordCount})`}
          {pdfCount > 0 && ` (PDF: ${pdfCount})`}
        </div>
      </div>

      <button
        onClick={handleBatchExport}
        disabled={isExporting || disabled || items.length === 0}
        className={`batch-export-button ${isExporting ? 'exporting' : ''}`}
        style={{
          padding: '12px 24px',
          backgroundColor: isExporting ? '#6b7280' : '#059669',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: isExporting || disabled ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'all 0.2s',
          opacity: disabled || items.length === 0 ? 0.5 : 1,
          width: '100%'
        }}
      >
        {isExporting 
          ? `导出中: ${currentItem} (${Math.round(overallProgress)}%)` 
          : `批量导出 (${items.length}个文件)`
        }
      </button>
      
      {isExporting && (
        <div className="batch-progress" style={{ marginTop: '12px' }}>
          <div 
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#e5e7eb',
              borderRadius: '3px',
              overflow: 'hidden'
            }}
          >
            <div 
              style={{
                width: `${overallProgress}%`,
                height: '100%',
                backgroundColor: '#059669',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#6b7280', 
            marginTop: '6px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>正在导出: {currentItem}</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div style={{ 
          fontSize: '12px', 
          color: '#9ca3af', 
          textAlign: 'center',
          marginTop: '8px'
        }}>
          没有可导出的文件
        </div>
      )}
    </div>
  )
}