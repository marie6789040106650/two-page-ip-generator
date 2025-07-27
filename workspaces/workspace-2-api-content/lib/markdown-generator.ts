interface ContentSection {
  title: string
  content: string
  subsections?: ContentSection[]
}

interface ProcessedContent {
  title: string
  sections: ContentSection[]
}

export class MarkdownGenerator {
  convertToMarkdown(content: ProcessedContent): string {
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
    
    // 添加生成时间戳
    markdown += `---\n\n`
    markdown += `*本方案生成时间：${new Date().toLocaleString('zh-CN')}*\n`
    markdown += `*由店铺IP生成器自动生成*\n`
    
    return markdown
  }

  parseMarkdown(markdown: string): ProcessedContent {
    const lines = markdown.split('\n')
    const sections: ContentSection[] = []
    let currentSection: ContentSection | null = null
    let currentSubsection: ContentSection | null = null
    let title = ''
    
    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.substring(2).trim()
      } else if (line.startsWith('## ')) {
        if (currentSection) {
          sections.push(currentSection)
        }
        currentSection = {
          title: line.substring(3).trim(),
          content: '',
          subsections: []
        }
        currentSubsection = null
      } else if (line.startsWith('### ')) {
        if (currentSection && currentSubsection) {
          currentSection.subsections = currentSection.subsections || []
          currentSection.subsections.push(currentSubsection)
        }
        currentSubsection = {
          title: line.substring(4).trim(),
          content: ''
        }
      } else if (line.trim() && !line.startsWith('---') && !line.startsWith('*')) {
        if (currentSubsection) {
          currentSubsection.content += line + '\n'
        } else if (currentSection) {
          currentSection.content += line + '\n'
        }
      }
    }
    
    if (currentSubsection && currentSection) {
      currentSection.subsections = currentSection.subsections || []
      currentSection.subsections.push(currentSubsection)
    }
    
    if (currentSection) {
      sections.push(currentSection)
    }
    
    return {
      title: title || '店铺IP方案',
      sections
    }
  }

  addMetadata(markdown: string, metadata: any): string {
    const metadataBlock = `---
title: ${metadata.title || '店铺IP方案'}
generated: ${metadata.generatedAt || new Date().toISOString()}
wordCount: ${metadata.wordCount || 0}
template: ${metadata.template || 'default'}
---

`
    
    return metadataBlock + markdown
  }

  extractMetadata(markdown: string): any {
    const metadataMatch = markdown.match(/^---\n([\s\S]*?)\n---\n/)
    if (!metadataMatch) return {}
    
    const metadataText = metadataMatch[1]
    const metadata: any = {}
    
    metadataText.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length > 0) {
        metadata[key.trim()] = valueParts.join(':').trim()
      }
    })
    
    return metadata
  }
}