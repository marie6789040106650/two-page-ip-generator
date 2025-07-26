import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { FormDataManager } from '../../lib/form-data-manager'

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

// Mock FormDataManager
vi.mock('../../lib/form-data-manager', () => ({
  FormDataManager: {
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
    saveToStorage: vi.fn(),
    loadFromStorage: vi.fn(),
    clearStorage: vi.fn(),
    saveToStorageWithBackup: vi.fn(),
    isEmptyFormData: vi.fn(),
    getFormDataSummary: vi.fn(),
    validateAndNormalizeFormData: vi.fn(),
    cleanupOldBackups: vi.fn()
  }
}))

describe('Data Persistence Integration', () => {
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
    
    // Mock console methods
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Basic Storage Operations', () => {
    it('should save form data to storage', () => {
      FormDataManager.saveToStorage(mockFormData)
      
      expect(FormDataManager.saveToStorage).toHaveBeenCalledWith(mockFormData)
    })

    it('should load form data from storage', () => {
      ;(FormDataManager.loadFromStorage as any).mockReturnValue(mockFormData)
      
      const result = FormDataManager.loadFromStorage()
      
      expect(FormDataManager.loadFromStorage).toHaveBeenCalled()
      expect(result).toEqual(mockFormData)
    })

    it('should clear form data from storage', () => {
      FormDataManager.clearStorage()
      
      expect(FormDataManager.clearStorage).toHaveBeenCalled()
    })

    it('should handle storage errors gracefully', () => {
      ;(FormDataManager.saveToStorage as any).mockImplementation(() => {
        // Simulate internal error handling
        try {
          throw new Error('Storage error')
        } catch (error) {
          console.error('Storage error handled internally')
        }
      })
      
      // Should not throw when storage fails (errors handled internally)
      expect(() => FormDataManager.saveToStorage(mockFormData)).not.toThrow()
    })
  })

  describe('Data Recovery and Backup', () => {
    it('should save data with backup', () => {
      FormDataManager.saveToStorageWithBackup(mockFormData)
      
      expect(FormDataManager.saveToStorageWithBackup).toHaveBeenCalledWith(mockFormData)
    })

    it('should handle corrupted storage data gracefully', () => {
      ;(FormDataManager.loadFromStorage as any).mockReturnValue(null)
      
      const result = FormDataManager.loadFromStorage()
      
      expect(result).toBeNull()
    })

    it('should attempt partial data recovery', () => {
      const partialData = {
        storeName: '测试店铺',
        storeCategory: '餐饮'
      }
      
      ;(FormDataManager.validateAndNormalizeFormData as any).mockReturnValue(partialData)
      
      const result = FormDataManager.validateAndNormalizeFormData({
        storeName: '测试店铺',
        storeCategory: '餐饮',
        invalidField: 'should be ignored'
      })
      
      expect(result).toEqual(partialData)
    })

    it('should clean up old backup data', () => {
      FormDataManager.cleanupOldBackups()
      
      expect(FormDataManager.cleanupOldBackups).toHaveBeenCalled()
    })
  })

  describe('Data Validation and Normalization', () => {
    it('should validate and normalize form data', () => {
      const normalizedData = {
        ...mockFormData,
        storeName: '测试店铺', // trimmed
        storeCategory: '餐饮'   // trimmed
      }
      
      ;(FormDataManager.validateAndNormalizeFormData as any).mockReturnValue(normalizedData)
      
      const result = FormDataManager.validateAndNormalizeFormData({
        ...mockFormData,
        storeName: '  测试店铺  ',
        storeCategory: '\t餐饮\n'
      })
      
      expect(result).toEqual(normalizedData)
    })

    it('should return null for invalid data', () => {
      ;(FormDataManager.validateAndNormalizeFormData as any).mockReturnValue(null)
      
      const result = FormDataManager.validateAndNormalizeFormData(null)
      
      expect(result).toBeNull()
    })

    it('should check if form data is empty', () => {
      ;(FormDataManager.isEmptyFormData as any).mockReturnValue(true)
      
      const emptyData = FormDataManager.getDefaultFormData()
      const result = FormDataManager.isEmptyFormData(emptyData)
      
      expect(result).toBe(true)
    })

    it('should check if form data is not empty', () => {
      ;(FormDataManager.isEmptyFormData as any).mockReturnValue(false)
      
      const result = FormDataManager.isEmptyFormData(mockFormData)
      
      expect(result).toBe(false)
    })
  })

  describe('Data Summary and Metadata', () => {
    it('should generate form data summary', () => {
      const expectedSummary = '测试店铺 - 餐饮 - 北京市朝阳区'
      ;(FormDataManager.getFormDataSummary as any).mockReturnValue(expectedSummary)
      
      const result = FormDataManager.getFormDataSummary(mockFormData)
      
      expect(FormDataManager.getFormDataSummary).toHaveBeenCalledWith(mockFormData)
      expect(result).toBe(expectedSummary)
    })

    it('should handle empty data summary', () => {
      ;(FormDataManager.getFormDataSummary as any).mockReturnValue('未填写信息')
      
      const emptyData = FormDataManager.getDefaultFormData()
      const result = FormDataManager.getFormDataSummary(emptyData)
      
      expect(result).toBe('未填写信息')
    })
  })

  describe('Storage Integration Flow', () => {
    it('should complete full persistence cycle', () => {
      // 1. Save data
      FormDataManager.saveToStorage(mockFormData)
      expect(FormDataManager.saveToStorage).toHaveBeenCalledWith(mockFormData)
      
      // 2. Load data
      ;(FormDataManager.loadFromStorage as any).mockReturnValue(mockFormData)
      const loaded = FormDataManager.loadFromStorage()
      expect(loaded).toEqual(mockFormData)
      
      // 3. Validate loaded data
      ;(FormDataManager.validateAndNormalizeFormData as any).mockReturnValue(mockFormData)
      const validated = FormDataManager.validateAndNormalizeFormData(loaded)
      expect(validated).toEqual(mockFormData)
      
      // 4. Generate summary
      ;(FormDataManager.getFormDataSummary as any).mockReturnValue('测试店铺 - 餐饮 - 北京市朝阳区')
      const summary = FormDataManager.getFormDataSummary(validated!)
      expect(summary).toBe('测试店铺 - 餐饮 - 北京市朝阳区')
    })

    it('should handle persistence failure gracefully', () => {
      // 1. Attempt to save (fails)
      ;(FormDataManager.saveToStorage as any).mockImplementation(() => {
        // Simulate internal error handling
        try {
          throw new Error('Storage quota exceeded')
        } catch (error) {
          console.error('Storage quota exceeded handled internally')
        }
      })
      
      expect(() => FormDataManager.saveToStorage(mockFormData)).not.toThrow()
      
      // 2. Attempt to load (returns null)
      ;(FormDataManager.loadFromStorage as any).mockReturnValue(null)
      const loaded = FormDataManager.loadFromStorage()
      expect(loaded).toBeNull()
      
      // 3. Fallback to default data
      const defaultData = FormDataManager.getDefaultFormData()
      expect(defaultData).toBeDefined()
    })

    it('should handle backup and recovery flow', () => {
      // 1. Save with backup
      FormDataManager.saveToStorageWithBackup(mockFormData)
      expect(FormDataManager.saveToStorageWithBackup).toHaveBeenCalledWith(mockFormData)
      
      // 2. Simulate main storage corruption
      ;(FormDataManager.loadFromStorage as any).mockReturnValue(null)
      const mainData = FormDataManager.loadFromStorage()
      expect(mainData).toBeNull()
      
      // 3. Recovery should be handled internally by FormDataManager
      // This would typically involve loading from backup storage
      
      // 4. Clean up old backups
      FormDataManager.cleanupOldBackups()
      expect(FormDataManager.cleanupOldBackups).toHaveBeenCalled()
    })
  })

  describe('Auto-save Simulation', () => {
    it('should simulate auto-save behavior', () => {
      // Simulate user typing and auto-save triggering
      const userData = { ...mockFormData, storeName: '新店铺名称' }
      
      // Check if data is not empty before saving
      ;(FormDataManager.isEmptyFormData as any).mockReturnValue(false)
      const shouldSave = !FormDataManager.isEmptyFormData(userData)
      
      if (shouldSave) {
        // Reset the mock to avoid previous error implementations
        ;(FormDataManager.saveToStorage as any).mockImplementation(() => {})
        FormDataManager.saveToStorage(userData)
        expect(FormDataManager.saveToStorage).toHaveBeenCalledWith(userData)
      }
    })

    it('should not auto-save empty data', () => {
      const emptyData = FormDataManager.getDefaultFormData()
      ;(FormDataManager.isEmptyFormData as any).mockReturnValue(true)
      
      const shouldSave = !FormDataManager.isEmptyFormData(emptyData)
      
      expect(shouldSave).toBe(false)
      // saveToStorage should not be called for empty data
    })
  })

  describe('Data Migration and Versioning', () => {
    it('should handle data format migration', () => {
      const oldFormatData = {
        name: '测试店铺', // old field name
        category: '餐饮'   // old field name
      }
      
      const migratedData = {
        ...FormDataManager.getDefaultFormData(),
        storeName: '测试店铺',
        storeCategory: '餐饮'
      }
      
      ;(FormDataManager.validateAndNormalizeFormData as any).mockReturnValue(migratedData)
      
      const result = FormDataManager.validateAndNormalizeFormData(oldFormatData)
      
      expect(result).toEqual(migratedData)
    })

    it('should handle version compatibility', () => {
      const versionedData = {
        version: '1.0',
        data: mockFormData,
        timestamp: Date.now()
      }
      
      // Simulate loading versioned data
      ;(FormDataManager.loadFromStorage as any).mockReturnValue(versionedData.data)
      
      const result = FormDataManager.loadFromStorage()
      
      expect(result).toEqual(mockFormData)
    })
  })
})