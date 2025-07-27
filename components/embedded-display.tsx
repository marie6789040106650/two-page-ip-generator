"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { WordStyleRenderer } from '@/components/word-style-renderer'
import type { FormData } from '@/lib/types'

interface EmbeddedDisplayProps {
  formData: FormData | null
  isGenerating?: boolean
}

export function EmbeddedDisplay({ formData, isGenerating = false }: EmbeddedDisplayProps) {
  const [showFullDisplay, setShowFullDisplay] = useState(false)

  // 模拟的方案内容 - 开发阶段使用占位符
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

  const handleToggleDisplay = () => {
    setShowFullDisplay(!showFullDisplay)
  }

  const handleOpenInNewTab = () => {
    window.open('/display', '_blank')
  }

  // 开发阶段：显示占位符
  if (isGenerating || !formData) {
    return (
      <Card className="bg-white shadow-lg border-0 overflow-hidden">
        <div className="p-8 text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">方案正在生成</h3>
          <p className="text-gray-600 mb-4">正在为您量身定制IP打造方案，请稍候...</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          
          {/* 开发阶段提示 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <span className="font-medium">开发阶段提示：</span> 
              此处为内容生成占位符，后续将接入实际的AI生成功能
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* 嵌入式预览 */}
      <Card className="bg-white shadow-lg border-0 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">方案预览</h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleDisplay}
              className="text-sm"
            >
              {showFullDisplay ? '收起预览' : '展开预览'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInNewTab}
              className="text-sm"
            >
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              独立页面
            </Button>
          </div>
        </div>

        {showFullDisplay ? (
          <div className="max-h-96 overflow-y-auto">
            <WordStyleRenderer 
              content={generatedContent}
              formData={formData}
            />
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {formData.storeName} IP打造方案已生成
            </h4>
            <p className="text-gray-600 mb-4">
              专业的老板IP打造方案已为您准备就绪，点击展开预览或在独立页面查看完整内容
            </p>
            <div className="flex justify-center space-x-3">
              <Button
                onClick={handleToggleDisplay}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                展开预览
              </Button>
              <Button
                variant="outline"
                onClick={handleOpenInNewTab}
              >
                独立页面查看
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* 开发阶段说明 */}
      <Card className="bg-amber-50 border-amber-200">
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-amber-800 mb-1">开发阶段说明</h4>
              <p className="text-sm text-amber-700">
                当前为开发阶段，使用模拟数据展示。后续将接入实际的AI内容生成功能，
                包括真实的方案内容生成、Banner图片生成等功能。
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}