'use client'

import { useState } from 'react'
import { HTMLToWordExporter } from './html-to-word-exporter'
import { HTMLToPDFExporter } from './html-to-pdf-exporter'
import { BatchExporter } from './batch-exporter'

interface WatermarkConfig {
  enabled: boolean
  text?: string
  opacity?: number
  fontSize?: number
  color?: string
  rotation?: number
  repeat?: boolean
}

interface ExportManagerProps {
  htmlContent: string
  watermarkConfig?: WatermarkConfig
  filename?: string
  className?: string
}

type ExportMode = 'single' | 'batch'
type ExportFormat = 'word' | 'pdf' | 'both'

export function ExportManager({
  htmlContent,
  watermarkConfig,
  filename = '店铺IP方案',
  className = ''
}: ExportManagerProps) {
  const [exportMode, setExportMode] = useState<ExportMode>('single')
  const [exportFormat, setExportFormat] = useState<ExportFormat>('both')
  const [isExporting, setIsExporting] = useState(false)
  const [exportResults, setExportResults] = useState<any[]>([])

  const handleExportStart = () => {
    setIsExporting(true)
    setExportResults([])
  }

  const handleExportComplete = (result: any) => {
    setExportResults(prev => [...prev, result])
    setIsExporting(false)
  }

  const handleExportError = (error: Error) => {
    console.error('导出失败:', error)
    setIsExporting(false)
    // 这里可以添加错误提示UI
  }

  const getBatchItems = () => {
    const items = []
    
    if (exportFormat === 'word' || exportFormat === 'both') {
      items.push({
        id: 'word-export',
        htmlContent,
        filename,
        format: 'word' as const,
        watermarkConfig
      })
    }
    
    if (exportFormat === 'pdf' || exportFormat === 'both') {
      items.push({
        id: 'pdf-export',
        htmlContent,
        filename,
        format: 'pdf' as const,
        watermarkConfig
      })
    }
    
    return items
  }

  return (
    <div className={`export-manager ${className}`}>
      {/* 导出模式选择 */}
      <div className="export-mode-selector" style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          导出模式
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setExportMode('single')}
            className={exportMode === 'single' ? 'active' : ''}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: exportMode === 'single' ? '#3b82f6' : 'white',
              color: exportMode === 'single' ? 'white' : '#374151',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            单独导出
          </button>
          <button
            onClick={() => setExportMode('batch')}
            className={exportMode === 'batch' ? 'active' : ''}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: exportMode === 'batch' ? '#3b82f6' : 'white',
              color: exportMode === 'batch' ? 'white' : '#374151',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            批量导出
          </button>
        </div>
      </div>

      {/* 格式选择 */}
      <div className="format-selector" style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          导出格式
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setExportFormat('word')}
            className={exportFormat === 'word' ? 'active' : ''}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: exportFormat === 'word' ? '#3b82f6' : 'white',
              color: exportFormat === 'word' ? 'white' : '#374151',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            仅Word
          </button>
          <button
            onClick={() => setExportFormat('pdf')}
            className={exportFormat === 'pdf' ? 'active' : ''}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: exportFormat === 'pdf' ? '#dc2626' : 'white',
              color: exportFormat === 'pdf' ? 'white' : '#374151',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            仅PDF
          </button>
          <button
            onClick={() => setExportFormat('both')}
            className={exportFormat === 'both' ? 'active' : ''}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: exportFormat === 'both' ? '#059669' : 'white',
              color: exportFormat === 'both' ? 'white' : '#374151',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Word + PDF
          </button>
        </div>
      </div>

      {/* 水印配置显示 */}
      {watermarkConfig?.enabled && (
        <div className="watermark-info" style={{ 
          marginBottom: '16px',
          padding: '8px 12px',
          backgroundColor: '#f3f4f6',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <div style={{ fontWeight: '500', marginBottom: '4px' }}>水印配置</div>
          <div>文本: {watermarkConfig.text}</div>
          <div>透明度: {(watermarkConfig.opacity || 0.1) * 100}%</div>
          <div>旋转: {watermarkConfig.rotation || -45}°</div>
        </div>
      )}

      {/* 导出按钮区域 */}
      <div className="export-buttons" style={{ marginBottom: '16px' }}>
        {exportMode === 'single' ? (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(exportFormat === 'word' || exportFormat === 'both') && (
              <HTMLToWordExporter
                htmlContent={htmlContent}
                watermarkConfig={watermarkConfig}
                exportSettings={{ filename }}
                onProgress={() => {}}
                onComplete={handleExportComplete}
                onError={handleExportError}
                disabled={isExporting}
              />
            )}
            {(exportFormat === 'pdf' || exportFormat === 'both') && (
              <HTMLToPDFExporter
                htmlContent={htmlContent}
                watermarkConfig={watermarkConfig}
                exportSettings={{ filename }}
                onProgress={() => {}}
                onComplete={handleExportComplete}
                onError={handleExportError}
                disabled={isExporting}
              />
            )}
          </div>
        ) : (
          <BatchExporter
            items={getBatchItems()}
            onProgress={(progress, current) => {
              console.log(`批量导出进度: ${progress}%, 当前: ${current}`)
            }}
            onComplete={(results) => {
              console.log('批量导出完成:', results)
              setExportResults(results)
              setIsExporting(false)
            }}
            onError={handleExportError}
            disabled={isExporting}
          />
        )}
      </div>

      {/* 导出状态 */}
      {exportResults.length > 0 && (
        <div className="export-results" style={{
          padding: '12px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <div style={{ fontWeight: '500', color: '#166534', marginBottom: '4px' }}>
            导出完成
          </div>
          <div style={{ color: '#15803d' }}>
            成功导出 {exportResults.filter(r => r.success || r).length} 个文件
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="export-help" style={{
        marginTop: '16px',
        padding: '8px 12px',
        backgroundColor: '#fef3c7',
        border: '1px solid #fcd34d',
        borderRadius: '4px',
        fontSize: '11px',
        color: '#92400e'
      }}>
        <div style={{ fontWeight: '500', marginBottom: '4px' }}>💡 使用提示</div>
        <div>• 导出的文档将保持与预览相同的水印效果</div>
        <div>• 批量导出会自动打包为ZIP文件</div>
        <div>• 大文档导出可能需要较长时间，请耐心等待</div>
      </div>
    </div>
  )
}