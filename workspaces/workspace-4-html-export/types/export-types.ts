// 水印配置接口 - 与工作区3完全一致
export interface WatermarkConfig {
  enabled: boolean
  text: string
  opacity: number
  fontSize: number
  rotation: number
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  repeat: 'none' | 'diagonal' | 'grid'
  color: 'gray' | 'red' | 'blue' | 'black'
}

// 样式配置接口
export interface StyleConfig {
  pageWidth?: number
  pageHeight?: number
  margins?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  fontFamily?: string
  fontSize?: number
  lineHeight?: number
}

// 文档元数据接口
export interface DocumentMetadata {
  title?: string
  author?: string
  subject?: string
  creator?: string
  wordCount?: number
  pageCount?: number
  generatedAt?: string
}

// 导出选项接口
export interface ExportOptions {
  html: string
  watermarkConfig?: WatermarkConfig
  styleConfig?: StyleConfig
  metadata?: DocumentMetadata
}

// 导出结果接口
export interface ExportResult {
  buffer: Buffer
  filename: string
  metadata: {
    exportTime: number
    fileSize: number
    pageCount: number
    format: 'word' | 'pdf'
  }
}

// Word导出设置
export interface WordExportSettings {
  filename?: string
  margins?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  fontFamily?: string
  fontSize?: number
  includeWatermark?: boolean
}

// PDF导出设置
export interface PDFExportSettings {
  filename?: string
  orientation?: 'portrait' | 'landscape'
  scale?: number
  pageWidth?: number
  pageHeight?: number
  includeWatermark?: boolean
}

// 批量导出项目
export interface BatchExportItem {
  id: string
  htmlContent: string
  filename: string
  format: 'word' | 'pdf'
  watermarkConfig?: WatermarkConfig
  styleConfig?: StyleConfig
  metadata?: DocumentMetadata
}

// 批量导出结果
export interface BatchExportResult {
  id: string
  success: boolean
  blob?: Blob
  filename?: string
  error?: Error
  exportTime?: number
  fileSize?: number
}

// 导出进度事件
export interface ExportProgressEvent {
  type: 'EXPORT_START' | 'EXPORT_PROGRESS' | 'EXPORT_COMPLETE' | 'EXPORT_ERROR'
  payload: {
    progress?: number
    stage?: string
    filename?: string
    error?: Error
    result?: ExportResult | BatchExportResult
  }
}

// 导出错误类型
export enum ExportErrorType {
  PARSE_ERROR = 'PARSE_ERROR',
  CONVERSION_ERROR = 'CONVERSION_ERROR',
  WATERMARK_ERROR = 'WATERMARK_ERROR',
  FILE_GENERATION_ERROR = 'FILE_GENERATION_ERROR',
  DOWNLOAD_ERROR = 'DOWNLOAD_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

// 导出错误类
export class ExportError extends Error {
  constructor(
    public type: ExportErrorType,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ExportError'
  }
}

// API请求接口
export interface WordExportRequest {
  html: string
  watermarkConfig?: WatermarkConfig
  styleConfig?: StyleConfig
  metadata?: DocumentMetadata
}

export interface PDFExportRequest {
  html: string
  watermarkConfig?: WatermarkConfig
  styleConfig?: StyleConfig
  metadata?: DocumentMetadata
}

// API响应接口
export interface ExportResponse {
  success: boolean
  error?: string
  details?: any
}

// 健康检查响应
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy'
  services: {
    wordExport: 'active' | 'inactive' | 'error'
    pdfExport: 'active' | 'inactive' | 'error'
    watermarkProcessing: 'active' | 'inactive' | 'error'
  }
  capabilities: {
    wordFormats: string[]
    pdfFormats: string[]
    watermarkSupport: boolean
    batchExport: boolean
  }
  performance?: {
    averageWordExportTime: number
    averagePdfExportTime: number
    memoryUsage: number
    activeExports: number
  }
}