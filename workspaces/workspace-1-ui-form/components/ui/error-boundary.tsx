'use client'

import React, { Component, ReactNode } from 'react'
import { Button } from './button'

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
    errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ error, errorInfo })
        this.props.onError?.(error, errorInfo)

        // 记录错误到控制台
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg border border-red-200 p-6 max-w-md w-full text-center">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">出现了一些问题</h2>
                        <p className="text-gray-600 mb-4">
                            表单组件遇到了意外错误，请尝试刷新页面或联系技术支持。
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-4 text-left">
                                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                    查看错误详情
                                </summary>
                                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="space-y-2">
                            <Button
                                onClick={this.handleReset}
                                className="w-full"
                            >
                                重试
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                                className="w-full"
                            >
                                刷新页面
                            </Button>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

// 网络错误处理组件
interface NetworkErrorProps {
    error: string
    onRetry: () => void
    retryCount?: number
    maxRetries?: number
}

export function NetworkError({
    error,
    onRetry,
    retryCount = 0,
    maxRetries = 3
}: NetworkErrorProps) {
    const canRetry = retryCount < maxRetries

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800 mb-1">
                        网络请求失败
                    </h3>
                    <p className="text-sm text-red-700 mb-3">
                        {error}
                    </p>
                    {retryCount > 0 && (
                        <p className="text-xs text-red-600 mb-3">
                            已重试 {retryCount} 次
                        </p>
                    )}
                    <div className="flex space-x-2">
                        {canRetry && (
                            <Button
                                size="sm"
                                onClick={onRetry}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                重试 ({maxRetries - retryCount} 次机会)
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.location.reload()}
                            className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                            刷新页面
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}