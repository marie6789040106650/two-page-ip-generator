"use client"

import React from "react"
import { Card } from "@/components/ui/card"

interface BannerPlaceholderProps {
  storeName?: string
  className?: string
}

export function BannerPlaceholder({ storeName, className = "" }: BannerPlaceholderProps) {
  return (
    <Card className={`card-glass relative overflow-hidden gradient-bg-alt border-2 border-dashed border-purple-200 hover-glow transition-all duration-300 ${className}`}>
      <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* 占位符图标 */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mb-3 sm:mb-4 lg:mb-6 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center hover-lift">
          <svg 
            className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-purple-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>

        {/* 占位符文本 */}
        <div className="text-center space-y-2 sm:space-y-3 max-w-xs sm:max-w-md lg:max-w-lg">
          <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-600 text-balance">
            {storeName ? `${storeName} 专属Banner` : "专属Banner图片"}
          </h3>
          <p className="text-xs sm:text-sm lg:text-base text-gray-500 text-balance">
            这里将显示为您量身定制的品牌Banner图片
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-purple-600 mt-3 sm:mt-4">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>Banner生成功能开发中...</span>
          </div>
        </div>

        {/* 装饰性元素 - 响应式调整 */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full opacity-50 animate-bounce-subtle"></div>
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-4 sm:left-8 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full opacity-40 transform -translate-y-1/2 animate-bounce-subtle" style={{ animationDelay: '1s' }}></div>
        
        {/* 额外的装饰元素 - 仅在大屏幕显示 */}
        <div className="hidden lg:block absolute top-1/4 right-1/4 w-5 h-5 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full opacity-25 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>
    </Card>
  )
}