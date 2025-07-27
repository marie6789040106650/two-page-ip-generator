'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { FormData } from '@/types/form-types'
import { BulkInputSection } from './bulk-input-section'
import { KeywordExpansion } from './keyword-expansion'
import { FormProgress } from './form-progress'
import { useAutoSave } from '@/hooks/use-auto-save'

// 表单验证模式
const formSchema = z.object({
  storeName: z.string().min(1, '店铺名称不能为空').max(50, '店铺名称不能超过50个字符'),
  storeCategory: z.string().min(1, '请选择店铺类别'),
  storeLocation: z.string().min(1, '店铺位置不能为空').max(100, '店铺位置不能超过100个字符'),
  businessDuration: z.string().min(1, '请选择经营时长'),
  storeFeatures: z.string().min(10, '店铺特色至少需要10个字符').max(500, '店铺特色不能超过500个字符'),
  ownerName: z.string().min(1, '店主姓名不能为空').max(20, '店主姓名不能超过20个字符'),
  ownerFeatures: z.string().min(10, '店主特色至少需要10个字符').max(500, '店主特色不能超过500个字符'),
})

interface EnhancedFormSectionProps {
  initialData?: Partial<FormData>
  onSubmit: (data: FormData) => void
  isLoading?: boolean
}

export function EnhancedFormSection({
  initialData,
  onSubmit,
  isLoading = false
}: EnhancedFormSectionProps) {
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty, isValid }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
    mode: 'onChange'
  })

  const watchedValues = watch()

  // 使用自动保存Hook
  const { clearSavedData } = useAutoSave({
    key: 'form-auto-save',
    data: watchedValues,
    enabled: autoSaveEnabled && isDirty,
    interval: 2000,
    onSave: () => setLastSaved(new Date()),
    onLoad: (savedData) => {
      if (!initialData) {
        Object.keys(savedData).forEach(key => {
          if (savedData[key]) {
            setValue(key as keyof FormData, savedData[key], { shouldValidate: false })
          }
        })
      }
    }
  })

  // 初始化时加载保存的数据
  useEffect(() => {
    if (!initialData) {
      try {
        const saved = localStorage.getItem('form-auto-save')
        if (saved) {
          const parsedData = JSON.parse(saved)
          Object.keys(parsedData).forEach(key => {
            if (parsedData[key]) {
              setValue(key as keyof FormData, parsedData[key], { shouldValidate: false })
            }
          })
        }
      } catch (error) {
        console.error('Failed to load auto-saved data:', error)
      }
    }
  }, [setValue, initialData])

  const handleFormSubmit = (data: FormData) => {
    // 清除自动保存的数据
    clearSavedData()
    onSubmit(data)
  }

  const storeCategories = [
    { value: '餐饮', label: '餐饮美食' },
    { value: '零售', label: '零售商店' },
    { value: '服务', label: '生活服务' },
    { value: '娱乐', label: '休闲娱乐' },
    { value: '教育', label: '教育培训' },
    { value: '医疗', label: '医疗健康' },
    { value: '其他', label: '其他行业' },
  ]

  const businessDurations = [
    { value: '1年以下', label: '1年以下' },
    { value: '1-3年', label: '1-3年' },
    { value: '3-5年', label: '3-5年' },
    { value: '5-10年', label: '5-10年' },
    { value: '10年以上', label: '10年以上' },
  ]

  const handleBulkInputData = (parsedData: Partial<FormData>) => {
    Object.keys(parsedData).forEach(key => {
      const value = parsedData[key as keyof FormData]
      if (value) {
        setValue(key as keyof FormData, value, { shouldValidate: true, shouldDirty: true })
      }
    })
  }

  const handleKeywordSelect = (field: keyof FormData, keywords: string[]) => {
    const currentValue = watchedValues[field] as string || ''
    const newKeywords = keywords.filter(keyword => !currentValue.includes(keyword))
    
    if (newKeywords.length > 0) {
      const updatedValue = currentValue 
        ? `${currentValue}、${newKeywords.join('、')}`
        : newKeywords.join('、')
      
      setValue(field, updatedValue, { shouldValidate: true, shouldDirty: true })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 批量输入区域 */}
      <BulkInputSection onDataParsed={handleBulkInputData} />
      
      {/* 关键词扩展区域 */}
      <KeywordExpansion 
        formData={watchedValues} 
        onKeywordSelect={handleKeywordSelect}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 表单区域 */}
        <div className="lg:col-span-2">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">店铺信息填写</h2>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600">自动保存</span>
            </label>
            {lastSaved && (
              <span className="text-xs text-gray-500">
                上次保存: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            {...register('storeName')}
            label="店铺名称"
            placeholder="请输入店铺名称"
            error={errors.storeName?.message}
            required
          />

          <Select
            {...register('storeCategory')}
            label="店铺类别"
            options={storeCategories}
            placeholder="请选择店铺类别"
            error={errors.storeCategory?.message}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            {...register('storeLocation')}
            label="店铺位置"
            placeholder="请输入店铺位置"
            error={errors.storeLocation?.message}
            helpText="例如: 北京市朝阳区三里屯"
            required
          />

          <Select
            {...register('businessDuration')}
            label="经营时长"
            options={businessDurations}
            placeholder="请选择经营时长"
            error={errors.businessDuration?.message}
            required
          />
        </div>

        <Textarea
          {...register('storeFeatures')}
          label="店铺特色"
          placeholder="请详细描述店铺的特色、优势、主营产品等..."
          error={errors.storeFeatures?.message}
          helpText="至少10个字符，最多500个字符"
          rows={4}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            {...register('ownerName')}
            label="店主姓名"
            placeholder="请输入店主姓名"
            error={errors.ownerName?.message}
            required
          />
        </div>

        <Textarea
          {...register('ownerFeatures')}
          label="店主特色"
          placeholder="请描述店主的经验、特长、经营理念等..."
          error={errors.ownerFeatures?.message}
          helpText="至少10个字符，最多500个字符"
          rows={4}
          required
        />

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              clearSavedData()
              window.location.reload()
            }}
          >
            重置表单
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={!isValid}
          >
            {isLoading ? '生成中...' : '生成方案'}
          </Button>
        </div>
      </form>

      {/* 表单进度指示 */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>表单完成度</span>
          <span>{Math.round((Object.keys(watchedValues).filter(key => watchedValues[key as keyof FormData]).length / 7) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-primary-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${(Object.keys(watchedValues).filter(key => watchedValues[key as keyof FormData]).length / 7) * 100}%` 
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      </motion.div>
        </div>

        {/* 进度指示器 */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <FormProgress formData={watchedValues} />
          </div>
        </div>
      </div>
    </div>
  )
}