import { ThemeConfig } from '@/types/renderer-types'

export class ThemeManager {
  private static themes: Map<string, ThemeConfig> = new Map()
  private static currentTheme: string = 'default'

  // 注册主题
  static registerTheme(theme: ThemeConfig) {
    this.themes.set(theme.id, theme)
  }

  // 获取主题
  static getTheme(id: string): ThemeConfig | undefined {
    return this.themes.get(id)
  }

  // 获取当前主题
  static getCurrentTheme(): ThemeConfig {
    return this.themes.get(this.currentTheme) || this.getDefaultTheme()
  }

  // 设置当前主题
  static setCurrentTheme(id: string) {
    if (this.themes.has(id)) {
      this.currentTheme = id
    }
  }

  // 获取所有主题
  static getAllThemes(): ThemeConfig[] {
    return Array.from(this.themes.values())
  }

  // 应用主题到元素
  static applyTheme(element: HTMLElement, themeId?: string) {
    const theme = themeId ? this.getTheme(themeId) : this.getCurrentTheme()
    if (!theme) return

    // 应用CSS变量
    Object.entries(theme.cssVariables).forEach(([key, value]) => {
      element.style.setProperty(`--${key}`, value)
    })

    // 应用类名
    if (theme.className) {
      element.classList.add(theme.className)
    }
  }

  // 生成主题CSS
  static generateThemeCSS(theme: ThemeConfig): string {
    let css = `:root {\n`

    // CSS变量
    Object.entries(theme.cssVariables).forEach(([key, value]) => {
      css += `  --${key}: ${value};\n`
    })

    css += `}\n\n`

    // 组件样式
    if (theme.componentStyles) {
      Object.entries(theme.componentStyles).forEach(([selector, styles]) => {
        css += `${selector} {\n`
        Object.entries(styles).forEach(([property, value]) => {
          css += `  ${property}: ${value};\n`
        })
        css += `}\n\n`
      })
    }

    return css
  }

  // 获取默认主题
  private static getDefaultTheme(): ThemeConfig {
    return {
      id: 'default',
      name: '默认主题',
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      fontFamily: 'Times New Roman, serif',
      lineHeight: 1.5,
      cssVariables: {
        'primary-color': '#3b82f6',
        'secondary-color': '#64748b',
        'font-family': 'Times New Roman, serif',
        'line-height': '1.5',
        'text-color': '#000000',
        'background-color': '#ffffff',
        'border-color': '#e5e7eb'
      }
    }
  }
}

// 预定义主题
export const predefinedThemes: ThemeConfig[] = [
  {
    id: 'default',
    name: '默认主题',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    fontFamily: 'Times New Roman, serif',
    lineHeight: 1.5,
    cssVariables: {
      'primary-color': '#3b82f6',
      'secondary-color': '#64748b',
      'font-family': 'Times New Roman, serif',
      'line-height': '1.5',
      'text-color': '#000000',
      'background-color': '#ffffff',
      'border-color': '#e5e7eb'
    }
  },
  {
    id: 'professional',
    name: '专业主题',
    primaryColor: '#1f2937',
    secondaryColor: '#6b7280',
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.6,
    cssVariables: {
      'primary-color': '#1f2937',
      'secondary-color': '#6b7280',
      'font-family': 'Arial, sans-serif',
      'line-height': '1.6',
      'text-color': '#1f2937',
      'background-color': '#ffffff',
      'border-color': '#d1d5db'
    },
    componentStyles: {
      'h1': {
        'color': '#1f2937',
        'border-bottom': '2px solid #3b82f6'
      },
      'h2': {
        'color': '#374151',
        'border-bottom': '1px solid #d1d5db'
      }
    }
  },
  {
    id: 'modern',
    name: '现代主题',
    primaryColor: '#8b5cf6',
    secondaryColor: '#a78bfa',
    fontFamily: 'Helvetica, Arial, sans-serif',
    lineHeight: 1.7,
    cssVariables: {
      'primary-color': '#8b5cf6',
      'secondary-color': '#a78bfa',
      'font-family': 'Helvetica, Arial, sans-serif',
      'line-height': '1.7',
      'text-color': '#1f2937',
      'background-color': '#ffffff',
      'border-color': '#e5e7eb'
    },
    componentStyles: {
      'h1': {
        'color': '#8b5cf6',
        'font-weight': '300',
        'letter-spacing': '-0.025em'
      },
      'h2': {
        'color': '#6b46c1',
        'font-weight': '400'
      },
      'p': {
        'color': '#374151'
      }
    }
  },
  {
    id: 'classic',
    name: '经典主题',
    primaryColor: '#dc2626',
    secondaryColor: '#7f1d1d',
    fontFamily: 'Georgia, serif',
    lineHeight: 1.8,
    cssVariables: {
      'primary-color': '#dc2626',
      'secondary-color': '#7f1d1d',
      'font-family': 'Georgia, serif',
      'line-height': '1.8',
      'text-color': '#1f2937',
      'background-color': '#fffbeb',
      'border-color': '#d97706'
    },
    componentStyles: {
      'h1': {
        'color': '#dc2626',
        'text-decoration': 'underline',
        'text-decoration-color': '#fbbf24'
      },
      'h2': {
        'color': '#b91c1c',
        'font-style': 'italic'
      },
      'blockquote': {
        'border-left': '4px solid #fbbf24',
        'background-color': '#fef3c7'
      }
    }
  }
]

// 初始化预定义主题
predefinedThemes.forEach(theme => {
  ThemeManager.registerTheme(theme)
})