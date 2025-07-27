"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FormSection } from '@/components/form-section'
import { useFormContext } from '@/context/form-context'
import { getDefaultRecommendedModel } from '@/lib/models'
import { ExpandedKeywords } from '@/lib/types'
import { FormDataManager } from '@/lib/form-data-manager'
import { NetworkErrorBoundary } from '@/components/error-boundary'
import { 
  PageLoadingOverlay, 
  SuccessFeedback, 
  ErrorFeedback, 
  SaveIndicator,
  NetworkStatusIndicator 
} from '@/components/page-transition'

export default function FormPageContent() {
  const router = useRouter()
  const { 
    formData, 
    updateField, 
    validateForm, 
    encodeForUrl,
    loadFromStorage,
    saveToStorage,
    errors: contextErrors
  } = useFormContext()

  // Form state
  const [expandedKeywords, setExpandedKeywords] = useState<ExpandedKeywords | null>(null)
  const [isExpandingKeywords, setIsExpandingKeywords] = useState(false)
  const [selectedModelId, setSelectedModelId] = useState(getDefaultRecommendedModel().id)
  const [showModelSettings, setShowModelSettings] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [networkError, setNetworkError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false)
  const [showErrorFeedback, setShowErrorFeedback] = useState(false)
  const [errorFeedbackMessage, setErrorFeedbackMessage] = useState('')
  const [isNavigating, setIsNavigating] = useState(false)

  // Load saved data on mount with error handling
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if we're returning from generate page by looking at referrer
        const isReturningFromGenerate = document.referrer.includes('/generate')
        
        // Always try to load from storage, but prioritize it if returning from generate
        loadFromStorage()
        
        // Clear any previous errors when loading data
        if (isReturningFromGenerate) {
          setError('')
          setNetworkError(false)
        }
      } catch (error) {
        console.error('Failed to load initial data:', error)
        setNetworkError(true)
      }
    }

    loadData()
  }, [loadFromStorage])

  // Retry mechanism for network errors
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1)
    setNetworkError(false)
    setError('')
    
    // Retry loading data
    try {
      loadFromStorage()
    } catch (error) {
      console.error('Retry failed:', error)
      if (retryCount < 3) {
        setTimeout(() => setNetworkError(true), 1000)
      } else {
        setError('多次重试失败，请刷新页面或检查网络连接')
      }
    }
  }, [loadFromStorage, retryCount])

  // Auto-save functionality
  const handleAutoSave = useCallback(async () => {
    if (FormDataManager.isEmptyFormData(formData)) return
    
    setSaveStatus('saving')
    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate save delay
      saveToStorage()
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }, [formData, saveToStorage])

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    updateField(field as keyof typeof formData, value)
    setError('') // Clear error when user starts typing
    
    // Clear field-specific error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Trigger auto-save after a delay
    const timeoutId = setTimeout(() => {
      handleAutoSave()
    }, 1000)

    return () => clearTimeout(timeoutId)
  }

  // Handle field validation
  const handleFieldValidation = (field: string, isValid: boolean, error?: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev }
      if (isValid) {
        delete newErrors[field]
      } else if (error) {
        newErrors[field] = error
      }
      return newErrors
    })
  }

  // Handle model change
  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId)
  }

  // Toggle model settings
  const handleToggleModelSettings = () => {
    setShowModelSettings(!showModelSettings)
  }

  // Handle form submission
  const handleSubmit = async () => {
    setError('')
    setIsLoading(true)
    setIsNavigating(true)

    try {
      // Show immediate feedback
      setShowSuccessFeedback(false)
      setShowErrorFeedback(false)

      // Validate form using context validation
      const isValid = validateForm()
      
      // Also merge context errors with field errors
      const allErrors = { ...fieldErrors, ...contextErrors }
      setFieldErrors(allErrors)
      
      if (!isValid || Object.keys(allErrors).length > 0) {
        const errorCount = Object.keys(allErrors).length
        const errorMsg = `请修正${errorCount}个字段的错误后再提交`
        setError(errorMsg)
        setErrorFeedbackMessage(errorMsg)
        setShowErrorFeedback(true)
        setIsLoading(false)
        setIsNavigating(false)
        return
      }

      // Save to storage before API call for backup
      setSaveStatus('saving')
      saveToStorage()
      setSaveStatus('saved')

      // Call API to generate content
      const apiResponse = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}))
        const errorMsg = errorData.error || `API调用失败 (${apiResponse.status})`
        setError(errorMsg)
        setErrorFeedbackMessage(errorMsg)
        setShowErrorFeedback(true)
        setIsLoading(false)
        setIsNavigating(false)
        return
      }

      const apiResult = await apiResponse.json()
      
      // Encode form data for URL with enhanced error handling
      const encodedData = encodeForUrl()
      if (!encodedData) {
        const errorMsg = '数据编码失败，请重试'
        setError(errorMsg)
        setErrorFeedbackMessage(errorMsg)
        setShowErrorFeedback(true)
        setIsLoading(false)
        setIsNavigating(false)
        return
      }

      // Show success feedback before navigation
      setShowSuccessFeedback(true)
      
      // Navigate to generate page with data after a short delay
      setTimeout(() => {
        router.push(`/generate?data=${encodedData}`)
      }, 1000)
      
    } catch (err) {
      console.error('Form submission error:', err)
      
      // Check if it's a network error
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setNetworkError(true)
        setErrorFeedbackMessage('网络连接失败，请检查网络后重试')
        setError('网络连接失败，请检查网络后重试')
      } else {
        setErrorFeedbackMessage('提交失败，请重试')
        setError('提交失败，请重试')
      }
      
      setShowErrorFeedback(true)
      setIsLoading(false)
      setIsNavigating(false)
      setSaveStatus('error')
    }
  }

  if (networkError) {
    return (
      <NetworkErrorBoundary onRetry={handleRetry} retryText="重新加载数据">
        <div></div>
      </NetworkErrorBoundary>
    )
  }

  return (
    <>
      {/* 页面加载覆盖层 */}
      {isNavigating && (
        <PageLoadingOverlay 
          text="正在生成方案" 
          showProgress={true}
        />
      )}

      {/* 成功反馈 */}
      {showSuccessFeedback && (
        <SuccessFeedback 
          message="数据已保存，正在跳转..."
          onComplete={() => setShowSuccessFeedback(false)}
        />
      )}

      {/* 错误反馈 */}
      {showErrorFeedback && (
        <ErrorFeedback 
          message={errorFeedbackMessage}
          onComplete={() => setShowErrorFeedback(false)}
          onRetry={() => {
            setShowErrorFeedback(false)
            handleSubmit()
          }}
        />
      )}

      {/* 网络状态指示器 */}
      <NetworkStatusIndicator />

      <NetworkErrorBoundary onRetry={handleRetry}>
        <div className="relative">
          {/* 保存状态指示器 */}
          <div className="fixed top-4 left-4 z-40">
            <SaveIndicator status={saveStatus} />
          </div>

          <FormSection
            formData={formData}
            onInputChange={handleInputChange}
            expandedKeywords={expandedKeywords}
            isExpandingKeywords={isExpandingKeywords}
            selectedModelId={selectedModelId}
            onModelChange={handleModelChange}
            showModelSettings={showModelSettings}
            onToggleModelSettings={handleToggleModelSettings}
            isLoading={isLoading}
            error={error}
            onSubmit={handleSubmit}
            setFormData={undefined} // Not needed for this use case
            setExpandedKeywords={setExpandedKeywords}
            setIsExpandingKeywords={setIsExpandingKeywords}
            fieldErrors={fieldErrors}
            onFieldValidation={handleFieldValidation}
          />
        </div>
      </NetworkErrorBoundary>
    </>
  )
}