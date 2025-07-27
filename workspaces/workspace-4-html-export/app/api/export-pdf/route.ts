import { NextRequest, NextResponse } from 'next/server'
import { PDFExportEngine } from '@/engines/pdf-export-engine'
import { z } from 'zod'

// 请求数据验证模式
const requestSchema = z.object({
  html: z.string().min(1),
  watermarkConfig: z.object({
    enabled: z.boolean(),
    text: z.string().optional(),
    opacity: z.number().optional(),
    fontSize: z.number().optional(),
    color: z.string().optional(),
    rotation: z.number().optional(),
  }).optional(),
  styleConfig: z.object({
    pageWidth: z.number().optional(),
    pageHeight: z.number().optional(),
    margins: z.object({
      top: z.number(),
      right: z.number(),
      bottom: z.number(),
      left: z.number(),
    }).optional(),
  }).optional(),
  metadata: z.object({
    title: z.string().optional(),
    wordCount: z.number().optional(),
  }).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证请求数据
    const validatedData = requestSchema.parse(body)
    
    console.log('Received export request for PDF document')
    
    // 创建PDF导出引擎
    const exportEngine = new PDFExportEngine()
    
    // 导出为PDF文档
    const result = await exportEngine.exportToPDF({
      html: validatedData.html,
      watermarkConfig: validatedData.watermarkConfig,
      styleConfig: validatedData.styleConfig,
      metadata: validatedData.metadata,
    })
    
    // 返回文件流
    return new NextResponse(result.buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${result.filename}"`,
        'Content-Length': result.buffer.length.toString(),
      },
    })
    
  } catch (error) {
    console.error('PDF export error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: '请求数据格式错误',
        details: error.errors
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'PDF导出失败'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'PDF导出API',
    workspace: 'workspace-4-html-export',
    endpoint: 'POST /api/export-pdf',
    description: '将HTML内容导出为PDF文档'
  })
}