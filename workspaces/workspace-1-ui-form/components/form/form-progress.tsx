'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FormData } from '@/types/form-types'

interface FormProgressProps {
  formData: Partial<FormData>
  className?: string
}

export function FormProgress({ formData, className = '' }: FormProgressProps) {
  const requiredFields: (keyof FormData)[] = [
    'storeName',
    'storeCategory', 
    'storeLocation',
    'businessDuration',
    'storeFeatures',
    'ownerName',
    'ownerFeatures'
  ]

  const fieldLabels: Record<keyof FormData, string> = {
    storeName: '店铺名称',
    storeCategory: '店铺类别',
    storeLocation: '店铺位置', 
    businessDuration: '经营时长',
    storeFeatures: '店铺特色',
    ownerName: '店主姓名',
    ownerFeatures: '店主特色'
  }

  const completedFields = requiredFields.filter(field => {
    const value = formData[field]
    return value && String(value).trim().length > 0
  })

  const completionRate = (completedFields.length / requiredFields.length) * 100
  const isComplete = completionRate === 100

  const getFieldStatus = (field: keyof FormData) => {
    const value = formData[field]
    const hasValue = value && String(value).trim().length > 0
    
    if (hasValue) {
      const length = String(value).length
      if (field === 'storeFeatures' || field === 'ownerFeatures') {
        return length >= 10 ? 'complete' : 'partial'
      }
      return 'complete'
    }
    return 'empty'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return (
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )
      case 'partial':
        return (
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">表单完成度</h3>
        <div className="flex items-center space-x-2">
          <span className={`text-2xl font-bold ${isComplete ? 'text-green-600' : 'text-blue-600'}`}>
            {Math.round(completionRate)}%
          </span>
          {isComplete && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className={`h-3 rounded-full transition-colors duration-300 ${
              isComplete 
                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>开始</span>
          <span>{completedFields.length}/{requiredFields.length} 字段已完成</span>
          <span>完成</span>
        </div>
      </div>

      {/* 字段状态列表 */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 mb-3">字段完成状态</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {requiredFields.map(field => {
            const status = getFieldStatus(field)
            return (
              <motion.div
                key={field}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                  status === 'complete' 
                    ? 'bg-green-50 border border-green-200' 
                    : status === 'partial'
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                {getStatusIcon(status)}
                <span className={`text-sm ${
                  status === 'complete' 
                    ? 'text-green-700' 
                    : status === 'partial'
                    ? 'text-yellow-700'
                    : 'text-gray-600'
                }`}>
                  {fieldLabels[field]}
                </span>
                {status === 'partial' && (
                  <span className="text-xs text-yellow-600 ml-auto">需要更多内容</span>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 完成提示 */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-green-800">
              太棒了！所有必填字段都已完成，可以提交表单了！
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}