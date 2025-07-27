# 水印系统设计方案

## 🎯 水印功能概述

基于原项目的水印系统，新项目需要完整保留并增强水印功能，支持：
- 可配置的水印文本、透明度、大小、角度、位置
- 多种重复模式（单个、对角线、网格）
- 实时预览效果
- Word和PDF导出时的水印应用

## 🏗️ 水印系统架构

### 核心组件结构
```
水印系统/
├── components/
│   ├── watermark-config-dialog.tsx    # 水印配置对话框
│   ├── watermark-settings-button.tsx  # 水印设置按钮
│   ├── watermark-preview.tsx          # 水印预览组件
│   └── watermark-overlay.tsx          # 水印叠加层
├── lib/
│   ├── watermark-config.ts            # 水印配置管理
│   ├── watermark-renderer.ts          # 水印渲染引擎
│   ├── watermark-export.ts            # 导出时水印应用
│   └── watermark-storage.ts           # 水印配置存储
├── hooks/
│   ├── use-watermark-config.ts        # 水印配置Hook
│   └── use-watermark-preview.ts       # 水印预览Hook
└── styles/
    └── watermark-preview.css           # 水印预览样式
```

## 📋 水印配置接口

### WatermarkConfig类型定义
```typescript
export interface WatermarkConfig {
  enabled: boolean                      // 是否启用水印
  text: string                         // 水印文本
  opacity: number                      // 透明度 (10-100)
  fontSize: number                     // 字体大小 (20-100px)
  rotation: number                     // 旋转角度 (-90 to 90度)
  position: WatermarkPosition          // 位置
  repeat: WatermarkRepeat              // 重复模式
  color: WatermarkColor                // 颜色
}

export type WatermarkPosition = 
  | 'center' 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right'

export type WatermarkRepeat = 
  | 'none'      // 单个水印
  | 'diagonal'  // 对角线重复
  | 'grid'      // 网格重复

export type WatermarkColor = 
  | 'gray' 
  | 'red' 
  | 'blue' 
  | 'black'
```

## 🔧 核心实现

### 1. 水印配置管理器
```typescript
// lib/watermark-config-manager.ts
export class WatermarkConfigManager {
  private static readonly STORAGE_KEY = 'watermarkConfig'
  
  // 获取默认配置
  static getDefaultConfig(storeName: string): WatermarkConfig {
    return {
      enabled: false,
      text: `© ${storeName}`,
      opacity: 20,
      fontSize: 48,
      rotation: 45,
      position: 'center',
      repeat: 'diagonal',
      color: 'gray'
    }
  }
  
  // 加载配置
  static loadConfig(storeName: string): WatermarkConfig {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY)
      if (saved) {
        const config = JSON.parse(saved)
        return { ...this.getDefaultConfig(storeName), ...config }
      }
    } catch (error) {
      console.warn('加载水印配置失败:', error)
    }
    return this.getDefaultConfig(storeName)
  }
  
  // 保存配置
  static saveConfig(config: WatermarkConfig): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config))
    } catch (error) {
      console.error('保存水印配置失败:', error)
    }
  }
  
  // 重置为默认配置
  static resetToDefault(storeName: string): WatermarkConfig {
    const defaultConfig = this.getDefaultConfig(storeName)
    this.saveConfig(defaultConfig)
    return defaultConfig
  }
}
```

### 2. 水印渲染引擎
```typescript
// lib/watermark-renderer.ts
export class WatermarkRenderer {
  // 生成水印CSS样式
  static generateWatermarkCSS(config: WatermarkConfig): string {
    const colorMap = {
      gray: '#6b7280',
      red: '#ef4444',
      blue: '#3b82f6',
      black: '#000000'
    }
    
    return `
      .watermark-element {
        position: absolute;
        color: ${colorMap[config.color]};
        opacity: ${config.opacity / 100};
        font-size: ${config.fontSize}px;
        font-weight: bold;
        pointer-events: none;
        user-select: none;
        z-index: -1;
        transform: rotate(${config.rotation}deg);
        transform-origin: center;
        white-space: nowrap;
      }
    `
  }
  
  // 计算水印位置
  static calculateWatermarkPositions(
    config: WatermarkConfig,
    containerWidth: number,
    containerHeight: number
  ): Array<{ x: number; y: number }> {
    const positions: Array<{ x: number; y: number }> = []
    
    switch (config.repeat) {
      case 'none':
        positions.push(this.getSinglePosition(config, containerWidth, containerHeight))
        break
      case 'diagonal':
        positions.push(...this.getDiagonalPositions(containerWidth, containerHeight))
        break
      case 'grid':
        positions.push(...this.getGridPositions(containerWidth, containerHeight))
        break
    }
    
    return positions
  }
  
  private static getSinglePosition(
    config: WatermarkConfig,
    width: number,
    height: number
  ): { x: number; y: number } {
    switch (config.position) {
      case 'center':
        return { x: width / 2, y: height / 2 }
      case 'top-left':
        return { x: 50, y: 50 }
      case 'top-right':
        return { x: width - 50, y: 50 }
      case 'bottom-left':
        return { x: 50, y: height - 50 }
      case 'bottom-right':
        return { x: width - 50, y: height - 50 }
      default:
        return { x: width / 2, y: height / 2 }
    }
  }
  
  private static getDiagonalPositions(
    width: number,
    height: number
  ): Array<{ x: number; y: number }> {
    const positions: Array<{ x: number; y: number }> = []
    const spacing = 150
    
    for (let x = -spacing; x < width + spacing; x += spacing) {
      for (let y = -spacing; y < height + spacing; y += spacing) {
        positions.push({ x, y })
      }
    }
    
    return positions
  }
  
  private static getGridPositions(
    width: number,
    height: number
  ): Array<{ x: number; y: number }> {
    const positions: Array<{ x: number; y: number }> = []
    const spacingX = 200
    const spacingY = 150
    
    for (let x = spacingX / 2; x < width; x += spacingX) {
      for (let y = spacingY / 2; y < height; y += spacingY) {
        positions.push({ x, y })
      }
    }
    
    return positions
  }
}
```

### 3. 导出时水印应用
```typescript
// lib/watermark-export-handler.ts
export class WatermarkExportHandler {
  // 为HTML添加水印
  static addWatermarkToHTML(html: string, config: WatermarkConfig): string {
    if (!config.enabled) return html
    
    const watermarkCSS = WatermarkRenderer.generateWatermarkCSS(config)
    const watermarkHTML = this.generateWatermarkHTML(config)
    
    // 在HTML中插入水印样式和元素
    const styledHTML = html.replace(
      '</head>',
      `<style>${watermarkCSS}</style></head>`
    )
    
    return styledHTML.replace(
      '<body>',
      `<body>${watermarkHTML}`
    )
  }
  
  // 为PDF添加水印
  static addWatermarkToPDF(
    pdf: any, // jsPDF实例
    config: WatermarkConfig,
    pageWidth: number,
    pageHeight: number
  ): void {
    if (!config.enabled) return
    
    const pageCount = pdf.getNumberOfPages()
    const colorMap = {
      gray: [128, 128, 128],
      red: [239, 68, 68],
      blue: [59, 130, 246],
      black: [0, 0, 0]
    }
    
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFontSize(config.fontSize / 2) // PDF中字体需要缩放
      pdf.setTextColor(...colorMap[config.color])
      
      const positions = WatermarkRenderer.calculateWatermarkPositions(
        config,
        pageWidth,
        pageHeight
      )
      
      positions.forEach(pos => {
        pdf.text(config.text, pos.x, pos.y, {
          angle: -config.rotation,
          align: 'center'
        })
      })
    }
  }
  
  // 为Word文档添加水印
  static addWatermarkToWord(html: string, config: WatermarkConfig): string {
    if (!config.enabled) return html
    
    const watermarkStyle = `
      .word-watermark {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-${config.rotation}deg);
        font-size: ${config.fontSize}pt;
        color: rgba(${this.getColorRGB(config.color)}, ${config.opacity / 100});
        z-index: -1;
        pointer-events: none;
        font-weight: bold;
      }
    `
    
    const watermarkElement = `<div class="word-watermark">${config.text}</div>`
    
    return html
      .replace('</head>', `<style>${watermarkStyle}</style></head>`)
      .replace('<body>', `<body>${watermarkElement}`)
  }
  
  private static generateWatermarkHTML(config: WatermarkConfig): string {
    // 根据重复模式生成不同的HTML结构
    switch (config.repeat) {
      case 'diagonal':
        return this.generateDiagonalWatermarks(config)
      case 'grid':
        return this.generateGridWatermarks(config)
      case 'none':
      default:
        return this.generateSingleWatermark(config)
    }
  }
  
  private static generateSingleWatermark(config: WatermarkConfig): string {
    const position = this.getPositionStyle(config.position)
    return `
      <div class="watermark-element" style="${position}">
        ${config.text}
      </div>
    `
  }
  
  private static generateDiagonalWatermarks(config: WatermarkConfig): string {
    let html = ''
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        html += `
          <div class="watermark-element" style="
            top: ${50 + i * 30}%;
            left: ${50 + j * 30}%;
            transform: translate(-50%, -50%) rotate(${config.rotation}deg);
          ">
            ${config.text}
          </div>
        `
      }
    }
    return html
  }
  
  private static generateGridWatermarks(config: WatermarkConfig): string {
    let html = ''
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        html += `
          <div class="watermark-element" style="
            top: ${20 + i * 25}%;
            left: ${20 + j * 30}%;
            transform: translate(-50%, -50%) rotate(${config.rotation}deg);
          ">
            ${config.text}
          </div>
        `
      }
    }
    return html
  }
  
  private static getPositionStyle(position: WatermarkPosition): string {
    switch (position) {
      case 'center':
        return 'top: 50%; left: 50%; transform: translate(-50%, -50%);'
      case 'top-left':
        return 'top: 10%; left: 10%;'
      case 'top-right':
        return 'top: 10%; right: 10%;'
      case 'bottom-left':
        return 'bottom: 10%; left: 10%;'
      case 'bottom-right':
        return 'bottom: 10%; right: 10%;'
      default:
        return 'top: 50%; left: 50%; transform: translate(-50%, -50%);'
    }
  }
  
  private static getColorRGB(color: WatermarkColor): string {
    const colorMap = {
      gray: '107, 114, 128',
      red: '239, 68, 68',
      blue: '59, 130, 246',
      black: '0, 0, 0'
    }
    return colorMap[color]
  }
}
```

## 🎨 水印组件实现

### 水印设置按钮组件
```typescript
// components/watermark-settings-button.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield, Settings } from "lucide-react"
import { WatermarkConfigDialog } from "./watermark-config-dialog"
import { WatermarkConfigManager } from "@/lib/watermark-config-manager"
import type { WatermarkConfig } from "@/lib/types"

interface WatermarkSettingsButtonProps {
  storeName: string
  disabled?: boolean
  className?: string
  onConfigChange?: (config: WatermarkConfig) => void
}

export function WatermarkSettingsButton({
  storeName,
  disabled = false,
  className = "",
  onConfigChange
}: WatermarkSettingsButtonProps) {
  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>(() => 
    WatermarkConfigManager.loadConfig(storeName)
  )

  const handleConfigChange = (config: WatermarkConfig) => {
    setWatermarkConfig(config)
    WatermarkConfigManager.saveConfig(config)
    onConfigChange?.(config)
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* 水印状态指示 */}
      {watermarkConfig.enabled && (
        <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
          <Shield className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">已启用水印</span>
        </div>
      )}

      {/* 水印设置按钮 */}
      <WatermarkConfigDialog
        defaultConfig={watermarkConfig}
        onConfigChange={handleConfigChange}
        storeName={storeName}
        disabled={disabled}
      />
    </div>
  )
}
```

## 🔄 工作区集成方案

### 工作区分配
1. **工作区1 (UI复用)**: 复用原项目的水印UI组件
2. **工作区2 (API集成)**: 确保API支持水印配置传递
3. **工作区3 (HTML渲染)**: 在HTML渲染时应用水印
4. **工作区4 (导出引擎)**: 在Word/PDF导出时应用水印

### 集成检查清单
- [ ] 水印配置组件复用完成
- [ ] 水印预览功能正常
- [ ] 水印配置持久化存储
- [ ] HTML渲染集成水印
- [ ] Word导出应用水印
- [ ] PDF导出应用水印
- [ ] 跨浏览器兼容性测试
- [ ] 移动端水印显示测试

## 📊 水印质量标准

### 视觉效果标准
- 水印透明度适中，不影响内容阅读
- 水印位置准确，符合配置要求
- 水印重复模式正确显示
- 水印颜色和大小符合设置

### 技术标准
- 水印配置实时生效
- 导出文档水印质量保持
- 水印不影响文档性能
- 水印配置数据安全存储

### 兼容性标准
- 支持主流浏览器
- Word文档水印兼容性
- PDF文档水印显示正确
- 移动端水印适配良好

---

**水印系统是知识产权保护的重要功能，必须确保在新项目中得到完整保留和优化！** 🛡️