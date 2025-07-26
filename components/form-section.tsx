"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

import { ArrowRight, Settings } from "lucide-react"
import { FormData, ExpandedKeywords } from "@/lib/types"
import { CHAT_MODELS, getAvailableChatModels } from "@/lib/models"
import { useKeywordStats } from "@/hooks/use-keyword-stats"
import { useKeywordField } from "@/hooks/use-keyword-field-improved"
import { BulkInputSection } from "./bulk-input-section"
import { KeywordExpansionPanel } from "./keyword-expansion-panel"


interface FormSectionProps {
  formData: FormData
  onInputChange: (field: string, value: string) => void
  expandedKeywords: ExpandedKeywords | null
  isExpandingKeywords: boolean
  selectedModelId: string
  onModelChange: (modelId: string) => void
  showModelSettings: boolean
  onToggleModelSettings: () => void
  isLoading: boolean
  error: string
  onSubmit: () => void
  setFormData?: (data: FormData) => void
  setExpandedKeywords?: (keywords: ExpandedKeywords | null) => void
  setIsExpandingKeywords?: (loading: boolean) => void
  fieldErrors?: Record<string, string>
  onFieldValidation?: (field: string, isValid: boolean, error?: string) => void
}

export const FormSection: React.FC<FormSectionProps> = ({
  formData,
  onInputChange,
  expandedKeywords,
  isExpandingKeywords,
  selectedModelId,
  onModelChange,
  showModelSettings,
  onToggleModelSettings,
  isLoading,
  error,
  onSubmit,
  setFormData,
  setExpandedKeywords,
  setIsExpandingKeywords,
  fieldErrors = {},
  onFieldValidation
}) => {
  // 添加焦点状态管理
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // 字段验证函数
  const validateField = (field: string, value: string): { isValid: boolean; error?: string } => {
    const trimmedValue = value.trim()

    // 必填字段验证
    const requiredFields = ['storeName', 'storeCategory', 'storeLocation', 'businessDuration', 'storeFeatures', 'ownerName', 'ownerFeatures']
    if (requiredFields.includes(field) && !trimmedValue) {
      const fieldLabels: Record<string, string> = {
        storeName: '店铺名称',
        storeCategory: '店铺品类',
        storeLocation: '店铺位置',
        businessDuration: '经营时长',
        storeFeatures: '店铺特色',
        ownerName: '老板姓名',
        ownerFeatures: '老板特色'
      }
      return { isValid: false, error: `${fieldLabels[field]}不能为空` }
    }

    // 长度验证
    const lengthLimits: Record<string, { max: number; label: string }> = {
      storeName: { max: 50, label: '店铺名称' },
      storeCategory: { max: 30, label: '店铺品类' },
      storeLocation: { max: 100, label: '店铺位置' },
      businessDuration: { max: 20, label: '经营时长' },
      storeFeatures: { max: 500, label: '店铺特色' },
      ownerName: { max: 20, label: '老板姓名' },
      ownerFeatures: { max: 500, label: '老板特色' }
    }

    if (lengthLimits[field] && trimmedValue.length > lengthLimits[field].max) {
      return {
        isValid: false,
        error: `${lengthLimits[field].label}不能超过${lengthLimits[field].max}个字符`
      }
    }

    // 特殊格式验证
    if (field === 'ownerName' && trimmedValue && !/^[\u4e00-\u9fa5a-zA-Z\s]{1,20}$/.test(trimmedValue)) {
      return { isValid: false, error: '老板姓名只能包含中文、英文和空格' }
    }

    return { isValid: true }
  }

  // 处理输入变化并进行实时验证
  const handleInputChangeWithValidation = (field: string, value: string) => {
    onInputChange(field, value)

    // 实时验证
    if (onFieldValidation) {
      const validation = validateField(field, value)
      onFieldValidation(field, validation.isValid, validation.error)
    }
  }

  // 获取字段错误信息
  const getFieldError = (field: string): string | undefined => {
    return fieldErrors[field]
  }

  // 检查字段是否有错误
  const hasFieldError = (field: string): boolean => {
    return !!fieldErrors[field]
  }

  // 获取输入框样式类名
  const getInputClassName = (field: string, baseClassName: string): string => {
    const hasError = hasFieldError(field)
    return `${baseClassName} ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`
  }

  // 关键词统计功能
  const {
    getPopularCategories
  } = useKeywordStats()

  // 关键词字段处理功能
  const {
    handleKeywordClick,
    handleFieldFocus,
    handleFieldBlur,
    handleDelayedHide,
    handleMouseEnter
  } = useKeywordField({
    formData,
    onInputChange,
    onKeywordExpansion: () => {
      if (setIsExpandingKeywords && setExpandedKeywords) {
        setIsExpandingKeywords(true);
        // 关键词拓展逻辑
        fetch('/api/expand-keywords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storeType: formData.storeType || formData.storeCategory,
            storeFeatures: formData.storeFeatures,
            targetAudience: formData.targetAudience || '',
            businessGoals: formData.businessGoals || ''
          })
        })
          .then(res => res.json())
          .then(data => {
            setExpandedKeywords(data);
            setIsExpandingKeywords(false);
          })
          .catch(error => {
            console.error('关键词拓展出错:', error);
            setIsExpandingKeywords(false);
          });
      }
    },
    setFocusedField
  })



  return (
    <Card className="card-glass shadow-strong border-0 hover-glow transition-all duration-500 animate-slide-up">
      <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl font-bold gradient-text animate-fade-in">
          商家信息填写
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm sm:text-base animate-fade-in" style={{ animationDelay: '0.1s' }}>
          请填写以下信息，我们将为您生成专业的老板IP打造方案
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label htmlFor="storeName" className="text-sm font-medium text-gray-700">
              店的名字 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="storeName"
              placeholder="如：馋嘴老张麻辣烫"
              value={formData.storeName}
              onChange={(e) => handleInputChangeWithValidation("storeName", e.target.value)}
              className={getInputClassName("storeName", "input-focus hover-lift transition-all duration-200")}
            />
            {hasFieldError("storeName") && (
              <p className="text-red-500 text-xs mt-1 animate-slide-down">
                {getFieldError("storeName")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeCategory" className="text-sm font-medium text-gray-700">
              店的品类 <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="relative">
                <Input
                  id="storeCategory"
                  placeholder="请选择或输入行业类型"
                  value={formData.storeCategory}
                  onChange={(e) => handleInputChangeWithValidation("storeCategory", e.target.value)}
                  className={getInputClassName("storeCategory", "input-focus hover-lift transition-all duration-200 pr-10")}
                  onClick={() => {
                    const dropdown = document.getElementById('custom-category-dropdown');
                    if (dropdown) {
                      dropdown.classList.toggle('hidden');
                    }
                  }}
                  onFocus={() => {
                    const dropdown = document.getElementById('custom-category-dropdown');
                    if (dropdown) {
                      dropdown.classList.remove('hidden');
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      const dropdown = document.getElementById('custom-category-dropdown');
                      if (dropdown) {
                        dropdown.classList.add('hidden');
                      }
                    }, 200);
                  }}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => {
                    const dropdown = document.getElementById('custom-category-dropdown');
                    if (dropdown) {
                      dropdown.classList.toggle('hidden');
                    }
                  }}>
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div
                id="custom-category-dropdown"
                className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-medium hidden animate-slide-down"
                style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#d1d5db transparent'
                }}
              >
                {(() => {
                  const fixedCategories = ["餐饮", "服务业", "教育培训", "美业", "零售", "其他"];
                  const dynamicCategories = getPopularCategories();
                  const allCategories = [...new Set([...fixedCategories, ...dynamicCategories])];
                  const sortedCategories = allCategories.sort((a, b) => a.localeCompare(b, 'zh-CN'));

                  return sortedCategories.map((category, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 cursor-pointer hover:bg-purple-50 transition-colors duration-150 touch-manipulation ${formData.storeCategory === category ? 'bg-purple-100' : ''}`}
                      onClick={() => {
                        handleInputChangeWithValidation("storeCategory", category);
                        const dropdown = document.getElementById('custom-category-dropdown');
                        if (dropdown) {
                          dropdown.classList.add('hidden');
                        }
                      }}
                    >
                      {category}
                    </div>
                  ));
                })()}
              </div>
            </div>
            {hasFieldError("storeCategory") && (
              <p className="text-red-500 text-xs mt-1 animate-slide-down">
                {getFieldError("storeCategory")}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label htmlFor="storeLocation" className="text-sm font-medium text-gray-700">
              店的位置 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="storeLocation"
              placeholder="如：北京市朝阳区望京SOHO"
              value={formData.storeLocation}
              onChange={(e) => handleInputChangeWithValidation("storeLocation", e.target.value)}
              className={getInputClassName("storeLocation", "input-focus hover-lift transition-all duration-200")}
            />
            {hasFieldError("storeLocation") && (
              <p className="text-red-500 text-xs mt-1 animate-slide-down">
                {getFieldError("storeLocation")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessDuration" className="text-sm font-medium text-gray-700">
              开店时长 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="businessDuration"
              placeholder="如：5年"
              value={formData.businessDuration}
              onChange={(e) => handleInputChangeWithValidation("businessDuration", e.target.value)}
              className={getInputClassName("businessDuration", "input-focus hover-lift transition-all duration-200")}
            />
            {hasFieldError("businessDuration") && (
              <p className="text-red-500 text-xs mt-1 animate-slide-down">
                {getFieldError("businessDuration")}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="storeFeatures" className="text-sm font-medium text-gray-700">
            店的特色 <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="storeFeatures"
            placeholder="如：地道手工汤底、回头客多"
            value={formData.storeFeatures}
            onChange={(e) => handleInputChangeWithValidation("storeFeatures", e.target.value)}
            onFocus={() => handleFieldFocus('storeFeatures')}
            onBlur={(e) => handleFieldBlur(e, 'storeFeatures')}
            className={getInputClassName("storeFeatures", "input-focus hover-lift transition-all duration-200 min-h-[80px] resize-none")}
          />
          {hasFieldError("storeFeatures") && (
            <p className="text-red-500 text-xs mt-1 animate-slide-down">
              {getFieldError("storeFeatures")}
            </p>
          )}

          {focusedField === 'storeFeatures' && expandedKeywords?.expanded_store_features && (
            <KeywordExpansionPanel
              type="storeFeatures"
              keywords={expandedKeywords.expanded_store_features}
              currentValue={formData.storeFeatures}
              onKeywordClick={(keyword) => handleKeywordClick('storeFeatures', keyword)}
              onMouseLeave={handleDelayedHide}
              onMouseEnter={handleMouseEnter}
            />
          )}
        </div>
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ownerName" className="text-sm font-medium text-gray-700">
              老板贵姓 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ownerName"
              placeholder="如：张"
              value={formData.ownerName}
              onChange={(e) => handleInputChangeWithValidation("ownerName", e.target.value)}
              className={getInputClassName("ownerName", "input-focus hover-lift transition-all duration-200")}
            />
            {hasFieldError("ownerName") && (
              <p className="text-red-500 text-xs mt-1 animate-slide-down">
                {getFieldError("ownerName")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerFeatures" className="text-sm font-medium text-gray-700">
              老板的特色 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ownerFeatures"
              placeholder="如：东北口音亲和力强、厨艺出众"
              value={formData.ownerFeatures}
              onChange={(e) => handleInputChangeWithValidation("ownerFeatures", e.target.value)}
              onFocus={() => handleFieldFocus('ownerFeatures')}
              onBlur={(e) => handleFieldBlur(e, 'ownerFeatures')}
              className={getInputClassName("ownerFeatures", "input-focus hover-lift transition-all duration-200")}
            />
            {hasFieldError("ownerFeatures") && (
              <p className="text-red-500 text-xs mt-1 animate-slide-down">
                {getFieldError("ownerFeatures")}
              </p>
            )}

            {focusedField === 'ownerFeatures' && expandedKeywords?.expanded_boss_features && (
              <KeywordExpansionPanel
                type="ownerFeatures"
                keywords={expandedKeywords.expanded_boss_features}
                currentValue={formData.ownerFeatures}
                onKeywordClick={(keyword) => handleKeywordClick('ownerFeatures', keyword)}
                onMouseLeave={handleDelayedHide}
                onMouseEnter={handleMouseEnter}
              />
            )}
          </div>
        </div>
        {/* 批量输入功能 */}
        <BulkInputSection
          formData={formData}
          setFormData={setFormData}
        />
        {/* 关键词拓展加载指示器 */}
        {isExpandingKeywords && (
          <div className="text-center py-4 animate-fade-in">
            <div className="inline-flex items-center space-x-2 text-purple-600 bg-purple-50 px-4 py-2 rounded-full hover-lift">
              <div className="loading-spinner w-4 h-4 border-purple-600"></div>
              <span className="text-sm font-medium">正在加载关键词...</span>
            </div>
          </div>
        )}

        {/* 模型选择 */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200 hover-lift transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-orange-800 flex items-center">
                <span className="animate-bounce-subtle mr-2">🤖</span>
                模型选择
              </Label>
              <p className="text-xs text-orange-600">
                选择不同的模型来生成专业方案，默认使用DeepSeek-V3
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onToggleModelSettings}
                className="border-orange-300 text-orange-700 hover:bg-orange-50 hover-lift transition-all duration-200 touch-manipulation"
              >
                <Settings className={`h-4 w-4 mr-1 transition-transform duration-200 ${showModelSettings ? 'rotate-90' : ''}`} />
                {showModelSettings ? "收起" : "设置"}
              </Button>
            </div>
          </div>

          {showModelSettings && (
            <div className="mt-3 pt-3 border-t border-orange-200 animate-slide-down">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-orange-700">选择模型</Label>
                  <Select value={selectedModelId} onValueChange={onModelChange}>
                    <SelectTrigger className="border-orange-200 focus:border-orange-500 focus:ring-orange-500 hover-lift transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="animate-slide-down">
                      {getAvailableChatModels().map((model) => (
                        <SelectItem key={model.id} value={model.id} className="hover:bg-orange-50 transition-colors duration-150">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {model.name}
                            </span>
                            <span className="text-xs text-gray-500">{model.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-slide-down hover-lift">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* 生成按钮 */}
        <div className="flex justify-center pt-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button
            onClick={onSubmit}
            disabled={isLoading}
            size="lg"
            className="btn-gradient hover-lift shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none px-8 py-3 text-base font-medium touch-manipulation transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="loading-spinner w-4 h-4"></div>
                <span>正在生成方案...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 group">
                <span>生成专业方案</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}