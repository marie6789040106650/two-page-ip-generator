// 渲染器相关类型定义

export interface MarkdownContent {
  content: string
  metadata: {
    title: string
    wordCount: number
    sections: string[]
    generatedAt: string
    template: string
  }
  bannerUrl?: string
}

export interface RenderOptions {
  theme: ThemeConfig
  watermarkConfig: WatermarkConfig
  styleConfig: WordStyleConfig
}

export interface ThemeConfig {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  lineHeight: number
  cssVariables: Record<string, string>
  componentStyles?: Record<string, Record<string, string>>
  className?: string
}

export interface WordStyleConfig {
  pageWidth: number
  pageHeight: number
  margins: {
    top: number
    right: number
    bottom: number
    left: number
  }
  headingStyles: {
    h1: HeadingStyle
    h2: HeadingStyle
    h3: HeadingStyle
  }
  paragraphStyle: ParagraphStyle
  listStyle: ListStyle
  tableStyle: TableStyle
}

export interface HeadingStyle {
  fontSize: number
  fontWeight: string
  color: string
  margin: string
  textAlign: string
  borderBottom?: string
}

export interface ParagraphStyle {
  fontSize: number
  lineHeight: number
  margin: string
  textAlign: string
  textIndent: number
}

export interface ListStyle {
  margin: string
  paddingLeft: number
  itemSpacing: number
}

export interface TableStyle {
  borderCollapse: string
  borderColor: string
  headerBackground: string
  cellPadding: number
}

// 水印配置接口 - 完全兼容原项目
export interface WatermarkConfig {
  enabled: boolean
  text: string
  opacity: number
  fontSize: number
  rotation: number
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  repeat: 'none' | 'diagonal' | 'grid'
  color: 'gray' | 'red' | 'blue' | 'black'
}

export interface RenderResult {
  html: string
  css: string
  metadata: RenderMetadata
  watermarkSvg?: string
}

export interface RenderMetadata {
  renderTime: number
  wordCount: number
  pageCount: number
  theme: string
  hasWatermark: boolean
  generatedAt: string
}