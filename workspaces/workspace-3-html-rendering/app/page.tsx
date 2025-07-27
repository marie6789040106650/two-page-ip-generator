'use client'

import React, { useState, useEffect } from 'react'
import { MarkdownRenderer } from '@/components/renderers/markdown-renderer'
import { WordStyleRenderer, defaultWordStyleConfig } from '@/components/renderers/word-style-renderer'
import { WatermarkSettingsButton, WatermarkConfigManager, WatermarkConfig } from '@/components/watermark/watermark-overlay'
import { ThemeManager, predefinedThemes } from '@/lib/theme-manager'
import { MarkdownContent, RenderOptions } from '@/types/renderer-types'

export default function HomePage() {
  const [content, setContent] = useState<MarkdownContent | null>(null)
  const [renderOptions, setRenderOptions] = useState<RenderOptions>({
    theme: predefinedThemes[0],
    watermarkConfig: WatermarkConfigManager.getDefaultConfig('店铺IP生成器'),
    styleConfig: defaultWordStyleConfig
  })
  const [renderedHtml, setRenderedHtml] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  // 从URL参数获取内容
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const contentParam = urlParams.get('content')
    
    if (contentParam) {
      try {
        const decodedContent = decodeURIComponent(contentParam)
        setContent({
          content: decodedContent,
          metadata: {
            title: '店铺IP方案',
            wordCount: decodedContent.length,
            sections: [],
            generatedAt: new Date().toISOString(),
            template: 'default'
          }
        })
      } catch (error) {
        console.error('Failed to decode content:', error)
      }
    } else {
      // 设置示例内容
      setContent({
        content: `# 示例店铺IP方案

## 店铺概况

这是一个示例店铺IP方案，展示了HTML渲染和样式系统的功能。

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
*本方案由店铺IP生成器自动生成*`,
        metadata: {
          title: '示例店铺IP方案',
          wordCount: 200,
          sections: ['店铺概况', '经营理念', '发展规划'],
          generatedAt: new Date().toISOString(),
          template: 'example'
        }
      })
    }
  }, [])

  const handleRenderComplete = (html: string) => {
    setRenderedHtml(html)
  }

  const handleThemeChange = (themeId: string) => {
    const theme = predefinedThemes.find(t => t.id === themeId)
    if (theme) {
      setRenderOptions(prev => ({ ...prev, theme }))
    }
  }

  const handleWatermarkChange = (watermarkConfig: WatermarkConfig) => {
    setRenderOptions(prev => ({ ...prev, watermarkConfig }))
    WatermarkConfigManager.saveConfig(watermarkConfig)
  }

  const handleExport = async (format: 'word' | 'pdf') => {
    if (!renderedHtml) {
      alert('请等待内容渲染完成')
      return
    }

    try {
      // 调用工作区4的导出API
      const response = await fetch(`/api/export/${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: renderedHtml,
          watermarkConfig: renderOptions.watermarkConfig,
          styleConfig: renderOptions.styleConfig,
          metadata: content?.metadata
        }),
      })

      if (!response.ok) {
        throw new Error('导出失败')
      }

      // 处理文件下载
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `店铺IP方案.${format === 'word' ? 'docx' : 'pdf'}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Export error:', error)
      alert('导出失败，请重试')
    }
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载内容...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">渲染控制</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              {showSettings ? '隐藏设置' : '显示设置'}
            </button>
            <button
              onClick={() => handleExport('word')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              导出Word
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              导出PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">主题选择</label>
            <select
              value={renderOptions.theme.id}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {predefinedThemes.map(theme => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">字数统计</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
              {content.metadata.wordCount} 字
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">生成时间</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
              {new Date(content.metadata.generatedAt).toLocaleString('zh-CN')}
            </div>
          </div>
        </div>
      </div>

      {/* 设置面板 */}
      {showSettings && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 水印设置 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">水印设置</h3>
              <WatermarkSettingsButton
                storeName="店铺IP生成器"
                onConfigChange={handleWatermarkChange}
                className="ml-auto"
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>使用右侧按钮打开完整的水印配置面板，支持实时预览和详细设置。</p>
              <div className="mt-2 p-2 bg-blue-50 rounded">
                <p className="text-blue-700">
                  当前状态: {renderOptions.watermarkConfig.enabled ? '已启用' : '已禁用'}
                </p>
                {renderOptions.watermarkConfig.enabled && (
                  <p className="text-blue-600 text-xs mt-1">
                    文本: "{renderOptions.watermarkConfig.text}" | 
                    透明度: {renderOptions.watermarkConfig.opacity}% | 
                    角度: {renderOptions.watermarkConfig.rotation}°
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">样式设置</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">页面宽度</label>
                <input
                  type="number"
                  value={renderOptions.styleConfig.pageWidth}
                  onChange={(e) => setRenderOptions(prev => ({
                    ...prev,
                    styleConfig: {
                      ...prev.styleConfig,
                      pageWidth: parseInt(e.target.value)
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">段落字体大小</label>
                <input
                  type="number"
                  value={renderOptions.styleConfig.paragraphStyle.fontSize}
                  onChange={(e) => setRenderOptions(prev => ({
                    ...prev,
                    styleConfig: {
                      ...prev.styleConfig,
                      paragraphStyle: {
                        ...prev.styleConfig.paragraphStyle,
                        fontSize: parseInt(e.target.value)
                      }
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 渲染预览 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">渲染预览</h2>
        
        <WordStyleRenderer
          styleConfig={renderOptions.styleConfig}
          watermarkConfig={renderOptions.watermarkConfig}
        >
          <MarkdownRenderer
            content={content}
            options={renderOptions}
            onRenderComplete={handleRenderComplete}
          />
        </WordStyleRenderer>
      </div>

      {/* 工作区状态 */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border">
        <div className="text-sm font-medium text-gray-900 mb-2">工作区状态</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
            <span>工作区1: 表单输入</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
            <span>工作区2: 内容生成</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span>工作区3: 样式渲染 (当前)</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
            <span>工作区4: 文档导出</span>
          </div>
        </div>
      </div>
    </div>
  )
}