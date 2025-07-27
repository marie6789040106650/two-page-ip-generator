import { NextRequest, NextResponse } from 'next/server'
import { FormData } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json()
    
    // 验证必填字段
    const requiredFields = ['storeName', 'storeCategory', 'storeLocation', 'storeFeatures', 'ownerName', 'ownerFeatures']
    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        return NextResponse.json(
          { error: `缺少必填字段: ${field}` },
          { status: 400 }
        )
      }
    }

    // 模拟内容生成 (这里可以集成实际的AI服务)
    const generatedContent = generateMockContent(formData)
    
    return NextResponse.json({
      success: true,
      content: generatedContent,
      metadata: {
        generatedAt: new Date().toISOString(),
        formData: formData
      }
    })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: '内容生成失败，请重试' },
      { status: 500 }
    )
  }
}

// 模拟内容生成函数
function generateMockContent(formData: FormData): string {
  return `# ${formData.storeName} - 老板IP打造方案

## 店铺基本信息
- **店铺名称**: ${formData.storeName}
- **店铺品类**: ${formData.storeCategory}
- **店铺位置**: ${formData.storeLocation}
- **经营时长**: ${formData.businessDuration}

## 店铺特色分析
${formData.storeFeatures}

## 老板个人IP
- **老板姓氏**: ${formData.ownerName}老板
- **个人特色**: ${formData.ownerFeatures}

## IP打造建议
基于以上信息，我们为您量身定制了专属的老板IP打造方案...

*此为示例内容，实际使用时将集成AI服务生成个性化内容*`
}