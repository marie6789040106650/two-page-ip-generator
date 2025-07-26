'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  retryCount: number
}

/**
 * 错误边界组件
 * 捕获子组件中的JavaScript错误，记录错误并显示降级UI
 */
export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // 更新state以显示降级UI
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误信息
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // 调用外部错误处理函数
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // 发送错误报告到监控服务（如果需要）
    this.reportError(error, errorInfo)
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  /**
   * 报告错误到监控服务
   */
  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // 这里可以集成错误监控服务，如 Sentry
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }

      // 暂时只在控制台记录，实际项目中可以发送到监控服务
      console.error('Error Report:', errorReport)
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  /**
   * 重试渲染
   */
  private handleRetry = () => {
    const { retryCount } = this.state
    
    // 限制重试次数，避免无限重试
    if (retryCount >= 3) {
      console.warn('Maximum retry attempts reached')
      return
    }

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: retryCount + 1
    })

    // 延迟重试，给组件一些时间恢复
    this.retryTimeoutId = setTimeout(() => {
      // 如果重试后仍然有错误，会再次触发 componentDidCatch
    }, 100)
  }

  /**
   * 重置错误状态
   */
  private handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: 0
    })
  }

  /**
   * 返回首页
   */
  private handleGoHome = () => {
    window.location.href = '/'
  }

  /**
   * 返回上一页
   */
  private handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      this.handleGoHome()
    }
  }

  /**
   * 刷新页面
   */
  private handleRefresh = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义降级UI，使用它
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { error, errorInfo, retryCount } = this.state
      const { showDetails = false } = this.props

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                页面出现了问题
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                很抱歉，页面遇到了意外错误。请尝试以下解决方案：
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* 操作按钮 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={this.handleRetry}
                  disabled={retryCount >= 3}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {retryCount >= 3 ? '已达最大重试次数' : `重试 (${retryCount}/3)`}
                </Button>
                
                <Button
                  onClick={this.handleRefresh}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  刷新页面
                </Button>
                
                <Button
                  onClick={this.handleGoBack}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回上一页
                </Button>
                
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  返回首页
                </Button>
              </div>

              {/* 错误详情（开发模式或显式启用时显示） */}
              {(showDetails || process.env.NODE_ENV === 'development') && error && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <details className="cursor-pointer">
                    <summary className="font-medium text-gray-700 mb-2">
                      错误详情 (开发模式)
                    </summary>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>错误信息:</strong>
                        <pre className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-red-700 overflow-x-auto">
                          {error.message}
                        </pre>
                      </div>
                      
                      {error.stack && (
                        <div>
                          <strong>错误堆栈:</strong>
                          <pre className="mt-1 p-2 bg-gray-100 border rounded text-xs overflow-x-auto max-h-40">
                            {error.stack}
                          </pre>
                        </div>
                      )}
                      
                      {errorInfo?.componentStack && (
                        <div>
                          <strong>组件堆栈:</strong>
                          <pre className="mt-1 p-2 bg-gray-100 border rounded text-xs overflow-x-auto max-h-40">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {/* 帮助信息 */}
              <div className="text-center text-sm text-gray-500 border-t pt-4">
                <p>如果问题持续存在，请尝试：</p>
                <ul className="mt-2 space-y-1 text-left max-w-md mx-auto">
                  <li>• 清除浏览器缓存和Cookie</li>
                  <li>• 检查网络连接</li>
                  <li>• 使用其他浏览器访问</li>
                  <li>• 联系技术支持</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * 简化的错误边界Hook
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return {
    captureError,
    resetError
  }
}

/**
 * 网络错误边界组件
 * 专门处理网络请求相关的错误
 */
interface NetworkErrorBoundaryProps {
  children: ReactNode
  onRetry?: () => void
  retryText?: string
}

export function NetworkErrorBoundary({ 
  children, 
  onRetry,
  retryText = "重新加载" 
}: NetworkErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            网络连接出现问题
          </h3>
          <p className="text-gray-600 mb-4">
            请检查您的网络连接，然后重试
          </p>
          {onRetry && (
            <Button onClick={onRetry} className="bg-orange-600 hover:bg-orange-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              {retryText}
            </Button>
          )}
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * 数据加载错误边界组件
 */
interface DataErrorBoundaryProps {
  children: ReactNode
  onRetry?: () => void
  message?: string
}

export function DataErrorBoundary({ 
  children, 
  onRetry,
  message = "数据加载失败" 
}: DataErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6 text-blue-500" />
          </div>
          <h4 className="text-base font-medium text-gray-800 mb-2">
            {message}
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            请稍后重试，或联系技术支持
          </p>
          {onRetry && (
            <Button onClick={onRetry} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              重试
            </Button>
          )}
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}