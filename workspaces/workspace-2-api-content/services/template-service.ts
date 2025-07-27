interface Template {
  id: string
  name: string
  category: string
  prompt: string
  priority: number
}

export class TemplateService {
  private static templates: Template[] = [
    {
      id: 'restaurant-template',
      name: '餐饮店铺模板',
      category: '餐饮',
      prompt: `请为名为"{{storeName}}"的{{storeCategory}}店铺生成一份专业的IP方案。店铺位于{{storeLocation}}，已经营{{businessDuration}}。店铺特色：{{storeFeatures}}。店主{{ownerName}}，特点：{{ownerFeatures}}。请生成包含店铺概况、经营理念、特色服务、发展规划等内容的详细方案。`,
      priority: 1
    },
    {
      id: 'retail-template',
      name: '零售店铺模板',
      category: '零售',
      prompt: `请为"{{storeName}}"零售店铺制定IP发展方案。店铺位于{{storeLocation}}，经营{{businessDuration}}。主要特色：{{storeFeatures}}。店主{{ownerName}}，{{ownerFeatures}}。请重点突出产品优势、客户服务、品牌建设等方面。`,
      priority: 1
    },
    {
      id: 'service-template',
      name: '服务行业模板',
      category: '服务',
      prompt: `为"{{storeName}}"服务店铺设计IP方案。地址：{{storeLocation}}，营业{{businessDuration}}。服务特色：{{storeFeatures}}。负责人{{ownerName}}，{{ownerFeatures}}。请着重描述服务理念、专业能力、客户关系等内容。`,
      priority: 1
    },
    {
      id: 'default-template',
      name: '通用模板',
      category: '其他',
      prompt: `请为"{{storeName}}"（{{storeCategory}}）制定专业的店铺IP方案。店铺信息：位于{{storeLocation}}，经营{{businessDuration}}，特色：{{storeFeatures}}。店主{{ownerName}}，{{ownerFeatures}}。请生成全面的发展方案。`,
      priority: 0
    }
  ]

  static async selectTemplate(formData: any): Promise<Template> {
    // 根据店铺类别选择最合适的模板
    const categoryTemplate = this.templates.find(
      template => template.category === formData.storeCategory
    )
    
    if (categoryTemplate) {
      return categoryTemplate
    }
    
    // 返回默认模板
    return this.templates.find(template => template.id === 'default-template')!
  }

  static getAllTemplates(): Template[] {
    return this.templates
  }

  static getTemplateById(id: string): Template | undefined {
    return this.templates.find(template => template.id === id)
  }
}