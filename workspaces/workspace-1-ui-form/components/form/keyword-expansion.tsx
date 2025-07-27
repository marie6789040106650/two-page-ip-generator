'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { FormData, KeywordSuggestion } from '@/types/form-types'

interface KeywordExpansionProps {
  formData: Partial<FormData>
  onKeywordSelect: (field: keyof FormData, keywords: string[]) => void
  className?: string
}

// 模拟关键词扩展API
const generateKeywordSuggestions = async (
  category: string,
  currentText: string
): Promise<KeywordSuggestion[]> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const suggestions: Record<string, KeywordSuggestion[]> = {
    storeFeatures: [
      { keyword: '手工制作', relevance: 0.9, category: '工艺特色' },
      { keyword: '新鲜食材', relevance: 0.85, category: '品质保证' },
      { keyword: '传统工艺', relevance: 0.8, category: '工艺特色' },
      { keyword: '现场制作', relevance: 0.75, category: '服务特色' },
      { keyword: '个性定制', relevance: 0.7, category: '服务特色' },
      { keyword: '环保理念', relevance: 0.65, category: '品牌理念' },
    ],
    ownerFeatures: [
      { keyword: '行业专家', relevance: 0.9, category: '专业能力' },
      { keyword: '创新思维', relevance: 0.85, category: '个人特质' },
      { keyword: '客户至上', relevance: 0.8, category: '服务理念' },
      { keyword: '匠心精神', relevance: 0.75, category: '个人特质' },
      { keyword: '持续学习', relevance: 0.7, category: '成长态度' },
      { keyword: '团队领导', relevance: 0.65, category: '管理能力' },
    ]
  }
  
  return suggestions[category] || []
}

export function KeywordExpansion({ 
  formData, 
  onKeywordSelect, 
  className = '' 
}: KeywordExpansionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeField, setActiveField] = useState<keyof FormData | null>(null)
  const [suggestions, setSuggestions] = useState<KeywordSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])

  const expandableFields = [
    { key: 'storeFeatures' as keyof FormData, label: '店铺特色', icon: '🏪' },
    { key: 'ownerFeatures' as keyof FormData, label: '老板特色', icon: '👨‍💼' }
  ]

  const handleFieldExpand = async (field: keyof FormData) => {
    setActiveField(field)
    setIsLoading(true)
    setSuggestions([])
    setSelectedKeywords([])
    
    try {
      const currentText = formData[field] as string || ''
      const newSuggestions = await generateKeywordSuggestions(field, currentText)
      setSuggestions(newSuggestions)
    } catch (error) {
      console.error('关键词扩展失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    )
  }

  const handleApplyKeywords = () => {
    if (activeField && selectedKeywords.length > 0) {
      onKeywordSelect(activeField, selectedKeywords)
      setIsExpanded(false)
      setActiveField(null)
      setSelectedKeywords([])
    }
  }

  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.category]) {
      acc[suggestion.category] = []
    }
    acc[suggestion.category].push(suggestion)
    return acc
  }, {} as Record<string, KeywordSuggestion[]>)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <motion.div 
            className="bg-purple-500 p-2 rounded-full"
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
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-purple-800">智能关键词扩展</h3>
            <p className="text-sm text-purple-600">
              AI智能分析，为您推荐相关关键词，丰富内容表达
            </p>
          </div>
        </div>
        <Button
          variant={isExpanded ? "primary" : "outline"}
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className={isExpanded ? "bg-purple-600 hover:bg-purple-700" : "border-purple-300 text-purple-700 hover:bg-purple-50"}
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
            <div className="border-t border-purple-200 pt-4 space-y-4">
              {/* 字段选择 */}
              <div>
                <h4 className="text-sm font-medium text-purple-800 mb-2">选择要扩展的字段：</h4>
                <div className="grid grid-cols-2 gap-3">
                  {expandableFields.map(field => (
                    <Button
                      key={field.key}
                      variant={activeField === field.key ? "primary" : "outline"}
                      onClick={() => handleFieldExpand(field.key)}
                      disabled={!formData[field.key] || isLoading}
                      className={`justify-start ${
                        activeField === field.key 
                          ? "bg-purple-600 hover:bg-purple-700" 
                          : "border-purple-300 text-purple-700 hover:bg-purple-50"
                      }`}
                    >
                      <span className="mr-2">{field.icon}</span>
                      {field.label}
                      {!formData[field.key] && (
                        <span className="ml-auto text-xs opacity-60">(需先填写)</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 关键词建议 */}
              {activeField && (
                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-purple-800">
                      {expandableFields.find(f => f.key === activeField)?.label} - 关键词建议
                    </h4>
                    {selectedKeywords.length > 0 && (
                      <span className="text-xs text-purple-600">
                        已选择 {selectedKeywords.length} 个关键词
                      </span>
                    )}
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <svg className="animate-spin h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="ml-2 text-purple-600">AI分析中...</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(groupedSuggestions).map(([category, keywords]) => (
                        <div key={category}>
                          <h5 className="text-xs font-medium text-purple-700 mb-2">{category}</h5>
                          <div className="flex flex-wrap gap-2">
                            {keywords.map(suggestion => (
                              <button
                                key={suggestion.keyword}
                                onClick={() => handleKeywordToggle(suggestion.keyword)}
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                  selectedKeywords.includes(suggestion.keyword)
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                }`}
                              >
                                {suggestion.keyword}
                                <span className="ml-1 text-xs opacity-75">
                                  {Math.round(suggestion.relevance * 100)}%
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedKeywords.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-purple-200">
                      <Button
                        onClick={handleApplyKeywords}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        应用选中的关键词 ({selectedKeywords.length})
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-purple-100 rounded-md p-3">
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-purple-700">
                    <p className="font-medium mb-1">使用提示：</p>
                    <ul className="space-y-1 text-xs">
                      <li>• 先填写基础内容，再使用关键词扩展功能</li>
                      <li>• 选择的关键词会自动添加到对应字段中</li>
                      <li>• 相关度越高的关键词越适合您的业务</li>
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