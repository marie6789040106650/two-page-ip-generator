interface BannerGenerationRequest {
  storeName: string
  storeCategory: string
  storeLocation: string
  storeFeatures: string
  ownerName: string
  ownerFeatures: string
}

interface BannerResult {
  imageUrl: string
  prompt: string
  template: string
  generatedAt: string
}

export class BannerGenerationService {
  private static apiKey = process.env.OPENAI_API_KEY || ''
  private static useMockMode = !BannerGenerationService.apiKey || BannerGenerationService.apiKey === 'mock-api-key'

  static async generateBanner(formData: BannerGenerationRequest): Promise<BannerResult> {
    try {
      // 分析内容提取关键信息
      const keyInfo = this.extractKeyInformation(formData)
      
      // 构建图片生成提示
      const imagePrompt = this.buildImagePrompt(keyInfo)
      
      if (this.useMockMode) {
        console.log('Using mock mode for banner generation')
        return this.generateMockBanner(imagePrompt)
      }

      // 真实AI图片生成
      const imageUrl = await this.generateRealBanner(imagePrompt)
      
      return {
        imageUrl,
        prompt: imagePrompt,
        template: 'ai-generated',
        generatedAt: new Date().toISOString()
      }
      
    } catch (error) {
      console.error('Banner generation failed:', error)
      
      // 回退到模拟Banner
      const imagePrompt = this.buildImagePrompt(this.extractKeyInformation(formData))
      return this.generateMockBanner(imagePrompt)
    }
  }

  private static extractKeyInformation(formData: BannerGenerationRequest) {
    return {
      storeName: formData.storeName,
      category: formData.storeCategory,
      location: formData.storeLocation,
      features: formData.storeFeatures.split('，').slice(0, 3), // 取前3个特色
      ownerStyle: formData.ownerFeatures,
      theme: this.determineTheme(formData.storeCategory)
    }
  }

  private static determineTheme(category: string): string {
    const themeMap: { [key: string]: string } = {
      '餐饮': 'warm-food',
      '零售': 'modern-retail',
      '服务': 'professional-service',
      '美容': 'elegant-beauty',
      '教育': 'friendly-education',
      '健身': 'energetic-fitness'
    }
    
    return themeMap[category] || 'business-professional'
  }

  private static buildImagePrompt(keyInfo: any): string {
    return `Create a professional banner for "${keyInfo.storeName}", a ${keyInfo.category} business. 
Style: ${keyInfo.theme}, modern, clean design. 
Features: ${keyInfo.features.join(', ')}. 
Colors: warm and inviting, suitable for ${keyInfo.category} business. 
Include the store name prominently. 
Size: 1200x400 pixels, suitable for social media and website headers.`
  }

  private static async generateRealBanner(prompt: string): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1792x1024',
          quality: 'standard',
          response_format: 'url'
        }),
      })

      if (!response.ok) {
        throw new Error(`Image generation API failed: ${response.status}`)
      }

      const data = await response.json()
      const imageUrl = data.data?.[0]?.url

      if (!imageUrl) {
        throw new Error('No image URL returned from API')
      }

      return imageUrl
      
    } catch (error) {
      console.error('Real banner generation failed:', error)
      throw error
    }
  }

  private static generateMockBanner(prompt: string): BannerResult {
    // 生成模拟Banner URL（使用占位符服务）
    const mockImageUrl = `https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=${encodeURIComponent('店铺Banner')}`
    
    return {
      imageUrl: mockImageUrl,
      prompt: prompt,
      template: 'mock-template',
      generatedAt: new Date().toISOString()
    }
  }

  static async checkHealth(): Promise<boolean> {
    try {
      if (this.useMockMode) {
        return true
      }
      
      // 简单的健康检查 - 尝试生成一个小图片
      const testResponse = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      })
      
      return testResponse.ok
    } catch (error) {
      console.error('Banner service health check failed:', error)
      return false
    }
  }
}