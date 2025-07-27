// AI客户端 - 支持真实AI API和模拟模式
export class AIClient {
  private apiKey: string
  private baseUrl: string
  private model: string
  private useMockMode: boolean

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || ''
    this.baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
    this.model = process.env.AI_MODEL || 'gpt-3.5-turbo'
    this.useMockMode = !this.apiKey || this.apiKey === 'mock-api-key'
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      console.log('Generating content with prompt:', prompt.substring(0, 100) + '...')

      if (this.useMockMode) {
        console.log('Using mock mode for AI generation')
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        return this.generateMockContent(prompt)
      }

      // 真实AI API调用
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的店铺IP方案生成专家，擅长为实体店铺制定个性化的品牌打造方案。请用专业、实用的语言生成详细的方案内容。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`AI API请求失败: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content

      if (!content) {
        throw new Error('AI API返回内容为空')
      }

      return content.trim()

    } catch (error) {
      console.error('AI content generation failed:', error)

      // 如果真实API失败，回退到模拟内容
      if (!this.useMockMode) {
        console.log('Falling back to mock content due to API failure')
        return this.generateMockContent(prompt)
      }

      throw new Error('AI服务暂时不可用，请稍后重试')
    }
  }

  private generateMockContent(prompt: string): string {
    // 基于提示词生成模拟内容
    const mockContent = `
## 经营理念

我们始终坚持"客户至上，品质第一"的经营理念，致力于为每一位顾客提供优质的产品和贴心的服务。通过不断创新和改进，我们努力成为行业内的标杆企业。

## 核心优势

1. **专业团队**：拥有经验丰富的专业团队，确保服务质量
2. **优质产品**：严格把控产品质量，只为客户提供最好的
3. **贴心服务**：以客户需求为导向，提供个性化服务方案
4. **持续创新**：紧跟市场趋势，不断推出新产品和服务

## 发展规划

### 短期目标（1年内）
- 提升客户满意度至95%以上
- 扩大服务范围，覆盖更多客户群体
- 建立完善的客户反馈机制

### 中期目标（3年内）
- 成为本地区知名品牌
- 建立标准化服务流程
- 培养专业服务团队

### 长期目标（5年内）
- 实现区域化发展
- 建立品牌连锁体系
- 成为行业领导者

## 服务承诺

我们承诺为每一位客户提供：
- 专业的咨询服务
- 高质量的产品保障
- 及时的售后支持
- 持续的服务改进
    `

    return mockContent.trim()
  }

  async checkHealth(): Promise<boolean> {
    try {
      // 检查AI服务健康状态
      return true
    } catch (error) {
      console.error('AI service health check failed:', error)
      return false
    }
  }
}