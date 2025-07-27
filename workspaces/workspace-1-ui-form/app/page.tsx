'use client'

import { useState, useEffect } from 'react'
import { EnhancedFormSection } from '@/components/form/enhanced-form-section'
import { ErrorBoundary, NetworkError } from '@/components/ui/error-boundary'
import { FormData } from '@/types/form-types'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [initialFormData, setInitialFormData] = useState<Partial<FormData> | undefined>(undefined)

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // 调用本地API路由，它会转发到工作区2
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setResult(result.data)
        setRetryCount(0) // 重置重试计数
        
        // 保存表单数据到本地存储
        localStorage.setItem('form-submission-data', JSON.stringify(formData))
        const contentWithFormData = {
          ...result.data,
          formData: formData,
          timestamp: new Date().toISOString()
        }
        localStorage.setItem('generated-content', JSON.stringify(contentWithFormData))
        
        // 跳转到本工作区的display页面
        const contentParam = encodeURIComponent(JSON.stringify(contentWithFormData))
        window.location.href = `/display?content=${contentParam}`
      } else {
        throw new Error(result.error || '生成失败')
      }
      
    } catch (error) {
      console.error('Form submission error:', error)
      setRetryCount(prev => prev + 1)
      
      const errorMessage = error instanceof Error ? error.message : '生成失败，请重试'
      setError(errorMessage)
      
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    // 这里可以重新提交最后一次的表单数据
    const lastFormData = localStorage.getItem('form-submission-data')
    if (lastFormData) {
      try {
        const formData = JSON.parse(lastFormData)
        handleFormSubmit(formData)
      } catch (e) {
        setError('无法重试，请重新填写表单')
      }
    }
  }

  // 检查是否从预览页面返回
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('from') === 'preview') {
      // 从localStorage获取确认的表单数据
      const confirmedData = localStorage.getItem('confirmed-form-data')
      if (confirmedData) {
        try {
          const parsedData = JSON.parse(confirmedData)
          setInitialFormData(parsedData)
          localStorage.removeItem('confirmed-form-data')
          
          // 清理URL参数
          window.history.replaceState({}, '', window.location.pathname)
        } catch (error) {
          console.error('Failed to load confirmed data:', error)
        }
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            工作区1: UI复用和表单优化
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            店铺IP生成器
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            填写您的店铺信息，我们将为您生成专业的IP方案文档。
            <br />
            支持批量输入、自动保存，让表单填写更高效。
          </p>
        </div>

        {/* 错误显示 */}
        {error && (
          <NetworkError
            error={error}
            onRetry={handleRetry}
            retryCount={retryCount}
            maxRetries={3}
          />
        )}

        {/* 表单区域 */}
        <ErrorBoundary>
          <EnhancedFormSection
            initialData={initialFormData}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        </ErrorBoundary>

        {/* 生成结果 */}
        {result && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">生成成功</h3>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm text-green-700">
                  ✅ 内容已成功生成并跳转到工作区3进行渲染
                  <br />
                  📄 如果页面没有自动打开，请检查浏览器弹窗设置
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 工作区状态指示 */}
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
          <div className="flex items-center mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-900">多工作区协作</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-medium">工作区1: 表单输入</span>
              <span className="text-green-600">●</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">工作区2: 内容生成</span>
              <span className="text-gray-300">○</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">工作区3: 样式渲染</span>
              <span className="text-gray-300">○</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">工作区4: 文档导出</span>
              <span className="text-gray-300">○</span>
            </div>
          </div>
        </div>

        {/* 功能特性展示 */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">功能特性</h2>
            <p className="text-gray-600">现代化的表单体验，让信息填写更简单高效</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">智能批量输入</h3>
              <p className="text-gray-600 text-sm">支持文本粘贴自动识别，一键填写所有字段，大幅提升填写效率</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">自动保存</h3>
              <p className="text-gray-600 text-sm">每2秒自动保存表单数据，防止意外丢失，重新打开页面自动恢复</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">实时验证</h3>
              <p className="text-gray-600 text-sm">智能表单验证，实时提示错误信息，确保数据准确性和完整性</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}