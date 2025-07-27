import { NextRequest, NextResponse } from 'next/server'
import { BannerGenerationService } from '@/services/banner-generation-service'
import { z } from 'zod'

// 请求数据验证模式
const requestSchema = z.object({
  storeName: z.string().min(1),
  storeCategory: z.string().min(1),
  storeLocation: z.string().min(1),
  storeFeatures: z.string().min(1),
  ownerName: z.string().min(1),
  ownerFeatures: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证请求数据
    const validatedData = requestSchema.parse(body)
    
    console.log('Generating banner for:', validatedData.storeName)
    
    // 生成Banner
    const result = await BannerGenerationService.generateBanner(validatedData)
    
    return NextResponse.json({
      success: true,
      banner: result,
      metadata: {
        generatedAt: result.generatedAt,
        template: result.template
      }
    })
    
  } catch (error) {
    console.error('Banner generation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: '请求数据格式错误',
        details: error.errors
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Banner生成失败'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Banner生成API',
    workspace: 'workspace-2-api-content',
    description: '为店铺生成专业的Banner图片'
  })
}