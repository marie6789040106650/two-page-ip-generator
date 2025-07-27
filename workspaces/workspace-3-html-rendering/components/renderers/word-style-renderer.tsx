'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { WatermarkOverlay, WatermarkConfig } from '../watermark/watermark-overlay'
import { WordStyleConfig } from '@/types/renderer-types'

interface WordStyleRendererProps {
  children: React.ReactNode
  styleConfig: WordStyleConfig
  watermarkConfig: WatermarkConfig
  className?: string
}

export function WordStyleRenderer({
  children,
  styleConfig,
  watermarkConfig,
  className = ''
}: WordStyleRendererProps) {
  return (
    <Card className={`bg-white shadow-lg border-0 overflow-hidden ${className}`}>
      {/* Word文档样式的内容区域 */}
      <div 
        className="word-document-style relative"
        style={{
          fontFamily: '"Source Han Sans SC", "Microsoft YaHei", sans-serif',
          lineHeight: 1.5,
          color: '#000000',
          padding: '2.54cm 3.17cm',
          minHeight: '29.7cm', // A4高度
          maxWidth: `${styleConfig.pageWidth}px`, // A4宽度
          margin: '0 auto',
          backgroundColor: 'white'
        }}
      >
        {children}
        
        {/* 水印叠加层 - 100%保留原项目功能 */}
        {watermarkConfig.enabled && (
          <WatermarkOverlay config={watermarkConfig} />
        )}
      </div>
    </Card>
  )
}

// 默认Word样式配置 - 与原项目兼容
export const defaultWordStyleConfig: WordStyleConfig = {
  pageWidth: 794, // A4纸宽度 (210mm)
  pageHeight: 1123, // A4纸高度 (297mm)
  margins: {
    top: 96, // 2.54cm
    right: 96,
    bottom: 96,
    left: 96
  },
  headingStyles: {
    h1: {
      fontSize: 18, // 18pt
      fontWeight: 'bold',
      color: '#000000',
      margin: '12pt 0 6pt 0',
      textAlign: 'center'
    },
    h2: {
      fontSize: 16, // 16pt
      fontWeight: 'bold',
      color: '#000000',
      margin: '12pt 0 6pt 0',
      textAlign: 'left'
    },
    h3: {
      fontSize: 14, // 14pt
      fontWeight: 'bold',
      color: '#000000',
      margin: '6pt 0 4pt 0',
      textAlign: 'left'
    }
  },
  paragraphStyle: {
    fontSize: 11, // 11pt
    lineHeight: 1.5,
    margin: '0 0 6pt 0',
    textAlign: 'justify',
    textIndent: 21 // 0.74cm
  },
  listStyle: {
    margin: '6pt 0 12pt 21px', // 0.74cm
    paddingLeft: 21, // 0.74cm
    itemSpacing: 3
  },
  tableStyle: {
    borderCollapse: 'collapse',
    borderColor: '#000000',
    headerBackground: '#f0f0f0',
    cellPadding: 6
  }
}

