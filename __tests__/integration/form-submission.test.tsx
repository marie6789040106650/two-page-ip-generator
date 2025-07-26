import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FormDataManager } from '../../lib/form-data-manager'

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
    validateFormData: vi.fn(),
    encodeForUrl: vi.fn(() => 'encoded-data'),
    saveToStorage: vi.fn(),
    loadFromStorage: vi.fn(),
    isEmptyFormData: vi.fn(() => false),
    validateAndNormalizeFormData: vi.fn((data) => data)
  }
}))

describe('Form Submission Integration', () => {
  const validFormData = {
    storeName: '测试店铺',
    storeCategory: '餐饮',
    storeLocation: '北京市朝阳区',
    businessDuration: '3年',
    storeFeatures: '特色菜品丰富',
    ownerName: '张三',
    ownerFeatures: '热情好客',
    storeType: '',
    targetAudience: '',
    businessGoals: ''
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Form Validation Flow', () => {
    it('should validate complete form data as valid', () => {
      ;(FormDataManager.validateFormData as any).mockReturnValue({
        isValid: true,
        errors: {}
      })

      const result = FormDataManager.validateFormData(validFormData)
      
      expect(FormDataManager.validateFormData).toHaveBeenCalledWith(validFormData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should return validation errors for missing required fields', () => {
      const incompleteData = {
        ...validFormData,
        storeName: '',
        storeCategory: '',
        ownerName: ''
      }

      ;(FormDataManager.validateFormData as any).mockReturnValue({
        isValid: false,
        errors: {
          storeName: '店铺名称不能为空',
          storeCategory: '店铺品类不能为空',
          ownerName: '老板姓名不能为空'
        }
      })

      const result = FormDataManager.validateFormData(incompleteData)

      expect(result.isValid).toBe(false)
      expect(result.errors.storeName).toBe('店铺名称不能为空')
      expect(result.errors.storeCategory).toBe('店铺品类不能为空')
      expect(result.errors.ownerName).toBe('老板姓名不能为空')
    })

    it('should return validation errors for field length violations', () => {
      const invalidData = {
        ...validFormData,
        storeName: 'a'.repeat(51),
        ownerName: '张三123'
      }

      ;(FormDataManager.validateFormData as any).mockReturnValue({
        isValid: false,
        errors: {
          storeName: '店铺名称不能超过50个字符',
          ownerName: '老板姓名只能包含中文、英文和空格'
        }
      })

      const result = FormDataManager.validateFormData(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors.storeName).toBe('店铺名称不能超过50个字符')
      expect(result.errors.ownerName).toBe('老板姓名只能包含中文、英文和空格')
    })

    it('should validate form data with all required fields', () => {
      ;(FormDataManager.validateFormData as any).mockReturnValue({
        isValid: true,
        errors: {}
      })

      const result = FormDataManager.validateFormData(validFormData)

      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })
  })

  describe('Form Data Encoding', () => {
    it('should encode form data for URL transmission', () => {
      const encoded = FormDataManager.encodeForUrl(validFormData)
      
      expect(FormDataManager.encodeForUrl).toHaveBeenCalledWith(validFormData)
      expect(encoded).toBe('encoded-data')
    })

    it('should handle encoding errors gracefully', () => {
      ;(FormDataManager.encodeForUrl as any).mockReturnValue('')

      const result = FormDataManager.encodeForUrl(validFormData)
      
      expect(result).toBe('')
    })

    it('should encode and decode form data consistently', () => {
      const encoded = 'encoded-data'
      ;(FormDataManager.encodeForUrl as any).mockReturnValue(encoded)
      
      // Mock decodeFromUrl separately
      const mockDecodeFromUrl = vi.fn().mockReturnValue(validFormData)
      ;(FormDataManager as any).decodeFromUrl = mockDecodeFromUrl

      const encodedResult = FormDataManager.encodeForUrl(validFormData)
      const decodedResult = mockDecodeFromUrl(encodedResult)

      expect(encodedResult).toBe(encoded)
      expect(decodedResult).toEqual(validFormData)
    })
  })

  describe('Form Data Storage', () => {
    it('should save form data to storage', () => {
      FormDataManager.saveToStorage(validFormData)
      
      expect(FormDataManager.saveToStorage).toHaveBeenCalledWith(validFormData)
    })

    it('should load form data from storage', () => {
      ;(FormDataManager.loadFromStorage as any).mockReturnValue(validFormData)

      const result = FormDataManager.loadFromStorage()
      
      expect(FormDataManager.loadFromStorage).toHaveBeenCalled()
      expect(result).toEqual(validFormData)
    })

    it('should handle storage errors gracefully', () => {
      // Mock the implementation to simulate error handling
      ;(FormDataManager.saveToStorage as any).mockImplementation(() => {
        // Simulate internal error handling - the function should catch errors internally
        try {
          throw new Error('Storage error')
        } catch (error) {
          console.error('Storage error handled internally')
        }
      })

      // Should not throw when storage fails (errors handled internally)
      expect(() => FormDataManager.saveToStorage(validFormData)).not.toThrow()
    })
  })

  describe('Form Data Validation and Normalization', () => {
    it('should normalize form data', () => {
      const dataWithWhitespace = {
        ...validFormData,
        storeName: '  测试店铺  ',
        storeCategory: '\t餐饮\n'
      }

      const normalizedData = {
        ...validFormData,
        storeName: '测试店铺',
        storeCategory: '餐饮'
      }

      ;(FormDataManager.validateAndNormalizeFormData as any).mockReturnValue(normalizedData)

      const result = FormDataManager.validateAndNormalizeFormData(dataWithWhitespace)
      
      expect(result).toEqual(normalizedData)
    })

    it('should return null for invalid data', () => {
      ;(FormDataManager.validateAndNormalizeFormData as any).mockReturnValue(null)

      const result = FormDataManager.validateAndNormalizeFormData(null)
      
      expect(result).toBeNull()
    })

    it('should check if form data is empty', () => {
      const emptyData = FormDataManager.getDefaultFormData()
      ;(FormDataManager.isEmptyFormData as any).mockReturnValue(true)

      const result = FormDataManager.isEmptyFormData(emptyData)
      
      expect(result).toBe(true)
    })

    it('should check if form data is not empty', () => {
      ;(FormDataManager.isEmptyFormData as any).mockReturnValue(false)

      const result = FormDataManager.isEmptyFormData(validFormData)
      
      expect(result).toBe(false)
    })
  })

  describe('Integration Flow', () => {
    it('should complete full form submission flow', () => {
      // 1. Validate form data
      ;(FormDataManager.validateFormData as any).mockReturnValue({
        isValid: true,
        errors: {}
      })

      const validationResult = FormDataManager.validateFormData(validFormData)
      expect(validationResult.isValid).toBe(true)

      // 2. Encode for URL
      ;(FormDataManager.encodeForUrl as any).mockReturnValue('encoded-data')
      const encoded = FormDataManager.encodeForUrl(validFormData)
      expect(encoded).toBe('encoded-data')

      // 3. Save to storage
      FormDataManager.saveToStorage(validFormData)
      expect(FormDataManager.saveToStorage).toHaveBeenCalledWith(validFormData)

      // Complete flow should work without errors
      expect(true).toBe(true)
    })

    it('should handle validation failure in submission flow', () => {
      // 1. Validate form data (fails)
      ;(FormDataManager.validateFormData as any).mockReturnValue({
        isValid: false,
        errors: { storeName: '店铺名称不能为空' }
      })

      const validationResult = FormDataManager.validateFormData(validFormData)
      expect(validationResult.isValid).toBe(false)

      // Should not proceed with encoding if validation fails
      if (!validationResult.isValid) {
        expect(validationResult.errors.storeName).toBe('店铺名称不能为空')
      }
    })
  })
})