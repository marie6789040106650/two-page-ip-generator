"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BannerPlaceholder } from '@/components/banner-placeholder'
import { ContentPlaceholder } from '@/components/content-placeholder'
import { FormDataManager } from '@/lib/form-data-manager'
import { DataErrorBoundary, NetworkErrorBoundary } from '@/components/error-boundary'
import {
  PageLoadingOverlay,
  SuccessFeedback,
  ErrorFeedback,
  NetworkStatusIndicator
} from '@/components/page-transition'
import type { FormData as CustomFormData } from '@/lib/types'

interface GeneratePageContentProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function GeneratePageContent({ searchParams: _searchParams }: GeneratePageContentProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<CustomFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasDataError, setHasDataError] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false)
  const [showErrorFeedback, setShowErrorFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  // Retry mechanism for data loading
  const handleRetryDataLoad = () => {
    setRetryCount(prev => prev + 1)
    setHasDataError(false)
    setIsLoading(true)

    // Retry loading data after a short delay
    setTimeout(() => {
      loadFormData()
    }, 500)
  }

  const loadFormData = useCallback(async () => {
    try {
      setIsLoading(true)
      setHasDataError(false)

      const data = FormDataManager.loadFromStorage()

      if (!data) {
        setHasDataError(true)
        setFeedbackMessage('未找到表单数据，请先填写表单')
        setShowErrorFeedback(true)

        // Auto redirect to form page after showing error
        setTimeout(() => {
          setIsNavigating(true)
          router.push('/')
        }, 2000)
        return
      }

      setFormData(data)
      setShowSuccessFeedback(true)
      setFeedbackMessage('数据加载成功')

      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccessFeedback(false)
      }, 2000)

    } catch (error) {
      console.error('Failed to load form data:', error)
      setHasDataError(true)
      setFeedbackMessage('数据加载失败，请重试')
      setShowErrorFeedback(true)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadFormData()
  }, [loadFormData])

  const handleBackToForm = () => {
    setIsNavigating(true)
    router.push('/')
  }

  const handleRegenerateContent = () => {
    setShowSuccessFeedback(true)
    setFeedbackMessage('内容重新生成中...')

    // Simulate content regeneration
    setTimeout(() => {
      setShowSuccessFeedback(false)
      setFeedbackMessage('内容已重新生成')
      setShowSuccessFeedback(true)

      setTimeout(() => {
        setShowSuccessFeedback(false)
      }, 2000)
    }, 1500)
  }

  const handleExportContent = () => {
    if (!formData) return

    const content = generateExportContent(formData)
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${formData.name || '老板'}_IP打造方案.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setShowSuccessFeedback(true)
    setFeedbackMessage('方案已导出')
    setTimeout(() => {
      setShowSuccessFeedback(false)
    }, 2000)
  }

  const generateExportContent = (data: CustomFormData): string => {
    return `
老板IP打造方案

基本信息：
姓名：${data.name}
行业：${data.industry}
目标受众：${data.targetAudience}
核心价值：${data.coreValue}

个人故事：
${data.personalStory}

专业技能：
${data.skills?.join(', ') || ''}

内容方向：
${data.contentDirection?.join(', ') || ''}

平台选择：
${data.platforms?.join(', ') || ''}

生成时间：${new Date().toLocaleString()}
    `.trim()
  }

  // Loading state
  if (isLoading) {
    return (
      <PageLoadingOverlay
        text="正在加载数据..."
        showProgress={true}
      />
    )
  }

  // Error state with retry option
  if (hasDataError) {
    return (
      <DataErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">数据加载失败</h2>
            <p className="text-gray-600 mb-6">
              {retryCount > 0 ? `重试次数：${retryCount}` : '请检查网络连接或重试'}
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleRetryDataLoad}
                className="w-full"
                disabled={retryCount >= 3}
              >
                {retryCount >= 3 ? '已达到最大重试次数' : '重试加载'}
              </Button>
              <Button
                variant="outline"
                onClick={handleBackToForm}
                className="w-full"
              >
                返回表单页面
              </Button>
            </div>
          </div>
        </div>
      </DataErrorBoundary>
    )
  }

  return (
    <>
      <NetworkStatusIndicator />

      {showSuccessFeedback && (
        <SuccessFeedback message={feedbackMessage} />
      )}

      {showErrorFeedback && (
        <ErrorFeedback message={feedbackMessage} />
      )}

      {isNavigating && (
        <PageLoadingOverlay text="页面跳转中..." />
      )}

      <NetworkErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                  IP打造方案
                </h1>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleBackToForm}
                    className="hover-lift"
                  >
                    返回编辑
                  </Button>
                  <Button
                    onClick={handleRegenerateContent}
                    className="hover-lift"
                  >
                    重新生成
                  </Button>
                  <Button
                    onClick={handleExportContent}
                    className="hover-lift"
                  >
                    导出方案
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* User Info Summary */}
            {formData && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8 hover-lift">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  基本信息
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">姓名：</span>
                    <span className="ml-2 font-medium">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">行业：</span>
                    <span className="ml-2 font-medium">{formData.industry}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">目标受众：</span>
                    <span className="ml-2 font-medium">{formData.targetAudience}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">核心价值：</span>
                    <span className="ml-2 font-medium">{formData.coreValue}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Banner Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                品牌横幅设计
              </h2>
              <div className="hover-lift">
                <BannerPlaceholder />
              </div>
            </div>

            {/* Content Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                IP打造方案详情
              </h2>
              <div className="hover-lift">
                <ContentPlaceholder />
              </div>
            </div>
          </div>
        </div>
      </NetworkErrorBoundary>
    </>
  )
}