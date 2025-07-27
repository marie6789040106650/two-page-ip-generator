# 工作区2: API集成和内容生成 - 详细规格说明

## 🎯 工作区职责
本工作区负责保持原项目的内容生成逻辑，确保API返回Markdown格式，并优化内容生成流程和Banner图片生成功能。

## 📋 核心任务清单

### 1. API服务集成 (优先级: 高)
- [ ] 复用原项目的内容生成API逻辑
- [ ] 确保API返回标准Markdown格式
- [ ] 实现流式内容生成支持
- [ ] 优化API响应时间和错误处理

### 2. 内容生成引擎 (优先级: 高)
- [ ] 保持原项目的方案生成算法
- [ ] 实现Banner图片生成功能
- [ ] 添加内容质量检查机制
- [ ] 支持多种内容模板

### 3. 数据处理优化 (优先级: 中)
- [ ] 实现智能数据预处理
- [ ] 添加内容缓存机制
- [ ] 优化大数据量处理
- [ ] 实现内容版本管理

## 🏗️ 技术架构

### 服务结构
```
workspace-2-api-content/
├── app/
│   └── api/                         # API路由
│       ├── generate-content/
│       │   └── route.ts
│       ├── generate-banner/
│       │   └── route.ts
│       ├── keyword-expansion/
│       │   └── route.ts
│       └── health/
│           └── route.ts
├── services/                        # 业务服务
│   ├── content-generation-service.ts
│   ├── banner-generation-service.ts
│   ├── template-service.ts
│   ├── cache-service.ts
│   └── quality-check-service.ts
├── lib/                            # 核心库
│   ├── ai-client.ts
│   ├── content-processor.ts
│   ├── markdown-generator.ts
│   ├── image-generator.ts
│   └── api-utils.ts
├── templates/                      # 内容模板
│   ├── ip-plan-templates.json
│   ├── banner-templates.json
│   ├── prompt-templates.json
│   └── style-templates.json
├── middleware/                     # 中间件
│   ├── auth-middleware.ts
│   ├── rate-limit-middleware.ts
│   ├── validation-middleware.ts
│   └── error-handler-middleware.ts
├── types/                          # 类型定义
│   ├── api-types.ts
│   ├── content-types.ts
│   ├── generation-types.ts
│   └── template-types.ts
└── utils/                          # 工具函数
    ├── validation-utils.ts
    ├── format-utils.ts
    ├── cache-utils.ts
    └── error-utils.ts
```

### 技术栈
- **框架**: Next.js 14+ API Routes
- **AI集成**: OpenAI API / Claude API
- **图片生成**: DALL-E / Midjourney API
- **缓存**: Redis / Memory Cache
- **数据库**: PostgreSQL / MongoDB
- **队列**: Bull Queue / Agenda

## 📦 核心功能实现

### 1. 内容生成API
```typescript
// app/api/generate-content/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ContentGenerationService } from '@/services/content-generation-service'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    
    // 验证输入数据
    const validatedData = validateFormData(formData)
    
    // 生成内容
    const content = await ContentGenerationService.generateContent(validatedData)
    
    // 返回Markdown格式
    return NextResponse.json({
      success: true,
      content: content.markdown,
      metadata: {
        wordCount: content.wordCount,
        generatedAt: new Date().toISOString(),
        template: content.template
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
```

### 2. 内容生成服务
```typescript
// services/content-generation-service.ts
export class ContentGenerationService {
  private static aiClient = new AIClient()
  private static templateService = new TemplateService()
  private static cacheService = new CacheService()

  static async generateContent(formData: FormData): Promise<GeneratedContent> {
    // 检查缓存
    const cacheKey = this.generateCacheKey(formData)
    const cached = await this.cacheService.get(cacheKey)
    if (cached) return cached

    // 选择合适的模板
    const template = await this.templateService.selectTemplate(formData)
    
    // 构建提示词
    const prompt = this.buildPrompt(formData, template)
    
    // 调用AI生成内容
    const rawContent = await this.aiClient.generateContent(prompt)
    
    // 处理和格式化内容
    const processedContent = await this.processContent(rawContent, formData)
    
    // 转换为Markdown格式
    const markdown = this.convertToMarkdown(processedContent)
    
    // 质量检查
    const qualityScore = await this.checkQuality(markdown)

    const result = {
      markdown,
      wordCount: this.countWords(markdown),
      qualityScore,
      template: template.id,
      generatedAt: new Date().toISOString()
    }

    // 缓存结果
    await this.cacheService.set(cacheKey, result, 3600) // 1小时缓存
    
    return result
  }

  private static convertToMarkdown(content: ProcessedContent): string {
    // 将处理后的内容转换为标准Markdown格式
    let markdown = `# ${content.title}\n\n`
    
    content.sections.forEach(section => {
      markdown += `## ${section.title}\n\n`
      markdown += `${section.content}\n\n`
      
      if (section.subsections) {
        section.subsections.forEach(subsection => {
          markdown += `### ${subsection.title}\n\n`
          markdown += `${subsection.content}\n\n`
        })
      }
    })
    
    return markdown
  }
}
```

### 3. Banner生成服务
```typescript
// services/banner-generation-service.ts
export class BannerGenerationService {
  private static imageClient = new ImageGenerationClient()
  private static templateService = new TemplateService()

  static async generateBanner(
    content: string, 
    formData: FormData
  ): Promise<BannerResult> {
    // 分析内容提取关键信息
    const keyInfo = this.extractKeyInformation(content, formData)
    
    // 选择Banner模板
    const template = await this.templateService.selectBannerTemplate(keyInfo)
    
    // 构建图片生成提示
    const imagePrompt = this.buildImagePrompt(keyInfo, template)
    
    // 生成图片
    const imageUrl = await this.imageClient.generateImage(imagePrompt)
    
    // 添加文字叠加
    const finalBanner = await this.addTextOverlay(imageUrl, keyInfo, template)

    return {
      imageUrl: finalBanner,
      prompt: imagePrompt,
      template: template.id,
      generatedAt: new Date().toISOString()
    }
  }
}
```

## 🔧 开发规范

### API设计规范
- 遵循RESTful API设计原则
- 统一的错误响应格式
- 完整的请求/响应类型定义
- API版本控制支持

### 数据格式规范
```typescript
// 标准API响应格式
interface APIResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  metadata?: {
    timestamp: string
    requestId: string
    version: string
  }
}

// Markdown内容格式
interface MarkdownContent {
  content: string
  metadata: {
    title: string
    wordCount: number
    sections: string[]
    generatedAt: string
    template: string
  }
}
```

## 🔄 与其他工作区的接口

### 数据接口
```typescript
// 接收工作区1的表单数据
interface FormDataFromUI {
  storeName: string
  storeCategory: string
  storeLocation: string
  businessDuration: string
  storeFeatures: string
  ownerName: string
  ownerFeatures: string
}

// 向工作区3提供Markdown内容
interface MarkdownToRenderer {
  content: string
  metadata: ContentMetadata
  bannerUrl?: string
}
```

## 📅 开发时间线

### 第1周: API基础架构
- Day 1-2: 设置API路由和基础服务
- Day 3-4: 集成AI客户端和模板系统
- Day 5-7: 实现基础内容生成功能

### 第2周: 功能完善
- Day 8-10: 实现Banner生成功能
- Day 11-12: 添加缓存和优化机制
- Day 13-14: 实现质量检查和错误处理

### 第3周: 测试和优化
- Day 15-17: API测试和性能优化
- Day 18-19: 集成测试和错误修复
- Day 20-21: 文档完善和部署准备

## ✅ 验收标准

### 功能验收
- [ ] 内容生成API正常工作
- [ ] Banner生成API正常工作
- [ ] 返回标准Markdown格式
- [ ] 缓存机制正常工作
- [ ] 错误处理完善

### 质量验收
- [ ] API响应时间符合要求
- [ ] 内容质量达到标准
- [ ] 并发处理能力达标
- [ ] 错误率控制在范围内

## 🚀 部署和监控

### 部署配置
```json
{
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "next build",
    "start": "next start",
    "test": "jest"
  }
}
```

---
**工作区2准备就绪，等待开发团队接手！** 🤖