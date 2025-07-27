import { NextRequest, NextResponse } from 'next/server'
import { FormData } from '@/types/form-types'

export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json()

    // 验证表单数据 - 确保所有7个字段都存在且不为空
    const requiredFields = [
      'storeName', 'storeCategory', 'storeLocation',
      'businessDuration', 'storeFeatures', 'ownerName', 'ownerFeatures'
    ]

    const missingFields = requiredFields.filter(field => {
      const value = formData[field as keyof FormData]
      if (!value) return true
      if (Array.isArray(value)) return value.length === 0 || value.every(v => v.trim() === '')
      return value.trim() === ''
    })

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `缺少必要的表单数据: ${missingFields.join(', ')}`,
          missingFields
        },
        { status: 400 }
      )
    }

    // 调用工作区2的API
    const workspace2Response = await fetch('http://localhost:3002/api/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (!workspace2Response.ok) {
      throw new Error(`工作区2 API调用失败: ${workspace2Response.status}`)
    }

    const generatedContent = await workspace2Response.json()

    // 返回生成的内容
    return NextResponse.json({
      success: true,
      data: generatedContent,
      timestamp: new Date().toISOString(),
      source: 'workspace-1-ui-form'
    })

  } catch (error) {
    console.error('API Error:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '内容生成失败',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}