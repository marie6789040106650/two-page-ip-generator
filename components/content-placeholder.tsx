"use client"

import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface ContentPlaceholderProps {
  className?: string
}

export function ContentPlaceholder({ className = "" }: ContentPlaceholderProps) {
  return (
    <div className={`space-y-4 sm:space-y-6 lg:space-y-8 ${className}`}>
      {/* 主要内容区域 */}
      <Card className="card-glass gradient-bg-alt border-2 border-dashed border-gray-200 hover-glow transition-all duration-300">
        <CardHeader className="text-center pb-3 sm:pb-4 px-4 sm:px-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center hover-lift">
            <svg 
              className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-600 text-balance">IP打造方案内容</h3>
          <p className="text-sm sm:text-base text-gray-500 text-balance">这里将显示为您生成的专业IP打造方案</p>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          {/* 模拟内容区块 */}
          <div className="space-y-2 sm:space-y-3">
            <div className="h-3 sm:h-4 bg-gray-200 rounded placeholder-shimmer"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded placeholder-shimmer w-5/6"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded placeholder-shimmer w-4/6"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover-lift">
              <div className="h-2.5 sm:h-3 bg-gray-200 rounded placeholder-shimmer mb-2"></div>
              <div className="h-2.5 sm:h-3 bg-gray-200 rounded placeholder-shimmer w-3/4"></div>
            </div>
            <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover-lift">
              <div className="h-2.5 sm:h-3 bg-gray-200 rounded placeholder-shimmer mb-2"></div>
              <div className="h-2.5 sm:h-3 bg-gray-200 rounded placeholder-shimmer w-3/4"></div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <span>方案生成功能开发中...</span>
          </div>
        </CardContent>
      </Card>

      {/* 附加内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="card-glass bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 hover-glow-blue transition-all duration-300">
          <CardHeader className="text-center pb-2 sm:pb-3 px-4 sm:px-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 rounded-full bg-gradient-to-r from-blue-200 to-indigo-200 flex items-center justify-center hover-lift">
              <svg 
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
            </div>
            <h4 className="text-base sm:text-lg font-medium text-gray-600">核心策略</h4>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-2">
              <div className="h-2.5 sm:h-3 bg-blue-200 rounded placeholder-shimmer"></div>
              <div className="h-2.5 sm:h-3 bg-blue-200 rounded placeholder-shimmer w-4/5"></div>
              <div className="h-2.5 sm:h-3 bg-blue-200 rounded placeholder-shimmer w-3/5"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-dashed border-green-200 hover-glow transition-all duration-300">
          <CardHeader className="text-center pb-2 sm:pb-3 px-4 sm:px-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 rounded-full bg-gradient-to-r from-green-200 to-emerald-200 flex items-center justify-center hover-lift">
              <svg 
                className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                />
              </svg>
            </div>
            <h4 className="text-base sm:text-lg font-medium text-gray-600">执行计划</h4>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-2">
              <div className="h-2.5 sm:h-3 bg-green-200 rounded placeholder-shimmer"></div>
              <div className="h-2.5 sm:h-3 bg-green-200 rounded placeholder-shimmer w-4/5"></div>
              <div className="h-2.5 sm:h-3 bg-green-200 rounded placeholder-shimmer w-3/5"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 底部总结区域 */}
      <Card className="card-glass bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-dashed border-purple-200 hover-glow transition-all duration-300">
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto rounded-full bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center hover-lift">
              <svg 
                className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                />
              </svg>
            </div>
            <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-600 text-balance">专业方案总结</h4>
            <div className="max-w-xs sm:max-w-md lg:max-w-2xl mx-auto space-y-2 sm:space-y-3">
              <div className="h-3 sm:h-4 bg-purple-200 rounded placeholder-shimmer"></div>
              <div className="h-3 sm:h-4 bg-purple-200 rounded placeholder-shimmer w-5/6 mx-auto"></div>
              <div className="h-3 sm:h-4 bg-purple-200 rounded placeholder-shimmer w-4/6 mx-auto"></div>
            </div>
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-purple-600 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-purple-200">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>AI正在为您量身定制专业方案...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}