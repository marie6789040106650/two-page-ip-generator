import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFormData } from '../use-form-data'

// Mock fetch
global.fetch = vi.fn()

describe('useFormData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFormData())

    expect(result.current.formData).toBeDefined()
    expect(result.current.expandedKeywords).toBeNull()
    expect(result.current.isExpandingKeywords).toBe(false)
    expect(result.current.enableKeywordExpansion).toBe(false)
    expect(result.current.currentPage).toBe('form')
    expect(result.current.generatedContent).toBe('')
    expect(result.current.isGenerating).toBe(false)
  })

  it('should handle input changes', () => {
    const { result } = renderHook(() => useFormData())

    act(() => {
      result.current.handleInputChange('storeName', '测试店铺')
    })

    expect(result.current.formData.storeName).toBe('测试店铺')
  })

  it('should handle multiple input changes', () => {
    const { result } = renderHook(() => useFormData())

    act(() => {
      result.current.handleInputChange('storeName', '测试店铺')
    })
    act(() => {
      result.current.handleInputChange('storeCategory', '餐饮')
    })
    act(() => {
      result.current.handleInputChange('storeLocation', '北京')
    })

    expect(result.current.formData.storeName).toBe('测试店铺')
    expect(result.current.formData.storeCategory).toBe('餐饮')
    expect(result.current.formData.storeLocation).toBe('北京')
  })

  it('should navigate between pages', () => {
    const { result } = renderHook(() => useFormData())

    expect(result.current.currentPage).toBe('form')

    act(() => {
      result.current.navigateToResult()
    })

    expect(result.current.currentPage).toBe('result')

    act(() => {
      result.current.navigateToForm()
    })

    expect(result.current.currentPage).toBe('form')
  })

  it('should reset form state', () => {
    const { result } = renderHook(() => useFormData())

    // Set some data first
    act(() => {
      result.current.handleInputChange('storeName', '测试店铺')
      result.current.setGeneratedContent('测试内容')
      result.current.navigateToResult()
    })

    expect(result.current.formData.storeName).toBe('测试店铺')
    expect(result.current.generatedContent).toBe('测试内容')
    expect(result.current.currentPage).toBe('result')

    // Reset
    act(() => {
      result.current.resetForm()
    })

    expect(result.current.formData.storeName).toBe('')
    expect(result.current.generatedContent).toBe('')
    expect(result.current.currentPage).toBe('form')
  })

  it('should handle keyword expansion success', async () => {
    const mockResponse = {
      storeFeatures: ['特色1', '特色2'],
      ownerFeatures: ['老板特色1', '老板特色2']
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse)
    })

    const { result } = renderHook(() => useFormData())

    await act(async () => {
      await result.current.expandKeywords('店铺特色', '老板特色')
    })

    expect(result.current.expandedKeywords).toEqual(mockResponse)
    expect(result.current.isExpandingKeywords).toBe(false)
  })

  it('should handle keyword expansion error', async () => {
    ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useFormData())

    await act(async () => {
      await result.current.expandKeywords('店铺特色', '老板特色')
    })

    expect(result.current.expandedKeywords).toBeNull()
    expect(result.current.isExpandingKeywords).toBe(false)
    expect(console.error).toHaveBeenCalled()
  })

  it('should set form data directly', () => {
    const { result } = renderHook(() => useFormData())

    const newFormData = {
      storeName: '新店铺',
      storeCategory: '新品类',
      storeLocation: '新位置',
      businessDuration: '1年',
      storeFeatures: '新特色',
      ownerName: '新老板',
      ownerFeatures: '新老板特色',
      storeType: '新类型',
      targetAudience: '新目标',
      businessGoals: '新目标'
    }

    act(() => {
      result.current.setFormData(newFormData)
    })

    expect(result.current.formData).toEqual(newFormData)
  })

  it('should handle expanded keywords state changes', () => {
    const { result } = renderHook(() => useFormData())

    const mockKeywords = {
      storeFeatures: ['特色1', '特色2'],
      ownerFeatures: ['老板特色1', '老板特色2']
    }

    act(() => {
      result.current.setExpandedKeywords(mockKeywords)
    })

    expect(result.current.expandedKeywords).toEqual(mockKeywords)

    act(() => {
      result.current.setExpandedKeywords(null)
    })

    expect(result.current.expandedKeywords).toBeNull()
  })

  it('should handle keyword expansion loading state', () => {
    const { result } = renderHook(() => useFormData())

    act(() => {
      result.current.setIsExpandingKeywords(true)
    })

    expect(result.current.isExpandingKeywords).toBe(true)

    act(() => {
      result.current.setIsExpandingKeywords(false)
    })

    expect(result.current.isExpandingKeywords).toBe(false)
  })

  it('should handle keyword expansion toggle', () => {
    const { result } = renderHook(() => useFormData())

    expect(result.current.enableKeywordExpansion).toBe(false)

    act(() => {
      result.current.setEnableKeywordExpansion(true)
    })

    expect(result.current.enableKeywordExpansion).toBe(true)
  })

  it('should handle generation state', () => {
    const { result } = renderHook(() => useFormData())

    act(() => {
      result.current.setIsGenerating(true)
      result.current.setGeneratedContent('生成的内容')
    })

    expect(result.current.isGenerating).toBe(true)
    expect(result.current.generatedContent).toBe('生成的内容')
  })

  it('should handle page state changes', () => {
    const { result } = renderHook(() => useFormData())

    act(() => {
      result.current.setCurrentPage('result')
    })

    expect(result.current.currentPage).toBe('result')

    act(() => {
      result.current.setCurrentPage('form')
    })

    expect(result.current.currentPage).toBe('form')
  })
})