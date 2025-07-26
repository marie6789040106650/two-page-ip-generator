"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import type { FormData } from '@/lib/types'
import router from 'next/router'
import router from 'next/router'

interface GeneratePageContentProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function GeneratePageContent({ searchParams }: GeneratePageContentProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData | null>(null)
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

  useEffect(() => {
    loadFormData()
  }, [searchParams])

  // 从URL参数或localStorage恢复数据
  const loadFormData = () => {
      try {
        // 首先尝试从URL参数获取数据
        const dataParam = searchParams.data as string
        if (dataParam) {
          const decoded = FormDataManager.decodeFromUrl(dataParam)
          if (decoded) {
            // 验证解码后的数据
            const validation = FormDataManager.validateFormData(decoded)
            if (validation.isValid || !FormDataManager.isEmptyFormData(decoded)) {
              setFormData(decoded)
              // 同时保存到localStorage作为备份
              FormDataManager.saveToStorage(decoded)
              setIsLoading(false)
              return
            }
          }
        }

        // 如果URL参数没有数据或数据无效，尝试从localStorage获取
        const stored = FormDataManager.loadFromStorage()
        if (stored && !FormDataManager.isEmptyFormData(stored)) {
          setFormData(stored)
          console.log('Recovered data from localStorage')
        } else {
          // 如果没有任何数据，设置为默认数据并显示错误状态
          setFormData(FormDataManager.getDefaultFormData())
          setHasDataError(true)
          console.warn('No valid data found, showing error state')
        }
      } catch (error) {
        console.error('Failed to load form data:', error)
        
        // 最后尝试：检查是否有任何存储的数据
        try {
          const lastResort = FormDataManager.loadFromStorage()
          if (lastResort && !FormDataManager.isEmptyFormData(lastResort)) {
            setFormData(lastResort)
            console.log('Recovered data as last resort')
          } else {
            setFormData(FormDataManager.getDefaultFormData())
            setHasDataError(true)
          }
        } catch (finalError) {
          console.error('Final recovery attempt failed:', finalError)
          setFormData(FormDataManager.getDefaultFormData())
          setHasDataError(true)
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleBackToForm = async () => {
    setIsNavigating(true)
    
    try {
      // 确保当前数据保存到localStorage作为备份
      if (formData && !FormDataManager.isEmptyFormData(formData)) {
        FormDataManager.saveToStorage(formData)
        setFeedbackMessage('数据已保存')
        setShowSuccessFeedback(true)
      }
      
      // 添加短暂延迟以显示反馈
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 返回到信息填写页面，保留数据
      router.push('/')
    } catch (error) {
      console.error('Failed to save data before navigation:', error)
      setFeedbackMessage('数据保存失败，但仍将返回')
      setShowErrorFeedback(true)
      
      // 即使保存失败也要返回
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }
  }

  const handleRegenerate = (type: string) => {
    // 显示交互反馈但不执行实际功能
    console.log(`重新生成${type}`)
    setFeedbackMessage(`重新生成${type}功能暂未实现`)
    setShowErrorFeedback(true)
  }

  const handleExport = () => {
    // 显示交互反馈但不执行实际功能
    console.log('导出方案')
    setFeedbackMessage('导出功能暂未实现')
    setShowErrorFeedback(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="loading-spinner w-8 h-8 border-purple-600 mx-auto"></div>
            <div className="absolute inset-0 loading-spinner w-8 h-8 border-blue-400 mx-auto animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <p className="text-gray-600 animate-pulse">正在加载方案...</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  // 如果数据缺失，显示错误提示
  if (hasDataError || !formData || FormDataManager.isEmptyFormData(formData)) {
    return (
      <DataErrorBoundary 
        onRetry={handleRetryDataLoad}
        message="数据加载失败"
      >
        <div className="text-center py-12 animate-fade-in">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center hover-lift animate-bounce-subtle">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 animate-slide-up">数据缺失</h3>
            <p className="text-gray-600 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              未找到表单数据，请先填写店铺信息。
            </p>
            <div className="animate-slide-up space-y-2" style={{ animationDelay: '0.2s' }}>
              <Button onClick={handleBackToForm} className="mt-4 btn-gradient hover-lift touch-manipulation">
                返回填写信息
              </Button>
              {retryCount < 3 && (
                <Button onClick={handleRetryDataLoad} variant="outline" className="mt-2 hover-lift">
                  重新加载数据 ({retryCount}/3)
                </Button>
              )}
            </div>
          </div>
        </div>
      </DataErrorBoundary>
    )
  }

  return (
    <>
      {/* 页面加载覆盖层 */}
      {isNavigating && (
        <PageLoadingOverlay 
          text="正在返回信息填写页面" 
          showProgress={true}
        />
      )}

      {/* 成功反馈 */}
      {showSuccessFeedback && (
        <SuccessFeedback 
          message={feedbackMessage}
          onComplete={() => setShowSuccessFeedback(false)}
        />
      )}

      {/* 错误反馈 */}
      {showErrorFeedback && (
        <ErrorFeedback 
          message={feedbackMessage}
          onComplete={() => setShowErrorFeedback(false)}
        />
      )}

      {/* 网络状态指示器 */}
      <NetworkStatusIndicator />

      <NetworkErrorBoundary onRetry={handleRetryDataLoad}>
        {/* 操作栏区域 */}
        <div className="card-elevated rounded-lg p-3 sm:p-4 lg:p-6 animate-slide-down">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            <span className="text-sm sm:text-base text-gray-600 truncate">
              {formData?.storeName ? `${formData.storeName} 的方案已生成` : '方案已生成'}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
            {/* 修改信息按钮 */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleBackToForm}
              disabled={isNavigating}
              className="flex items-center space-x-1 hover-lift touch-manipulation"
            >
              {isNavigating ? (
                <>
                  <div className="loading-spinner w-4 h-4"></div>
                  <span className="hidden sm:inline">返回中...</span>
                  <span className="sm:hidden">返回</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  <span className="hidden sm:inline">修改信息</span>
                  <span className="sm:hidden">修改</span>
                </>
              )}
            </Button>

            {/* 重新生成下拉菜单 */}
            <Select onValueChange={handleRegenerate}>
              <SelectTrigger className="w-auto min-w-[100px] sm:min-w-[120px] h-9 hover-lift touch-manipulation">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <SelectValue placeholder="重新生成" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="方案">重新生成方案</SelectItem>
                <SelectItem value="Banner图">重新生成Banner图</SelectItem>
              </SelectContent>
            </Select>

            {/* 导出按钮 */}
            <Button 
              size="sm"
              onClick={handleExport}
              className="btn-gradient hover-lift touch-manipulation flex items-center space-x-1"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">导出</span>
              <span className="sm:hidden">导出</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Banner占位符区域 */}
      <div className="space-y-3 sm:space-y-4 lg:space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 px-1">
          专属品牌Banner
        </h2>
        <div className="hover-lift">
          <BannerPlaceholder storeName={formData?.storeName} />
        </div>
      </div>

      {/* 内容占位符区域 */}
      <div className="space-y-3 sm:space-y-4 lg:space-y-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 px-1">
          IP打造方案详情
        </h2>
        <div className="hover-lift">
          <ContentPlaceholder />
        </div>
      </div>
      </NetworkErrorBoundary>
    </>
  )
}