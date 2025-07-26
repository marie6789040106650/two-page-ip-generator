'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

/**
 * 页面过渡组件
 * 处理页面切换时的加载状态和过渡动画
 */
export function PageTransition({ children }: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('正在加载...')
  const pathname = usePathname()

  useEffect(() => {
    // 监听路由变化
    const handleStart = () => {
      setIsLoading(true)
      setLoadingText('正在跳转...')
    }

    const handleComplete = () => {
      setIsLoading(false)
    }

    // 模拟路由事件（Next.js App Router 没有直接的路由事件）
    // 这里我们通过 pathname 变化来检测路由变化
    let timeoutId: NodeJS.Timeout

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setIsLoading(false)
      }, 2000) // 最大加载时间
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [pathname, isLoading])

  if (isLoading) {
    return <PageLoadingOverlay text={loadingText} />
  }

  return (
    <div className="page-transition-container">
      {children}
    </div>
  )
}

/**
 * 页面加载覆盖层
 */
interface PageLoadingOverlayProps {
  text?: string
  showProgress?: boolean
}

export function PageLoadingOverlay({ 
  text = '正在加载...', 
  showProgress = false 
}: PageLoadingOverlayProps) {
  const [progress, setProgress] = useState(0)
  const [dots, setDots] = useState('')

  useEffect(() => {
    // 动画点点点效果
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return ''
        return prev + '.'
      })
    }, 500)

    // 进度条动画
    let progressInterval: NodeJS.Timeout
    if (showProgress) {
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 10
        })
      }, 200)
    }

    return () => {
      clearInterval(dotsInterval)
      if (progressInterval) {
        clearInterval(progressInterval)
      }
    }
  }, [showProgress])

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        {/* 加载动画 */}
        <div className="relative">
          <div className="loading-spinner w-12 h-12 border-purple-600 mx-auto"></div>
          <div className="absolute inset-0 loading-spinner w-12 h-12 border-blue-400 mx-auto animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* 加载文本 */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-800">
            {text}{dots}
          </p>
          <p className="text-sm text-gray-500">
            请稍候，正在为您准备内容
          </p>
        </div>

        {/* 进度条 */}
        {showProgress && (
          <div className="w-64 mx-auto">
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {Math.round(progress)}%
            </p>
          </div>
        )}

        {/* 装饰性动画 */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}

/**
 * 按钮加载状态组件
 */
interface ButtonLoadingProps {
  isLoading: boolean
  loadingText?: string
  children: React.ReactNode
  className?: string
}

export function ButtonLoading({ 
  isLoading, 
  loadingText = '处理中...', 
  children, 
  className = '' 
}: ButtonLoadingProps) {
  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="loading-spinner w-4 h-4"></div>
        <span>{loadingText}</span>
      </div>
    )
  }

  return <>{children}</>
}

/**
 * 成功反馈组件
 */
interface SuccessFeedbackProps {
  message: string
  duration?: number
  onComplete?: () => void
}

export function SuccessFeedback({ 
  message, 
  duration = 2000, 
  onComplete 
}: SuccessFeedbackProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onComplete) {
        setTimeout(onComplete, 300) // 等待动画完成
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-down">
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  )
}

/**
 * 错误反馈组件
 */
interface ErrorFeedbackProps {
  message: string
  duration?: number
  onComplete?: () => void
  onRetry?: () => void
}

export function ErrorFeedback({ 
  message, 
  duration = 4000, 
  onComplete,
  onRetry 
}: ErrorFeedbackProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onComplete) {
        setTimeout(onComplete, 300)
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-down">
      <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{message}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm underline hover:no-underline"
          >
            点击重试
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * 保存状态指示器
 */
interface SaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error'
  className?: string
}

export function SaveIndicator({ status, className = '' }: SaveIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <div className="loading-spinner w-4 h-4 border-blue-500"></div>,
          text: '保存中...',
          color: 'text-blue-600'
        }
      case 'saved':
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          text: '已保存',
          color: 'text-green-600'
        }
      case 'error':
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          text: '保存失败',
          color: 'text-red-600'
        }
      default:
        return null
    }
  }

  const config = getStatusConfig()
  if (!config) return null

  return (
    <div className={`flex items-center space-x-1 text-sm ${config.color} ${className}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  )
}

/**
 * 网络状态指示器
 */
export function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineMessage(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineMessage(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // 初始状态检查
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showOfflineMessage) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg text-center">
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
          </svg>
          <span>网络连接已断开，请检查网络设置</span>
        </div>
      </div>
    </div>
  )
}