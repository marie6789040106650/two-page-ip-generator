import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFormPersistence, useSimpleFormPersistence, useFormRecovery } from '../use-form-persistence'
import { FormDataManager } from '../../lib/form-data-manager'

// Mock FormDataManager
vi.mock('../../lib/form-data-manager', () => ({
  FormDataManager: {
    saveToStorage: vi.fn(),
    loadFromStorage: vi.fn(),
    clearStorage: vi.fn(),
    getDefaultFormData: vi.fn(() => ({
      storeName: '',
      storeCategory: '',
      storeLocation: '',
      businessDuration: '',
      storeFeatures: '',
      ownerName: '',
      ownerFeatures: '',
      storeType: '',
      targetAudience: '',
      businessGoals: ''
    })),
    isEmptyFormData: vi.fn(),
    getFormDataSummary: vi.fn(),
    validateAndNormalizeFormData: vi.fn()
  }
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

describe('useFormPersistence', () => {
  const mockFormData = {
    storeName: '测试店铺',
    storeCategory: '餐饮',
    storeLocation: '北京市朝阳区',
    businessDuration: '3年',
    storeFeatures: '特色菜品丰富',
    ownerName: '张三',
    ownerFeatures: '热情好客',
    storeType: '快餐',
    targetAudience: '年轻人',
    businessGoals: '扩大规模'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('basic functionality', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useFormPersistence(mockFormData))

      expect(result.current.isSaving).toBe(false)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.lastSaved).toBeNull()
      expect(result.current.lastLoaded).toBeNull()
      expect(result.current.hasUnsavedChanges).toBe(false)
    })

    it('should save form data manually', async () => {
      const { result } = renderHook(() => useFormPersistence(mockFormData))

      await act(async () => {
        const success = await result.current.save(mockFormData)
        expect(success).toBe(true)
      })

      expect(FormDataManager.saveToStorage).toHaveBeenCalledWith(mockFormData)
    })

    it('should load form data manually', async () => {
      ;(FormDataManager.loadFromStorage as any).mockReturnValue(mockFormData)

      const { result } = renderHook(() => useFormPersistence(mockFormData))

      await act(async () => {
        const loaded = await result.current.load()
        expect(loaded).toEqual(mockFormData)
      })

      expect(FormDataManager.loadFromStorage).toHaveBeenCalled()
    })

    it('should clear stored data', async () => {
      const { result } = renderHook(() => useFormPersistence(mockFormData))

      await act(async () => {
        const success = await result.current.clear()
        expect(success).toBe(true)
      })

      expect(FormDataManager.clearStorage).toHaveBeenCalled()
    })
  })

  describe('auto-save functionality', () => {
    it('should auto-save when form data changes', async () => {
      ;(FormDataManager.isEmptyFormData as any).mockReturnValue(false)

      const { result, rerender } = renderHook(
        ({ formData }) => useFormPersistence(formData, undefined, { autoSaveInterval: 100 }),
        { initialProps: { formData: mockFormData } }
      )

      const updatedFormData = { ...mockFormData, storeName: '更新的店铺' }

      rerender({ formData: updatedFormData })

      await act(async () => {
        vi.advanceTimersByTime(150)
      })

      expect(FormDataManager.saveToStorage).toHaveBeenCalledWith(updatedFormData)
    })

    it('should not auto-save empty form data', async () => {
      ;(FormDataManager.isEmptyFormData as any).mockReturnValue(true)

      const emptyFormData = FormDataManager.getDefaultFormData()
      const { result, rerender } = renderHook(
        ({ formData }) => useFormPersistence(formData),
        { initialProps: { formData: emptyFormData } }
      )

      const updatedEmptyData = { ...emptyFormData, storeName: '' }
      rerender({ formData: updatedEmptyData })

      await act(async () => {
        vi.advanceTimersByTime(2000)
      })

      expect(FormDataManager.saveToStorage).not.toHaveBeenCalled()
    })

    it('should disable auto-save when option is false', async () => {
      const { result, rerender } = renderHook(
        ({ formData }) => useFormPersistence(formData, undefined, { enableAutoSave: false }),
        { initialProps: { formData: mockFormData } }
      )

      const updatedFormData = { ...mockFormData, storeName: '更新的店铺' }
      rerender({ formData: updatedFormData })

      await act(async () => {
        vi.advanceTimersByTime(2000)
      })

      expect(FormDataManager.saveToStorage).not.toHaveBeenCalled()
    })
  })

  describe('custom storage key', () => {
    it('should use custom storage key', async () => {
      const customKey = 'custom-form-key'
      const { result } = renderHook(() => 
        useFormPersistence(mockFormData, undefined, { storageKey: customKey })
      )

      await act(async () => {
        await result.current.save(mockFormData)
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        customKey,
        JSON.stringify(mockFormData)
      )
    })

    it('should load from custom storage key', async () => {
      const customKey = 'custom-form-key'
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockFormData))

      const { result } = renderHook(() => 
        useFormPersistence(mockFormData, undefined, { storageKey: customKey })
      )

      await act(async () => {
        await result.current.load()
      })

      expect(localStorageMock.getItem).toHaveBeenCalledWith(customKey)
    })
  })

  describe('error handling', () => {
    it('should handle save errors gracefully', async () => {
      ;(FormDataManager.saveToStorage as any).mockImplementation(() => {
        throw new Error('Storage error')
      })

      const { result } = renderHook(() => useFormPersistence(mockFormData))

      await act(async () => {
        const success = await result.current.save(mockFormData)
        expect(success).toBe(false)
      })

      expect(console.error).toHaveBeenCalled()
    })

    it('should handle load errors gracefully', async () => {
      ;(FormDataManager.loadFromStorage as any).mockImplementation(() => {
        throw new Error('Load error')
      })

      const { result } = renderHook(() => useFormPersistence(mockFormData))

      await act(async () => {
        const loaded = await result.current.load()
        expect(loaded).toBeNull()
      })

      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('utility methods', () => {
    it('should check if stored data exists', () => {
      ;(FormDataManager.loadFromStorage as any).mockReturnValue(mockFormData)

      const { result } = renderHook(() => useFormPersistence(mockFormData))

      const hasData = result.current.hasStoredData()
      expect(hasData).toBe(true)
    })

    it('should get stored data summary', () => {
      const summary = '测试店铺 - 餐饮 - 北京市朝阳区'
      ;(FormDataManager.loadFromStorage as any).mockReturnValue(mockFormData)
      ;(FormDataManager.getFormDataSummary as any).mockReturnValue(summary)

      const { result } = renderHook(() => useFormPersistence(mockFormData))

      const dataSummary = result.current.getStoredDataSummary()
      expect(dataSummary).toBe(summary)
    })

    it('should force save without debounce', async () => {
      // Make sure saveToStorage doesn't throw
      ;(FormDataManager.saveToStorage as any).mockImplementation(() => {})
      
      const { result } = renderHook(() => useFormPersistence(mockFormData))

      let success: boolean = false
      await act(async () => {
        success = await result.current.forceSave(mockFormData)
      })

      expect(success).toBe(true)
      expect(FormDataManager.saveToStorage).toHaveBeenCalledWith(mockFormData)
    })

    it('should reset state', () => {
      const { result } = renderHook(() => useFormPersistence(mockFormData))

      act(() => {
        result.current.resetState()
      })

      expect(result.current.isSaving).toBe(false)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.lastSaved).toBeNull()
      expect(result.current.lastLoaded).toBeNull()
      expect(result.current.hasUnsavedChanges).toBe(false)
    })
  })
})

describe('useSimpleFormPersistence', () => {
  const mockFormData = FormDataManager.getDefaultFormData()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide simplified interface', () => {
    const { result } = renderHook(() => useSimpleFormPersistence(mockFormData))

    expect(typeof result.current.save).toBe('function')
    expect(typeof result.current.load).toBe('function')
    expect(typeof result.current.clear).toBe('function')
    expect(typeof result.current.hasStoredData).toBe('function')
  })
})

describe('useFormRecovery', () => {
  const mockOnRecover = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should attempt recovery on mount when data exists', () => {
    const testFormData = FormDataManager.getDefaultFormData()
    ;(FormDataManager.loadFromStorage as any).mockReturnValue(testFormData)

    renderHook(() => useFormRecovery(mockOnRecover))

    expect(FormDataManager.loadFromStorage).toHaveBeenCalled()
  })

  it('should not attempt recovery when no data exists', () => {
    ;(FormDataManager.loadFromStorage as any).mockReturnValue(null)

    renderHook(() => useFormRecovery(mockOnRecover))

    expect(mockOnRecover).not.toHaveBeenCalled()
  })
})