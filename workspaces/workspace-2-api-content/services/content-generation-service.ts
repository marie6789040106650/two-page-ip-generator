import { TemplateService } from './template-service'
import { CacheService } from './cache-service'
import { BannerGenerationService } from './banner-generation-service'
import { AIClient } from '@/lib/ai-client'
import { MarkdownGenerator } from '@/lib/markdown-generator'

interface FormData {
  storeName: string
  storeCategory: string
  storeLocation: string
  businessDuration: string
  storeFeatures: string
  ownerName: string
  ownerFeatures: string
}

interface GeneratedContent {
  markdown: string
  wordCount: number
  qualityScore: number
  template: string
  generatedAt: string
  bannerUrl?: string
}

export class ContentGenerationService {
  private static aiClient = new AIClient()
  private static templateService = new TemplateService()
  private static cacheService = new CacheService()
  private static markdownGenerator = new MarkdownGenerator()

  static async generateContent(formData: FormData): Promise<GeneratedContent> {
    try {
      // 生成缓存键
      const cacheKey = this.generateCacheKey(formData)
      
      // 检查缓存
      const cached = await CacheService.get(cacheKey)
      if (cached) {
        console.log('Content found in cache')
        return cached
      }

      // 选择合适的模板
      const template = await TemplateService.selectTemplate(formData)
      console.log('Selected template:', template.id)

      // 构建提示词
      const prompt = this.buildPrompt(formData, template)
      
      // 调用AI生成内容
      const rawContent = await ContentGenerationService.aiClient.generateContent(prompt)
      
      // 处理和格式化内容
      const processedContent = this.processContent(rawContent, formData)
      
      // 转换为Markdown格式
      const markdown = ContentGenerationService.markdownGenerator.convertToMarkdown(processedContent)
      
      // 质量检查
      const qualityScore = ContentGenerationService.checkQuality(markdown)

      // 生成Banner（并行执行）
      let bannerUrl: string | undefined
      try {
        const bannerResult = await BannerGenerationService.generateBanner(formData)
        bannerUrl = bannerResult.imageUrl
        console.log('Banner generated successfully:', bannerUrl)
      } catch (error) {
        console.error('Banner generation failed, continuing without banner:', error)
      }
      
      const result: GeneratedContent = {
        markdown,
        wordCount: ContentGenerationService.countWords(markdown),
        qualityScore,
        template: template.id,
        generatedAt: new Date().toISOString(),
        bannerUrl
      }

      // 缓存结果
      await CacheService.set(cacheKey, result, 3600) // 1小时缓存
      
      return result
      
    } catch (error) {
      console.error('Content generation failed:', error)
      
      // 返回备用内容
      return ContentGenerationService.generateFallbackContent(formData)
    }
  }

  private static generateCacheKey(formData: FormData): string {
    const key = Object.values(formData).join('|')
    return `content:${Buffer.from(key).toString('base64')}`
  }

  private static buildPrompt(formData: FormData, template: any): string {
    return template.prompt
      .replace('{{storeName}}', formData.storeName)
      .replace('{{storeCategory}}', formData.storeCategory)
      .replace('{{storeLocation}}', formData.storeLocation)
      .replace('{{businessDuration}}', formData.businessDuration)
      .replace('{{storeFeatures}}', formData.storeFeatures)
      .replace('{{ownerName}}', formData.ownerName)
      .replace('{{ownerFeatures}}', formData.ownerFeatures)
  }

  private static processContent(rawContent: string, formData: FormData): any {
    // 处理AI生成的原始内容
    const sections = [
      {
        title: '店铺概况',
        content: `${formData.storeName}是一家位于${formData.storeLocation}的${formData.storeCategory}店铺，已经营${formData.businessDuration}。${formData.storeFeatures}`
      },
      {
        title: '店主介绍',
        content: `店主${formData.ownerName}，${formData.ownerFeatures}`
      },
      {
        title: '经营理念',
        content: rawContent.includes('经营理念') ? 
          rawContent.split('经营理念')[1]?.split('\n')[0] || '以客户为中心，提供优质服务' :
          '以客户为中心，提供优质服务'
      },
      {
        title: '发展规划',
        content: rawContent.includes('发展规划') ? 
          rawContent.split('发展规划')[1]?.split('\n')[0] || '持续创新，扩大市场影响力' :
          '持续创新，扩大市场影响力'
      }
    ]

    return {
      title: `${formData.storeName} - 店铺IP方案`,
      sections
    }
  }

  private static checkQuality(markdown: string): number {
    // 简单的质量评分算法
    let score = 0
    
    // 检查长度
    if (markdown.length > 500) score += 20
    if (markdown.length > 1000) score += 20
    
    // 检查结构
    const headingCount = (markdown.match(/^#+/gm) || []).length
    score += Math.min(headingCount * 10, 30)
    
    // 检查内容丰富度
    const paragraphCount = (markdown.match(/\n\n/g) || []).length
    score += Math.min(paragraphCount * 5, 30)
    
    return Math.min(score, 100)
  }

  private static countWords(text: string): number {
    // 中英文字符计数
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length
    return chineseChars + englishWords
  }

  private static generateFallbackContent(formData: FormData): GeneratedContent {
    // 备用内容生成
    const markdown = `# ${formData.storeName} - 店铺IP方案

## 店铺概况

${formData.storeName}是一家位于${formData.storeLocation}的${formData.storeCategory}店铺，已经营${formData.businessDuration}。

### 店铺特色
${formData.storeFeatures}

## 店主介绍

店主${formData.ownerName}，${formData.ownerFeatures}

## 经营理念

以客户为中心，提供优质的产品和服务，致力于成为本地区最受欢迎的${formData.storeCategory}店铺。

## 发展规划

1. 持续优化产品质量和服务水平
2. 扩大品牌知名度和市场影响力
3. 建立完善的客户服务体系
4. 探索新的经营模式和发展机会

---
*本方案由店铺IP生成器自动生成*`

    return {
      markdown,
      wordCount: ContentGenerationService.countWords(markdown),
      qualityScore: 75,
      template: 'fallback',
      generatedAt: new Date().toISOString(),
      bannerUrl: `https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=${encodeURIComponent(formData.storeName + ' Banner')}`
    }
  }
}