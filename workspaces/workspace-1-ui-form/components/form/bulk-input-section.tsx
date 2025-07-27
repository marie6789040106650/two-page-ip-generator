'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FormData } from '@/types/form-types'

interface BulkInputSectionProps {
  onDataParsed: (data: Partial<FormData>) => void
  className?: string
}

// CSV解析函数
const parseCSV = (csvText: string): Partial<FormData>[] => {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return []
  
  const headers = lines[0].split(',').map(h => h.trim())
  const results: Partial<FormData>[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const rowData: Partial<FormData> = {}
    
    headers.forEach((header, index) => {
      const value = values[index]
      if (!value) return
      
      // 映射CSV列名到表单字段
      if (header.includes('店名') || header.includes('店铺名称') || header === 'storeName') {
        rowData.storeName = value
      } else if (header.includes('品类') || header.includes('类别') || header === 'storeCategory') {
        rowData.storeCategory = value
      } else if (header.includes('位置') || header.includes('地址') || header === 'storeLocation') {
        rowData.storeLocation = value
      } else if (header.includes('时长') || header.includes('经营') || header === 'businessDuration') {
        rowData.businessDuration = value
      } else if (header.includes('特色') || header.includes('店铺特色') || header === 'storeFeatures') {
        rowData.storeFeatures = value
      } else if (header.includes('老板') || header.includes('姓名') || header === 'ownerName') {
        rowData.ownerName = value
      } else if (header.includes('老板特色') || header === 'ownerFeatures') {
        rowData.ownerFeatures = value
      }
    })
    
    if (Object.keys(rowData).length > 0) {
      results.push(rowData)
    }
  }
  
  return results
}

// 解析批量输入文本的工具函数
const parseBulkInput = (text: string): Partial<FormData> => {
  const lines = text.split('\n').filter(line => line.trim())
  const newFormData: Partial<FormData> = {}
  
  lines.forEach(line => {
    const [key, value] = line.split(/[：:]/);
    if (!key || !value) return;
    
    const trimmedKey = key.trim()
    const trimmedValue = value.trim()

    if (trimmedKey.includes('店名') || trimmedKey.includes('店的名字') || trimmedKey.includes('店铺名称')) {
      newFormData.storeName = trimmedValue
    } else if (trimmedKey.includes('品类') || trimmedKey.includes('店的品类') || trimmedKey.includes('店铺类别')) {
      newFormData.storeCategory = trimmedValue
    } else if (trimmedKey.includes('位置') || trimmedKey.includes('地点') || trimmedKey.includes('店的位置') || trimmedKey.includes('店铺位置')) {
      newFormData.storeLocation = trimmedValue
    } else if (trimmedKey.includes('开店时长') || trimmedKey.includes('时长') || trimmedKey.includes('经营时长')) {
      newFormData.businessDuration = trimmedValue
    } else if (trimmedKey.includes('店铺特色') || trimmedKey.includes('店的特色') || trimmedKey.includes('特色')) {
      newFormData.storeFeatures = trimmedValue
    } else if (trimmedKey.includes('老板姓氏') || trimmedKey.includes('老板') || trimmedKey.includes('老板贵姓') || trimmedKey.includes('店主')) {
      newFormData.ownerName = trimmedValue
    } else if (trimmedKey.includes('老板特色') || trimmedKey.includes('老板的特色') || trimmedKey.includes('店主特色')) {
      newFormData.ownerFeatures = trimmedValue
    }
  })

  return newFormData
}

// 示例数据
const exampleData = `店的名字：馋嘴老张麻辣烫
店的品类：餐饮
店的位置：北京市朝阳区望京SOHO
开店时长：5年
店的特色：秘制汤底、地域食材、现制模式、健康定制、主题沉浸、网红装修
老板贵姓：张
老板的特色：匠人、传承、学霸、宠粉`

export function BulkInputSection({ onDataParsed, className = '' }: BulkInputSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputText, setInputText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [inputMode, setInputMode] = useState<'text' | 'csv'>('text')
  const [csvData, setCsvData] = useState<Partial<FormData>[]>([])
  const [selectedCsvIndex, setSelectedCsvIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      // 如果没有输入内容，使用示例数据
      const parsedData = parseBulkInput(exampleData)
      onDataParsed(parsedData)
      setIsExpanded(false)
      return
    }

    setIsProcessing(true)
    
    // 模拟处理时间
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const parsedData = parseBulkInput(inputText)
    onDataParsed(parsedData)
    setInputText('')
    setIsExpanded(false)
    setIsProcessing(false)
  }

  const handleUseExample = () => {
    setInputText(exampleData)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const csvText = e.target?.result as string
      const parsedData = parseCSV(csvText)
      
      if (parsedData.length > 0) {
        setCsvData(parsedData)
        setInputMode('csv')
        setSelectedCsvIndex(0)
      } else {
        alert('CSV文件格式不正确或没有有效数据')
      }
    }
    reader.readAsText(file)
  }

  const handleCsvSubmit = () => {
    if (csvData.length > 0 && csvData[selectedCsvIndex]) {
      onDataParsed(csvData[selectedCsvIndex])
      setIsExpanded(false)
      setCsvData([])
      setInputMode('text')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <motion.div 
            className="bg-green-500 p-2 rounded-full"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-green-800">智能批量输入</h3>
            <p className="text-sm text-green-600">
              粘贴商家信息，一键自动识别并填写到对应字段
            </p>
          </div>
        </div>
        <Button
          variant={isExpanded ? "primary" : "outline"}
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className={isExpanded ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-700 hover:bg-green-50"}
        >
          {isExpanded ? "收起 ↑" : "展开 ↓"}
        </Button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-green-200 pt-4 space-y-4">
              {/* 输入模式切换 */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setInputMode('text')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      inputMode === 'text'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    文本输入
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('csv')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      inputMode === 'csv'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    CSV文件
                  </button>
                </div>
                {inputMode === 'text' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleUseExample}
                    className="text-green-600 hover:text-green-700 hover:bg-green-100"
                  >
                    使用示例数据
                  </Button>
                )}
              </div>

              {inputMode === 'text' ? (
                <Textarea
                  placeholder="粘贴商家信息，格式如下：
店的名字：馋嘴老张麻辣烫
店的品类：餐饮
店的位置：北京市朝阳区望京SOHO
开店时长：5年
店的特色：秘制汤底、地域食材、现制模式、健康定制、主题沉浸、网红装修
老板贵姓：张
老板的特色：匠人、传承、学霸、宠粉"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500 min-h-[150px] resize-none"
                  rows={8}
                />
              ) : (
                <div className="space-y-4">
                  {/* CSV文件上传 */}
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <svg className="mx-auto h-12 w-12 text-green-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="mt-4">
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        选择CSV文件
                      </Button>
                      <p className="mt-2 text-sm text-green-600">
                        支持标准CSV格式，包含店铺信息列
                      </p>
                    </div>
                  </div>

                  {/* CSV数据预览 */}
                  {csvData.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-green-800">
                          CSV数据预览 ({csvData.length} 条记录)
                        </h4>
                        {csvData.length > 1 && (
                          <select
                            value={selectedCsvIndex}
                            onChange={(e) => setSelectedCsvIndex(Number(e.target.value))}
                            className="text-sm border border-green-300 rounded px-2 py-1"
                          >
                            {csvData.map((_, index) => (
                              <option key={index} value={index}>
                                记录 {index + 1}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(csvData[selectedCsvIndex] || {}).map(([key, value]) => (
                          <div key={key} className="flex">
                            <span className="font-medium text-green-700 w-20">{key}:</span>
                            <span className="text-green-600 truncate">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  onClick={inputMode === 'text' ? handleSubmit : handleCsvSubmit}
                  loading={isProcessing}
                  disabled={inputMode === 'csv' && csvData.length === 0}
                  className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      解析中...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      {inputMode === 'text' ? '智能识别并填写' : '使用选中数据填写'}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setInputText('')
                    setCsvData([])
                    setInputMode('text')
                    setIsExpanded(false)
                  }}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  取消
                </Button>
              </div>

              <div className="bg-green-100 rounded-md p-3">
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-green-700">
                    <p className="font-medium mb-1">使用提示：</p>
                    <ul className="space-y-1 text-xs">
                      {inputMode === 'text' ? (
                        <>
                          <li>• 支持中文冒号（：）和英文冒号（:）</li>
                          <li>• 系统会智能匹配字段名称，如"店名"、"店的名字"等</li>
                          <li>• 如果不输入内容直接点击按钮，将使用示例数据</li>
                        </>
                      ) : (
                        <>
                          <li>• CSV文件第一行应为列标题</li>
                          <li>• 支持中文列名，如"店名"、"品类"、"位置"等</li>
                          <li>• 多条记录时可以选择要使用的记录</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}