"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { WordStyleRenderer } from '@/components/word-style-renderer'
import { FormDataManager } from '@/lib/form-data-manager'
import { DataErrorBoundary, NetworkErrorBoundary } from '@/components/error-boundary'
import {
  PageLoadingOverlay,
  SuccessFeedback,
  ErrorFeedback,
  NetworkStatusIndicator
} from '@/components/page-transition'
import type { FormData as CustomFormData } from '@/lib/types'

interface DisplayPageContentProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function DisplayPageContent({ searchParams: _searchParams }: DisplayPageContentProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<CustomFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasDataError, setHasDataError] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false)
  const [showErrorFeedback, setShowErrorFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  // 模拟的方案内容 - 后续可以从API获取
  const [generatedContent] = useState(`
# ${formData?.storeName || '店铺名称'} 老板IP打造方案

## 一、项目概述

本方案基于您提供的店铺信息，为您量身定制专业的老板IP打造策略。通过系统性的品牌建设和内容营销，帮助您在竞争激烈的市场中脱颖而出。

## 二、品牌定位分析

### 2.1 店铺基础信息
- **店铺名称**：${formData?.storeName || '待填写'}
- **经营品类**：${formData?.storeCategory || '待填写'}
- **店铺位置**：${formData?.storeLocation || '待填写'}
- **经营时长**：${formData?.businessDuration || '待填写'}

### 2.2 核心优势分析
${formData?.storeFeatures || '店铺特色待完善'}

### 2.3 老板个人特色
- **老板姓氏**：${formData?.ownerName || '待填写'}老板
- **个人特色**：${formData?.ownerFeatures || '个人特色待完善'}

## 三、IP打造策略

### 3.1 品牌故事构建
基于您的经营理念和个人特色，我们为您构建了独特的品牌故事...

### 3.2 内容营销方向
1. **专业展示**：展现您在${formData?.storeCategory || '行业'}领域的专业能力
2. **人格化塑造**：通过日常分享建立亲和力
3. **价值输出**：分享行业知识和经验

### 3.3 平台运营建议
- **抖音平台**：短视频内容为主，展示制作过程和成果
- **小红书**：图文并茂，分享经验和心得
- **微信朋友圈**：日常互动，建立客户关系

## 四、实施计划

### 4.1 第一阶段（1-2周）
- 完善个人形象设计
- 制作品牌宣传素材
- 建立内容发布计划

### 4.2 第二阶段（3-4周）
- 开始规律性内容发布
- 与粉丝建立互动
- 收集反馈并优化策略

### 4.3 第三阶段（5-8周）
- 扩大影响力范围
- 建立合作伙伴关系
- 实现商业价值转化

## 五、预期效果

通过系统性的IP打造，预期在3个月内实现：
- 品牌知名度显著提升
- 客户信任度增强
- 业务转化率提高
- 建立稳定的粉丝群体

---

*本方案由星光传媒AI智能生成，专注于服务本地实体商家的IP内容机构*
`)

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
      setFeedbackMessage('方案加载成功')

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

  const handleBackToGenerate = () => {
    setIsNavigating(true)
    router.push('/generate')
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
    link.download = `${formData.storeName || '老板'}_IP打造方案.txt`
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
店铺名称：${data.storeName}
店铺品类：${data.storeCategory}
店铺位置：${data.storeLocation}
经营时长：${data.businessDuration}
店铺特色：${data.storeFeatures}
老板姓氏：${data.ownerName}
老板特色：${data.ownerFeatures}

生成时间：${new Date().toLocaleString()}
    `.trim()
  }

  // Loading state
  if (isLoading) {
    return (
      <PageLoadingOverlay
        text="正在加载方案..."
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
          {/* Action Bar - 与原项目保持一致的样式 */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
                <div className="flex-1">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    {formData?.storeName || "店铺名称"} - 老板IP打造方案
                  </h2>
                  <p className="text-sm lg:text-base text-gray-600">
                    由星光传媒专业团队为您量身定制 · 智能生成 · 专业可靠
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 lg:gap-4 w-full lg:w-auto">
                  <Button
                    variant="outline"
                    size="default"
                    onClick={handleBackToForm}
                    className="flex-1 lg:flex-none min-w-[120px] h-11 text-sm font-medium border-gray-300 hover:bg-gray-50 transition-colors hover-lift"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    修改信息
                  </Button>

                  <Button
                    variant="outline"
                    size="default"
                    onClick={handleBackToGenerate}
                    className="flex-1 lg:flex-none min-w-[120px] h-11 text-sm font-medium border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors hover-lift"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    返回生成
                  </Button>
                  
                  {/* 重新生成下拉菜单 */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handleRegenerateContent}
                      className="flex-1 lg:flex-none min-w-[120px] h-11 text-sm font-medium border-orange-300 text-orange-700 hover:bg-orange-50 transition-colors hover-lift"
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      重新生成
                      <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  </div>

                  <Button
                    onClick={handleExportContent}
                    disabled={!formData}
                    className="flex-1 lg:flex-none min-w-[120px] h-11 text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover-lift transition-all duration-300"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    导出
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Word Style Content */}
          <div className="max-w-4xl mx-auto px-4 py-8">
            <WordStyleRenderer 
              content={generatedContent}
              formData={formData}
            />
          </div>
        </div>
      </NetworkErrorBoundary>
    </>
  )
}