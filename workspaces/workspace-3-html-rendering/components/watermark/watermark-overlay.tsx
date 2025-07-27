"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings, Eye, RotateCcw, Shield } from "lucide-react"

// 水印配置接口 - 完全保留原项目的接口定义
export interface WatermarkConfig {
  enabled: boolean
  text: string
  opacity: number
  fontSize: number
  rotation: number
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  repeat: 'none' | 'diagonal' | 'grid'
  color: 'gray' | 'red' | 'blue' | 'black'
}

// 水印配置管理器 - 100%保留原项目功能
export class WatermarkConfigManager {
  private static readonly STORAGE_KEY = 'watermarkConfig'

  static getDefaultConfig(storeName: string): WatermarkConfig {
    return {
      enabled: true,
      text: '星光传媒 AI 生成',
      opacity: 20,
      fontSize: 48,
      rotation: 45,
      position: 'center',
      repeat: 'diagonal',
      color: 'gray'
    }
  }

  static loadConfig(storeName: string): WatermarkConfig {
    if (typeof window === 'undefined') {
      return this.getDefaultConfig(storeName)
    }

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

  static saveConfig(config: WatermarkConfig): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config))
    } catch (error) {
      console.error('保存水印配置失败:', error)
    }
  }
}

// 水印设置按钮组件 - 完全保留原项目功能
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

      {/* 水印设置对话框 */}
      <WatermarkConfigDialog
        defaultConfig={watermarkConfig}
        onConfigChange={handleConfigChange}
        storeName={storeName}
        disabled={disabled}
      />
    </div>
  )
}

// 水印配置对话框组件 - 完全保留原项目功能
interface WatermarkConfigDialogProps {
  defaultConfig: WatermarkConfig
  onConfigChange: (config: WatermarkConfig) => void
  storeName: string
  disabled?: boolean
}

function WatermarkConfigDialog({
  defaultConfig,
  onConfigChange,
  storeName,
  disabled = false
}: WatermarkConfigDialogProps) {
  const [config, setConfig] = useState<WatermarkConfig>(defaultConfig)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setConfig(defaultConfig)
  }, [defaultConfig])

  const handleConfigChange = (key: keyof WatermarkConfig, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const resetToDefault = () => {
    const defaultConfig = WatermarkConfigManager.getDefaultConfig(storeName)
    setConfig(defaultConfig)
    onConfigChange(defaultConfig)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="flex items-center space-x-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">水印设置</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-600" />
            水印配置与预览
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：配置选项 */}
          <div className="space-y-4">
            {/* 顶部操作按钮 */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Label htmlFor="watermark-enabled">启用水印</Label>
                <Switch
                  id="watermark-enabled"
                  checked={config.enabled}
                  onCheckedChange={(checked) => handleConfigChange('enabled', checked)}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefault}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="text-xs">默认配置</span>
              </Button>
            </div>

            {config.enabled && (
              <>
                {/* 水印文本 */}
                <div className="space-y-2">
                  <Label htmlFor="watermark-text">水印文本</Label>
                  <Input
                    id="watermark-text"
                    value={config.text}
                    onChange={(e) => handleConfigChange('text', e.target.value)}
                    placeholder="输入水印文本"
                  />
                </div>

                {/* 透明度 */}
                <div className="space-y-2">
                  <Label>透明度: {config.opacity}%</Label>
                  <Slider
                    value={[config.opacity]}
                    onValueChange={([value]) => handleConfigChange('opacity', value)}
                    max={100}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* 字体大小 */}
                <div className="space-y-2">
                  <Label>字体大小: {config.fontSize}px</Label>
                  <Slider
                    value={[config.fontSize]}
                    onValueChange={([value]) => handleConfigChange('fontSize', value)}
                    max={100}
                    min={20}
                    step={4}
                    className="w-full"
                  />
                </div>

                {/* 旋转角度 */}
                <div className="space-y-2">
                  <Label>旋转角度: {config.rotation}°</Label>
                  <Slider
                    value={[config.rotation]}
                    onValueChange={([value]) => handleConfigChange('rotation', value)}
                    max={90}
                    min={-90}
                    step={15}
                    className="w-full"
                  />
                </div>

                {/* 位置 */}
                <div className="space-y-2">
                  <Label>位置</Label>
                  <Select
                    value={config.position}
                    onValueChange={(value) => handleConfigChange('position', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="center">居中</SelectItem>
                      <SelectItem value="top-left">左上角</SelectItem>
                      <SelectItem value="top-right">右上角</SelectItem>
                      <SelectItem value="bottom-left">左下角</SelectItem>
                      <SelectItem value="bottom-right">右下角</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 重复模式 */}
                <div className="space-y-2">
                  <Label>重复模式</Label>
                  <Select
                    value={config.repeat}
                    onValueChange={(value) => handleConfigChange('repeat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">单个</SelectItem>
                      <SelectItem value="diagonal">对角线</SelectItem>
                      <SelectItem value="grid">网格</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 颜色 */}
                <div className="space-y-2">
                  <Label>颜色</Label>
                  <Select
                    value={config.color}
                    onValueChange={(value) => handleConfigChange('color', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gray">灰色</SelectItem>
                      <SelectItem value="red">红色</SelectItem>
                      <SelectItem value="blue">蓝色</SelectItem>
                      <SelectItem value="black">黑色</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          {/* 右侧：预览区域 */}
          <div className="space-y-4">
            <div className="sticky top-0">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-blue-600" />
                  <Label className="text-sm font-medium">水印预览效果</Label>
                </div>

                <WatermarkPreview config={config} />

                <div className="text-xs text-gray-500 text-center">
                  * 预览效果仅供参考，实际导出效果可能因文档内容而略有差异
                </div>

                {/* 配置摘要 */}
                {config.enabled && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">当前配置</h4>
                    <div className="text-xs text-blue-700 space-y-1">
                      <div>文本: {config.text}</div>
                      <div>透明度: {config.opacity}%</div>
                      <div>大小: {config.fontSize}px</div>
                      <div>角度: {config.rotation}°</div>
                      <div>位置: {getPositionLabel(config.position)}</div>
                      <div>模式: {getRepeatLabel(config.repeat)}</div>
                      <div>颜色: {getColorLabel(config.color)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 水印预览组件 - 完全保留原项目功能
interface WatermarkPreviewProps {
  config: WatermarkConfig
}

function WatermarkPreview({ config }: WatermarkPreviewProps) {
  const colorMap = {
    gray: '#6b7280',
    red: '#ef4444',
    blue: '#3b82f6',
    black: '#000000'
  }

  const renderWatermarkElements = () => {
    if (!config.enabled) return null

    const baseStyle = {
      color: colorMap[config.color],
      opacity: config.opacity / 100,
      fontSize: `${Math.max(config.fontSize / 3.5, 12)}px`,
      transform: `rotate(${config.rotation}deg)`,
      transformOrigin: 'center',
      position: 'absolute' as const,
      pointerEvents: 'none' as const,
      userSelect: 'none' as const,
      whiteSpace: 'nowrap' as const
    }

    switch (config.repeat) {
      case 'diagonal':
        return Array.from({ length: 9 }, (_, i) => {
          const row = Math.floor(i / 3) - 1
          const col = (i % 3) - 1
          return (
            <div
              key={i}
              style={{
                ...baseStyle,
                top: `${50 + row * 30}%`,
                left: `${50 + col * 30}%`,
                transform: `translate(-50%, -50%) rotate(${config.rotation}deg)`
              }}
            >
              {config.text}
            </div>
          )
        })

      case 'grid':
        return Array.from({ length: 12 }, (_, i) => {
          const row = Math.floor(i / 4)
          const col = i % 4
          return (
            <div
              key={i}
              style={{
                ...baseStyle,
                top: `${20 + row * 25}%`,
                left: `${20 + col * 20}%`,
                transform: `translate(-50%, -50%) rotate(${config.rotation}deg)`
              }}
            >
              {config.text}
            </div>
          )
        })

      case 'none':
      default:
        const position = getPositionStyle(config.position)
        return (
          <div style={{ ...baseStyle, ...position }}>
            {config.text}
          </div>
        )
    }
  }

  return (
    <div className="relative w-full h-48 bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* 模拟文档内容 */}
      <div className="p-4 text-sm text-gray-700">
        <h3 className="font-bold mb-2">《星光传媒营销方案》</h3>
        <p className="mb-2">
          本方案针对目标客户群体制定了完整的营销策略，
          包含品牌定位、内容策略、渠道布局等核心要素。
        </p>
        <p className="text-gray-600">
          水印将根据您的设置叠加在文档内容之上，
          为您的知识产权提供有效保护。
        </p>
      </div>

      {/* 水印效果 */}
      {renderWatermarkElements()}
    </div>
  )
}

// 水印叠加层组件 - 用于实际渲染
interface WatermarkOverlayProps {
  config: WatermarkConfig
  className?: string
}

export function WatermarkOverlay({ config, className = '' }: WatermarkOverlayProps) {
  if (!config.enabled) return null

  const colorMap = {
    gray: '#6b7280',
    red: '#ef4444',
    blue: '#3b82f6',
    black: '#000000'
  }

  const renderWatermarkElements = () => {
    const baseStyle = {
      color: colorMap[config.color],
      opacity: config.opacity / 100,
      fontSize: `${config.fontSize}px`,
      transform: `rotate(${config.rotation}deg)`,
      transformOrigin: 'center',
      position: 'absolute' as const,
      pointerEvents: 'none' as const,
      userSelect: 'none' as const,
      whiteSpace: 'nowrap' as const,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold'
    }

    switch (config.repeat) {
      case 'diagonal':
        return Array.from({ length: 25 }, (_, i) => {
          const row = Math.floor(i / 5) - 2
          const col = (i % 5) - 2
          return (
            <div
              key={i}
              style={{
                ...baseStyle,
                top: `${50 + row * 20}%`,
                left: `${50 + col * 25}%`,
                transform: `translate(-50%, -50%) rotate(${config.rotation}deg)`
              }}
            >
              {config.text}
            </div>
          )
        })

      case 'grid':
        return Array.from({ length: 35 }, (_, i) => {
          const row = Math.floor(i / 7)
          const col = i % 7
          return (
            <div
              key={i}
              style={{
                ...baseStyle,
                top: `${10 + row * 15}%`,
                left: `${10 + col * 13}%`,
                transform: `translate(-50%, -50%) rotate(${config.rotation}deg)`
              }}
            >
              {config.text}
            </div>
          )
        })

      case 'none':
      default:
        const position = getPositionStyle(config.position)
        return (
          <div style={{ ...baseStyle, ...position }}>
            {config.text}
          </div>
        )
    }
  }

  return (
    <div
      className={`watermark-overlay ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      {renderWatermarkElements()}
    </div>
  )
}

// 辅助函数 - 完全保留原项目功能
function getPositionStyle(position: WatermarkConfig['position']) {
  switch (position) {
    case 'center':
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    case 'top-left':
      return { top: '10%', left: '10%' }
    case 'top-right':
      return { top: '10%', right: '10%' }
    case 'bottom-left':
      return { bottom: '10%', left: '10%' }
    case 'bottom-right':
      return { bottom: '10%', right: '10%' }
    default:
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
  }
}

function getPositionLabel(position: WatermarkConfig['position']): string {
  const labels = {
    center: '居中',
    'top-left': '左上角',
    'top-right': '右上角',
    'bottom-left': '左下角',
    'bottom-right': '右下角'
  }
  return labels[position]
}

function getRepeatLabel(repeat: WatermarkConfig['repeat']): string {
  const labels = {
    none: '单个',
    diagonal: '对角线',
    grid: '网格'
  }
  return labels[repeat]
}

function getColorLabel(color: WatermarkConfig['color']): string {
  const labels = {
    gray: '灰色',
    red: '红色',
    blue: '蓝色',
    black: '黑色'
  }
  return labels[color]
}