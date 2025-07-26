"use client"

import React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export const PageHeader: React.FC = () => {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-soft border-b border-gray-100 sticky top-0 z-50 safe-top">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-12 sm:h-14 lg:h-16">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover-lift touch-manipulation">
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-soft">
                <span className="text-white font-bold text-sm sm:text-base lg:text-lg">星</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">星光传媒</h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">方案生成器</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <Badge variant="secondary" className="hidden sm:inline-flex bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 hover-lift text-xs lg:text-sm px-2 lg:px-3 py-1">
              抖音第一人设打造专家
            </Badge>
            <Badge variant="secondary" className="sm:hidden bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs px-2 py-1 hover-lift">
              专家
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
}