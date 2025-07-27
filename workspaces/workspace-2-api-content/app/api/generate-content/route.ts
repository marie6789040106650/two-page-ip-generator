import { NextRequest, NextResponse } from 'next/server'
import { ContentGenerationService } from '@/services/content-generation-service'
import { z } from 'zod'

// 请求数据验证模式
const requestSchema = z.object({
  storeName: z.string().min(1),
  storeCategory: z.string().min(1),
  storeLocation: z.string().min(1),
  businessDuration: z.string().min(1),
  storeFeatures: z.string().min(1),
  ownerName: z.string().min(1),
  ownerFeatures: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证请求数据
    const validatedData = requestSchema.parse(body)
    
    console.log('Received form data:', validatedData)
    
    // 生成内容
    const result = await ContentGenerationService.generateContent(validatedData)
    
    return NextResponse.json({
      success: true,
      content: result.markdown,
      bannerUrl: result.bannerUrl,
      metadata: {
        wordCount: result.wordCount,
        generatedAt: result.generatedAt,
        template: result.template,
        qualityScore: result.qualityScore
      }
    })
    
  } catch (error) {
    console.error('Content generation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: '请求数据格式错误',
        details: error.errors
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '内容生成失败'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: '内容生成API',
    workspace: 'workspace-2-api-content',
    endpoints: {
      'POST /api/generate-content': '生成店铺IP内容',
      'GET /api/health': '健康检查'
    }
  })
}