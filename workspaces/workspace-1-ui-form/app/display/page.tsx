'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { FormData } from '@/types/form-types'

interface GeneratedContent {
  markdown: string
  formData: FormData
  timestamp: string
}

export default function DisplayPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 从URL参数获取生成的内容
    const contentParam = searchParams.get('content')
    if (contentParam) {
      try {
        const decodedContent = JSON.parse(decodeURIComponent(contentParam))
        setContent(decodedContent)
      } catch (error) {
        console.error('Failed to parse content:', error)
        setError('内容解析失败')
      }
    } else {
      // 尝试从localStorage获取
      const savedContent = localStorage.getItem('generated-content')
      if (savedContent) {
        try {
          const parsedContent = JSON.parse(savedContent)
          setContent(parsedContent)
        } catch (error) {
          console.error('Failed to load saved content:', error)
          setError('内容加载失败')
        }
      } else {
        setError('没有找到生成的内容')
      }
    }
    setIsLoading(false)
  }, [searchParams])

  const handleBackToForm = () => {
    router.push('/')
  }

  const handleExportToWorkspace3 = () => {
    if (content) {
      const contentParam = encodeURIComponent(JSON.stringify(content))
      window.open(`http://localhost:3003?content=${contentParam}`, '_blank')
    }
  }

  const handleRegenerateContent = async () => {
    if (!content?.formData) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content.formData),
      })

      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        const newContent = {
          ...result.data,
          formData: content.formData,
          timestamp: new Date().toISOString()
        }
        setContent(newContent)
        localStorage.setItem('generated-content', JSON.stringify(newContent))
      } else {
        throw new Error(result.error || '重新生成失败')
      }
      
    } catch (error) {
      console.error('Regenerate error:', error)
      setError(error instanceof Error ? error.message : '重新生成失败')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载生成内容中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">内容加载失败</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={handleBackToForm} className="bg-blue-600 hover:bg-blue-700">
            返回表单页面
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            工作区1: 方案生成完成
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content?.formData?.storeName} IP方案
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            基于您提供的信息，我们为您生成了专业的IP方案文档
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* 操作按钮栏 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                生成时间: {content?.timestamp ? new Date(content.timestamp).toLocaleString() : '未知'}
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleBackToForm}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  返回表单
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleRegenerateContent}
                  loading={isLoading}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  重新生成
                </Button>
                
                <Button
                  onClick={handleExportToWorkspace3}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  导出到工作区3
                </Button>
              </div>
            </div>
          </div>

          {/* 生成内容展示 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            {/* 内容头部 */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">生成的IP方案内容</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Markdown格式
                </div>
              </div>
            </div>

            {/* 内容主体 */}
            <div className="p-6">
              {content?.markdown ? (
                <div className="prose prose-lg max-w-none">
                  <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md border text-sm font-mono overflow-x-auto">
                    {content.markdown}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>暂无生成内容</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* 表单数据摘要 */}
          {content?.formData && (
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">基础信息摘要</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">店铺名称:</span>
                  <span className="ml-2 text-gray-600">{content.formData.storeName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">店铺类别:</span>
                  <span className="ml-2 text-gray-600">{content.formData.storeCategory}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">店铺位置:</span>
                  <span className="ml-2 text-gray-600">{content.formData.storeLocation}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">经营时长:</span>
                  <span className="ml-2 text-gray-600">{content.formData.businessDuration}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">店主姓名:</span>
                  <span className="ml-2 text-gray-600">{content.formData.ownerName}</span>
                </div>
              </div>
            </div>
          )}

          {/* 下一步提示 */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">下一步操作：</p>
                <ul className="space-y-1 text-xs">
                  <li>• 点击"导出到工作区3"进行专业样式渲染和格式化</li>
                  <li>• 点击"重新生成"使用相同信息重新生成内容</li>
                  <li>• 点击"返回表单"修改信息后重新生成</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}