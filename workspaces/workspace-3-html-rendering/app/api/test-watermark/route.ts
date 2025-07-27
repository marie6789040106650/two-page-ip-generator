import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const testContent = `# 测试店铺IP方案

## 店铺概况

这是一个测试的店铺IP方案，用于验证水印系统功能。

### 主要特色

- 专业的Word样式渲染
- 可自定义的水印系统
- 多种主题选择
- 响应式设计

## 经营理念

我们始终坚持"客户至上，品质第一"的经营理念，致力于为每一位顾客提供优质的产品和贴心的服务。

### 核心价值

1. **诚信经营** - 以诚待客，建立信任
2. **品质保证** - 严格把控，确保质量
3. **服务至上** - 用心服务，超越期待
4. **持续创新** - 不断改进，追求卓越

## 发展规划

### 短期目标
- 提升客户满意度
- 扩大服务范围
- 优化运营流程

### 长期愿景
- 成为行业标杆
- 建立品牌影响力
- 实现可持续发展

---
*本方案由店铺IP生成器自动生成*`

  return NextResponse.json({
    success: true,
    content: testContent,
    metadata: {
      title: '测试店铺IP方案',
      wordCount: testContent.length,
      sections: ['店铺概况', '经营理念', '发展规划'],
      generatedAt: new Date().toISOString(),
      template: 'test'
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { watermarkConfig, content } = body

    // 模拟水印处理
    const processedContent = {
      html: content,
      watermarkApplied: watermarkConfig.enabled,
      watermarkText: watermarkConfig.text,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: processedContent,
      message: '水印处理完成'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '水印处理失败'
    }, { status: 500 })
  }
}