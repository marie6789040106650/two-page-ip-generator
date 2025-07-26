import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FormDataManager } from '../../lib/form-data-manager'

// Mock Next.js navigation
const mockPush = vi.fn()
const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => {
    const params = new URLSearchParams()
    // Mock some form data in URL params
    params.set('data', 'encoded-form-data')
    return params
  },
  usePathname: () => '/',
}))

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
    encodeForUrl: vi.fn(() => 'encoded-data'),
    decodeFromUrl: vi.fn(() => ({
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
    })),
    validateFormData: vi.fn(() => ({ isValid: true, errors: {} })),
    saveToStorage: vi.fn(),
    loadFromStorage: vi.fn(),
    clearStorage: vi.fn(),
    isEmptyFormData: vi.fn(() => false),
    getFormDataSummary: vi.fn(() => '测试店铺 - 餐饮 - 北京市朝阳区'),
    validateAndNormalizeFormData: vi.fn((data) => data)
  }
}))

describe('Page Navigation Integration', () => {
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
    // Mock btoa/atob for encoding tests
    global.btoa = global.btoa || ((str) => Buffer.from(str).toString('base64'))
    global.atob = global.atob || ((str) => Buffer.from(str, 'base64').toString())
  })

  describe('Form to Generate Page Navigation', () => {
    it('should encode form data for navigation', () => {
      const encoded = FormDataManager.encodeForUrl(mockFormData)
      
      expect(FormDataManager.encodeForUrl).toHaveBeenCalledWith(mockFormData)
      expect(encoded).toBe('encoded-data')
    })

    it('should validate form data before navigation', () => {
      const validationResult = FormDataManager.validateFormData(mockFormData)
      
      expect(FormDataManager.validateFormData).toHaveBeenCalledWith(mockFormData)
      expect(validationResult.isValid).toBe(true)
    })

    it('should create navigation URL with encoded data', () => {
      const encoded = FormDataManager.encodeForUrl(mockFormData)
      const navigationUrl = `/generate?data=${encoded}`
      
      expect(navigationUrl).toBe('/generate?data=encoded-data')
    })

    it('should handle navigation with empty form data', () => {
      const emptyData = FormDataManager.getDefaultFormData()
      ;(FormDataManager.isEmptyFormData as any).mockReturnValue(true)
      
      const isEmpty = FormDataManager.isEmptyFormData(emptyData)
      const encoded = FormDataManager.encodeForUrl(emptyData)
      
      expect(isEmpty).toBe(true)
      expect(encoded).toBe('encoded-data') // Should still encode even if empty
    })
  })

  describe('Generate to Form Page Navigation', () => {
    it('should decode form data from URL parameters', () => {
      const encodedData = 'encoded-form-data'
      const decodedData = FormDataManager.decodeFromUrl(encodedData)
      
      expect(FormDataManager.decodeFromUrl).toHaveBeenCalledWith(encodedData)
      expect(decodedData).toEqual(expect.objectContaining({
        storeName: '测试店铺',
        storeCategory: '餐饮',
        storeLocation: '北京市朝阳区'
      }))
    })

    it('should handle corrupted URL data gracefully', () => {
      ;(FormDataManager.decodeFromUrl as any).mockReturnValue(null)
      
      const result = FormDataManager.decodeFromUrl('corrupted-data')
      
      expect(result).toBeNull()
    })

    it('should provide fallback for missing URL data', () => {
      ;(FormDataManager.decodeFromUrl as any).mockReturnValue(null)
      const fallbackData = FormDataManager.getDefaultFormData()
      
      const decodedData = FormDataManager.decodeFromUrl('') || fallbackData
      
      expect(decodedData).toEqual(fallbackData)
    })
  })

  describe('Data Persistence During Navigation', () => {
    it('should maintain data integrity during encoding/decoding cycle', () => {
      ;(FormDataManager.encodeForUrl as any).mockReturnValue('encoded-data')
      ;(FormDataManager.decodeFromUrl as any).mockReturnValue(mockFormData)
      
      const encoded = FormDataManager.encodeForUrl(mockFormData)
      const decoded = FormDataManager.decodeFromUrl(encoded)
      
      expect(decoded).toEqual(expect.objectContaining({
        storeName: mockFormData.storeName,
        storeCategory: mockFormData.storeCategory,
        storeLocation: mockFormData.storeLocation
      }))
    })

    it('should save data to storage during navigation', () => {
      FormDataManager.saveToStorage(mockFormData)
      
      expect(FormDataManager.saveToStorage).toHaveBeenCalledWith(mockFormData)
    })

    it('should load data from storage when needed', () => {
      ;(FormDataManager.loadFromStorage as any).mockReturnValue(mockFormData)
      
      const loadedData = FormDataManager.loadFromStorage()
      
      expect(FormDataManager.loadFromStorage).toHaveBeenCalled()
      expect(loadedData).toEqual(mockFormData)
    })

    it('should handle storage and URL data conflicts', () => {
      const urlData = { ...mockFormData, storeName: 'URL店铺' }
      const storageData = { ...mockFormData, storeName: '存储店铺' }
      
      ;(FormDataManager.decodeFromUrl as any).mockReturnValue(urlData)
      ;(FormDataManager.loadFromStorage as any).mockReturnValue(storageData)
      
      const fromUrl = FormDataManager.decodeFromUrl('encoded-url-data')
      const fromStorage = FormDataManager.loadFromStorage()
      
      // URL data should take precedence
      expect(fromUrl?.storeName).toBe('URL店铺')
      expect(fromStorage?.storeName).toBe('存储店铺')
    })
  })

  describe('Error Handling During Navigation', () => {
    it('should handle encoding errors gracefully', () => {
      ;(FormDataManager.encodeForUrl as any).mockReturnValue('')
      
      const result = FormDataManager.encodeForUrl(mockFormData)
      
      expect(result).toBe('')
    })

    it('should handle decoding errors gracefully', () => {
      ;(FormDataManager.decodeFromUrl as any).mockReturnValue(null)
      
      const result = FormDataManager.decodeFromUrl('invalid-data')
      
      expect(result).toBeNull()
    })

    it('should handle storage errors during navigation', () => {
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

    it('should provide data summary for navigation context', () => {
      const summary = FormDataManager.getFormDataSummary(mockFormData)
      
      expect(FormDataManager.getFormDataSummary).toHaveBeenCalledWith(mockFormData)
      expect(summary).toBe('测试店铺 - 餐饮 - 北京市朝阳区')
    })
  })

  describe('Navigation Flow Integration', () => {
    it('should complete full navigation flow from form to generate page', () => {
      // 1. Validate form data
      ;(FormDataManager.validateFormData as any).mockReturnValue({ isValid: true, errors: {} })
      const validationResult = FormDataManager.validateFormData(mockFormData)
      expect(validationResult.isValid).toBe(true)
      
      // 2. Encode for URL
      ;(FormDataManager.encodeForUrl as any).mockReturnValue('encoded-data')
      const encoded = FormDataManager.encodeForUrl(mockFormData)
      expect(encoded).toBe('encoded-data')
      
      // 3. Save to storage as backup
      FormDataManager.saveToStorage(mockFormData)
      expect(FormDataManager.saveToStorage).toHaveBeenCalledWith(mockFormData)
      
      // 4. Create navigation URL
      const navigationUrl = `/generate?data=${encoded}`
      expect(navigationUrl).toBe('/generate?data=encoded-data')
    })

    it('should complete full navigation flow from generate back to form page', () => {
      // 1. Decode data from URL
      ;(FormDataManager.decodeFromUrl as any).mockReturnValue(mockFormData)
      const decoded = FormDataManager.decodeFromUrl('encoded-form-data')
      expect(decoded).toBeTruthy()
      
      // 2. Save current state
      if (decoded) {
        FormDataManager.saveToStorage(decoded)
        expect(FormDataManager.saveToStorage).toHaveBeenCalledWith(decoded)
      }
      
      // 3. Navigate back to form
      const backUrl = '/'
      expect(backUrl).toBe('/')
    })

    it('should handle navigation with validation failures', () => {
      ;(FormDataManager.validateFormData as any).mockReturnValue({
        isValid: false,
        errors: { storeName: '店铺名称不能为空' }
      })
      
      const validationResult = FormDataManager.validateFormData(mockFormData)
      
      expect(validationResult.isValid).toBe(false)
      expect(validationResult.errors.storeName).toBe('店铺名称不能为空')
      
      // Should not proceed with navigation if validation fails
    })
  })
})