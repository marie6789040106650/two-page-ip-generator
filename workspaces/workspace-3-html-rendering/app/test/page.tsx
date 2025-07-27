'use client'

import React, { useState, useEffect } from 'react'
import { MarkdownRenderer } from '@/components/renderers/markdown-renderer'
import { WordStyleRenderer, defaultWordStyleConfig } from '@/components/renderers/word-style-renderer'
import { WatermarkSettingsButton, WatermarkConfigManager, WatermarkConfig } from '@/components/watermark/watermark-overlay'
import { predefinedThemes } from '@/lib/theme-manager'
import { MarkdownContent, RenderOptions } from '@/types/renderer-types'

export default function TestPage() {
  const [content, setContent] = useState<MarkdownContent | null>(null)
  const [renderOptions, setRenderOptions] = useState<RenderOptions>({
    theme: predefinedThemes[0],
    watermarkConfig: WatermarkConfigManager.getDefaultConfig('测试店铺'),
    styleConfig: defaultWordStyleConfig
  })
  const [isLoading, setIsLoading] = useState(true)

  // 加载测试内容
  useEffect(() => {
    const loadTestContent = async () => {
      try {
        const response = await fetch('/api/test-watermark')
        const data = await response.json()
        
        if (data.success) {
          setContent({
            content: data.content,
            metadata: data.metadata
          })
        }
      } catch (error) {
        console.error('加载测试内容失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTestContent()
  }, [])

  const handleWatermarkChange = (watermarkConfig: WatermarkConfig) => {
    setRenderOptions(prev => ({ ...prev, watermarkConfig }))
    WatermarkConfigManager.saveConfig(watermarkConfig)
  }

  const handleThemeChange = (themeId: string) => {
    const theme = predefinedThemes.find(t => t.id === themeId)
    if (theme) {
      setRenderOptions(prev => ({ ...prev, theme }))
    }
  }

  const testWatermarkAPI = async () => {
    try {
      const response = await fetch('/api/test-watermark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          watermarkConfig: renderOptions.watermarkConfig,
          content: content?.content
        })
      })

      const result = await response.json()
      if (result.success) {
        alert('水印API测试成功！\n' + JSON.stringify(result.data, null, 2))
      } else {
        alert('水印API测试失败：' + result.error)
      }
    } catch (error) {
      alert('水印API测试出错：' + error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载测试内容...</p>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-red-800 font-semibold mb-2">测试内容加载失败</h2>
        <p className="text-red-600">无法加载测试内容，请检查API服务。</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 测试控制面板 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">水印系统测试</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
              ✅ 测试模式
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
            <label className="block text-sm font-medium mb-2">水印状态</label>
            <div className={`px-3 py-2 rounded-md text-sm font-medium ${
              renderOptions.watermarkConfig.enabled 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-gray-50 text-gray-700 border border-gray-200'
            }`}>
              {renderOptions.watermarkConfig.enabled ? '已启用' : '已禁用'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">字数统计</label>
            <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm">
              {content.metadata.wordCount} 字
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">操作</label>
            <div className="flex space-x-2">
              <WatermarkSettingsButton
                storeName="测试店铺"
                onConfigChange={handleWatermarkChange}
              />
              <button
                onClick={testWatermarkAPI}
                className="px-3 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
              >
                测试API
              </button>
            </div>
          </div>
        </div>

        {/* 水印配置摘要 */}
        {renderOptions.watermarkConfig.enabled && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">当前水印配置</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700">
              <div>文本: {renderOptions.watermarkConfig.text}</div>
              <div>透明度: {renderOptions.watermarkConfig.opacity}%</div>
              <div>大小: {renderOptions.watermarkConfig.fontSize}px</div>
              <div>角度: {renderOptions.watermarkConfig.rotation}°</div>
              <div>位置: {renderOptions.watermarkConfig.position}</div>
              <div>模式: {renderOptions.watermarkConfig.repeat}</div>
              <div>颜色: {renderOptions.watermarkConfig.color}</div>
            </div>
          </div>
        )}
      </div>

      {/* 渲染预览 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">渲染预览 - 水印系统测试</h2>
        
        <WordStyleRenderer
          styleConfig={renderOptions.styleConfig}
          watermarkConfig={renderOptions.watermarkConfig}
        >
          <MarkdownRenderer
            content={content}
            options={renderOptions}
          />
        </WordStyleRenderer>
      </div>

      {/* 测试信息 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">测试信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>测试目标:</strong>
            <ul className="mt-1 ml-4 list-disc text-gray-600">
              <li>验证水印系统100%保留原项目功能</li>
              <li>测试Markdown到Word样式的转换</li>
              <li>验证多主题支持</li>
              <li>测试实时预览功能</li>
            </ul>
          </div>
          <div>
            <strong>技术验证:</strong>
            <ul className="mt-1 ml-4 list-disc text-gray-600">
              <li>水印配置管理器</li>
              <li>Canvas水印渲染</li>
              <li>Word文档样式精确模拟</li>
              <li>响应式设计适配</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}