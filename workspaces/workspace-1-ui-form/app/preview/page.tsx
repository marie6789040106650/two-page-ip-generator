'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { FormData } from '@/types/form-types'

export default function PreviewPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [previewData, setPreviewData] = useState<Partial<FormData>[]>([])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [editedData, setEditedData] = useState<Partial<FormData>>({})
    const [isLoading, setIsLoading] = useState(false)

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

    useEffect(() => {
        // 从URL参数或localStorage获取预览数据
        const dataParam = searchParams.get('data')
        if (dataParam) {
            try {
                const parsedData = JSON.parse(decodeURIComponent(dataParam))
                setPreviewData(Array.isArray(parsedData) ? parsedData : [parsedData])
                setEditedData(Array.isArray(parsedData) ? parsedData[0] : parsedData)
            } catch (error) {
                console.error('Failed to parse preview data:', error)
                router.push('/')
            }
        } else {
            // 尝试从localStorage获取
            const savedData = localStorage.getItem('bulk-input-preview')
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData)
                    setPreviewData(Array.isArray(parsedData) ? parsedData : [parsedData])
                    setEditedData(Array.isArray(parsedData) ? parsedData[0] : parsedData)
                } catch (error) {
                    console.error('Failed to load preview data:', error)
                    router.push('/')
                }
            } else {
                router.push('/')
            }
        }
    }, [searchParams, router])

    const handleFieldChange = (field: keyof FormData, value: string) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleRecordChange = (index: number) => {
        setSelectedIndex(index)
        setEditedData(previewData[index] || {})
    }

    const handleConfirm = async () => {
        setIsLoading(true)

        try {
            // 将编辑后的数据保存到localStorage，供主页面使用
            localStorage.setItem('confirmed-form-data', JSON.stringify(editedData))

            // 清除预览数据
            localStorage.removeItem('bulk-input-preview')

            // 返回主页面
            router.push('/?from=preview')

        } catch (error) {
            console.error('Failed to confirm data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        localStorage.removeItem('bulk-input-preview')
        router.push('/')
    }

    if (previewData.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">加载预览数据中...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <div className="container mx-auto px-4 py-8">
                {/* 页面头部 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        批量输入预览确认
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        数据预览与确认
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        请检查并确认批量解析的数据，您可以在此页面进行编辑和修改
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* 记录选择器 */}
                    {previewData.length > 1 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    选择要编辑的记录
                                </h3>
                                <span className="text-sm text-gray-500">
                                    共 {previewData.length} 条记录
                                </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {previewData.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleRecordChange(index)}
                                        className={`p-3 rounded-md text-sm font-medium transition-colors ${selectedIndex === index
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        记录 {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 表单预览和编辑 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {previewData.length > 1 ? `记录 ${selectedIndex + 1}` : '数据预览'}
                            </h2>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                                可编辑
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="店铺名称"
                                    value={editedData.storeName || ''}
                                    onChange={(e) => handleFieldChange('storeName', e.target.value)}
                                    placeholder="请输入店铺名称"
                                    required
                                />

                                <Select
                                    label="店铺类别"
                                    value={editedData.storeCategory || ''}
                                    onChange={(e) => handleFieldChange('storeCategory', e.target.value)}
                                    options={storeCategories}
                                    placeholder="请选择店铺类别"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="店铺位置"
                                    value={editedData.storeLocation || ''}
                                    onChange={(e) => handleFieldChange('storeLocation', e.target.value)}
                                    placeholder="请输入店铺位置"
                                    required
                                />

                                <Select
                                    label="经营时长"
                                    value={editedData.businessDuration || ''}
                                    onChange={(e) => handleFieldChange('businessDuration', e.target.value)}
                                    options={businessDurations}
                                    placeholder="请选择经营时长"
                                    required
                                />
                            </div>

                            <Textarea
                                label="店铺特色"
                                value={editedData.storeFeatures || ''}
                                onChange={(e) => handleFieldChange('storeFeatures', e.target.value)}
                                placeholder="请详细描述店铺的特色、优势、主营产品等..."
                                rows={4}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="店主姓名"
                                    value={editedData.ownerName || ''}
                                    onChange={(e) => handleFieldChange('ownerName', e.target.value)}
                                    placeholder="请输入店主姓名"
                                    required
                                />
                            </div>

                            <Textarea
                                label="店主特色"
                                value={editedData.ownerFeatures || ''}
                                onChange={(e) => handleFieldChange('ownerFeatures', e.target.value)}
                                placeholder="请描述店主的经验、特长、经营理念等..."
                                rows={4}
                                required
                            />
                        </div>
                    </motion.div>

                    {/* 操作按钮 */}
                    <div className="flex justify-between items-center mt-8">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            取消
                        </Button>

                        <div className="flex space-x-4">
                            {previewData.length > 1 && selectedIndex > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={() => handleRecordChange(selectedIndex - 1)}
                                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    上一条
                                </Button>
                            )}

                            {previewData.length > 1 && selectedIndex < previewData.length - 1 && (
                                <Button
                                    variant="outline"
                                    onClick={() => handleRecordChange(selectedIndex + 1)}
                                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                >
                                    下一条
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Button>
                            )}

                            <Button
                                onClick={handleConfirm}
                                loading={isLoading}
                                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        确认中...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        确认并使用此数据
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* 提示信息 */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                        <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="text-sm text-blue-700">
                                <p className="font-medium mb-1">使用说明：</p>
                                <ul className="space-y-1 text-xs">
                                    <li>• 您可以直接在此页面编辑任何字段的内容</li>
                                    <li>• 如果有多条记录，可以使用上方的按钮切换查看</li>
                                    <li>• 点击"确认并使用此数据"将返回主页面并自动填充表单</li>
                                    <li>• 点击"取消"将放弃所有更改并返回主页面</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}