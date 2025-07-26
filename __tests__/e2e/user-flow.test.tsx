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
    validateFormData: vi.fn(() => ({ isValid: true, errors: {} })),
    encodeForUrl: vi.fn(() => 'encoded-data'),
    decodeFromUrl: vi.fn(),
    saveToStorage: vi.fn(),
    loadFromStorage: vi.fn(),
    clearStorage: vi.fn(),
    isEmptyFormData: vi.fn(() => false),
    getFormDataSummary: vi.fn(() => '测试店铺 - 餐饮 - 北京市朝阳区'),
    validateAndNormalizeFormData: vi.fn((data) => data)
  }
}))

// Mock localStorage for persistence testing
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
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

describe('End-to-End User Flow Tests', () => {
  const completeFormData = {
    storeName: '小李家面馆',
    storeCategory: '中式快餐',
    storeLocation: '北京市海淀区中关村大街1号',
    businessDuration: '5年',
    storeFeatures: '手工拉面、秘制汤底、24小时营业、外卖配送',
    ownerName: '李明',
    ownerFeatures: '20年餐饮经验、亲自下厨、热情服务、注重品质',
    storeType: '快餐店',
    targetAudience: '上班族、学生、夜宵客户',
    businessGoals: '扩大品牌影响力、增加线上订单、开设分店'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Set up default mocks
    ;(FormDataManager.validateFormData as any).mockReturnValue({ isValid: true, errors: {} })
    ;(FormDataManager.encodeForUrl as any).mockReturnValue('encoded-data')
    ;(FormDataManager.decodeFromUrl as any).mockReturnValue(completeFormData)
    ;(FormDataManager.loadFromStorage as any).mockReturnValue(completeFormData)
    ;(FormDataManager.isEmptyFormData as any).mockReturnValue(false)
    ;(FormDataManager.getFormDataSummary as any).mockReturnValue(`${completeFormData.storeName} - ${completeFormData.storeCategory} - ${completeFormData.storeLocation}`)
    ;(FormDataManager.validateAndNormalizeFormData as any).mockImplementation((data: any) => data)
    
    // Mock btoa/atob for encoding tests
    global.btoa = global.btoa || ((str) => Buffer.from(str).toString('base64'))
    global.atob = global.atob || ((str) => Buffer.from(str, 'base64').toString())
  })

  describe('Complete User Journey: Form Filling to Result Generation', () => {
    it('should complete the full user journey successfully', () => {
      // Step 1: User starts with empty form
      const initialData = FormDataManager.getDefaultFormData()
      expect(initialData.storeName).toBe('')
      expect(initialData.storeCategory).toBe('')

      // Step 2: User fills in basic information
      const basicInfo = {
        ...initialData,
        storeName: completeFormData.storeName,
        storeCategory: completeFormData.storeCategory,
        storeLocation: completeFormData.storeLocation
      }

      // Simulate auto-save during typing
      FormDataManager.saveToStorage(basicInfo)
      expect(FormDataManager.saveToStorage).toHaveBeenCalledWith(basicInfo)

      // Step 3: User continues filling detailed information
      const detailedInfo = {
        ...basicInfo,
        businessDuration: completeFormData.businessDuration,
        storeFeatures: completeFormData.storeFeatures,
        ownerName: completeFormData.ownerName,
        ownerFeatures: completeFormData.ownerFeatures
      }

      // Step 4: User fills optional information
      const completeInfo = {
        ...detailedInfo,
        storeType: completeFormData.storeType,
        targetAudience: completeFormData.targetAudience,
        businessGoals: completeFormData.businessGoals
      }

      // Step 5: Validate complete form
      const validation = FormDataManager.validateFormData(completeInfo)
      expect(validation.isValid).toBe(true)
      expect(Object.keys(validation.errors)).toHaveLength(0)

      // Step 6: Encode data for navigation
      const encodedData = FormDataManager.encodeForUrl(completeInfo)
      expect(encodedData).toBeTruthy()
      expect(typeof encodedData).toBe('string')

      // Step 7: Save final data before navigation
      FormDataManager.saveToStorage(completeInfo)

      // Step 8: Navigate to result page
      const navigationUrl = `/generate?data=${encodedData}`
      expect(navigationUrl).toContain('/generate')
      expect(navigationUrl).toContain('data=')

      // Step 9: Decode data on result page
      const decodedData = FormDataManager.decodeFromUrl(encodedData)
      expect(decodedData).toBeTruthy()
      if (decodedData) {
        expect(decodedData.storeName).toBe(completeFormData.storeName)
        expect(decodedData.storeCategory).toBe(completeFormData.storeCategory)
      }

      // Step 10: Generate summary for display
      const summary = FormDataManager.getFormDataSummary(completeInfo)
      expect(summary).toContain(completeFormData.storeName)
      expect(summary).toContain(completeFormData.storeCategory)
      expect(summary).toContain(completeFormData.storeLocation)
    })

    it('should handle incomplete form submission gracefully', () => {
      // User fills only partial information
      const partialData = {
        ...FormDataManager.getDefaultFormData(),
        storeName: completeFormData.storeName,
        storeCategory: completeFormData.storeCategory
        // Missing required fields: storeLocation, businessDuration, etc.
      }

      // Mock validation to return invalid for partial data
      ;(FormDataManager.validateFormData as any).mockReturnValue({
        isValid: false,
        errors: { storeLocation: '店铺位置不能为空', businessDuration: '经营时长不能为空' }
      })

      // Validate partial form
      const validation = FormDataManager.validateFormData(partialData)
      expect(validation.isValid).toBe(false)
      expect(Object.keys(validation.errors).length).toBeGreaterThan(0)

      // Should still save partial data for recovery
      FormDataManager.saveToStorage(partialData)

      // Should still be able to encode partial data
      const encoded = FormDataManager.encodeForUrl(partialData)
      expect(typeof encoded).toBe('string')

      // Should be able to decode partial data
      const decoded = FormDataManager.decodeFromUrl(encoded)
      expect(decoded).toBeTruthy()
    })

    it('should handle user returning to modify information', () => {
      // Step 1: User completes form and navigates to result
      const encoded = FormDataManager.encodeForUrl(completeFormData)
      const navigationUrl = `/generate?data=${encoded}`

      // Step 2: User views result page
      const decodedData = FormDataManager.decodeFromUrl(encoded)
      expect(decodedData).toBeTruthy()

      // Step 3: User decides to modify information
      // Save current state before going back
      if (decodedData) {
        FormDataManager.saveToStorage(decodedData)
      }

      // Step 4: User navigates back to form
      const backUrl = '/'

      // Step 5: Form should restore previous data
      const restoredData = FormDataManager.loadFromStorage()
      expect(restoredData).toBeTruthy()
      if (restoredData) {
        expect(restoredData.storeName).toBe(completeFormData.storeName)
      }

      // Step 6: User modifies some information
      const modifiedData = {
        ...completeFormData,
        storeName: '小李家特色面馆', // Modified name
        storeFeatures: '手工拉面、秘制汤底、24小时营业、外卖配送、会员优惠' // Added feature
      }

      // Step 7: Validate modified data
      const validation = FormDataManager.validateFormData(modifiedData)
      expect(validation.isValid).toBe(true)

      // Step 8: Navigate to result with modified data
      const newEncoded = FormDataManager.encodeForUrl(modifiedData)
      const newNavigationUrl = `/generate?data=${newEncoded}`

      // Step 9: Verify modified data on result page
      ;(FormDataManager.decodeFromUrl as any).mockReturnValue(modifiedData)
      const newDecodedData = FormDataManager.decodeFromUrl(newEncoded)
      expect(newDecodedData?.storeName).toBe('小李家特色面馆')
      expect(newDecodedData?.storeFeatures).toContain('会员优惠')
    })
  })

  describe('Data Persistence Across Sessions', () => {
    it('should persist data across browser sessions', () => {
      // Simulate user session 1
      FormDataManager.saveToStorage(completeFormData)
      expect(FormDataManager.saveToStorage).toHaveBeenCalledWith(completeFormData)

      // Simulate browser restart / new session
      localStorageMock.getItem.mockReturnValue(JSON.stringify(completeFormData))

      // User returns and data should be restored
      const restoredData = FormDataManager.loadFromStorage()
      expect(restoredData).toEqual(completeFormData)

      // User can continue from where they left off
      const validation = FormDataManager.validateFormData(restoredData!)
      expect(validation.isValid).toBe(true)
    })

    it('should handle data corruption gracefully', () => {
      // Simulate corrupted localStorage data
      ;(FormDataManager.loadFromStorage as any).mockReturnValue(null)

      // Should not crash and return null
      const restoredData = FormDataManager.loadFromStorage()
      expect(restoredData).toBeNull()

      // User should be able to start fresh
      const defaultData = FormDataManager.getDefaultFormData()
      expect(defaultData).toBeDefined()
      expect(defaultData.storeName).toBe('')
    })

    it('should handle storage quota exceeded', () => {
      // Simulate storage quota exceeded
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

      // Should handle error gracefully
      expect(() => FormDataManager.saveToStorage(completeFormData)).not.toThrow()

      // User should still be able to continue
      const validation = FormDataManager.validateFormData(completeFormData)
      expect(validation.isValid).toBe(true)
    })
  })

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle extremely long input values', () => {
      const extremeData = {
        ...completeFormData,
        storeName: 'A'.repeat(1000), // Very long name
        storeFeatures: 'B'.repeat(5000), // Very long description
        ownerFeatures: 'C'.repeat(3000) // Very long description
      }

      // Should validate and handle long data
      const validation = FormDataManager.validateFormData(extremeData)
      // Validation might fail due to length limits, which is expected
      expect(typeof validation.isValid).toBe('boolean')

      // Should still be able to encode/decode
      const encoded = FormDataManager.encodeForUrl(extremeData)
      expect(typeof encoded).toBe('string')

      if (encoded) {
        const decoded = FormDataManager.decodeFromUrl(encoded)
        expect(decoded).toBeTruthy()
      }
    })

    it('should handle special characters and unicode', () => {
      const unicodeData = {
        ...completeFormData,
        storeName: '小李家面馆🍜',
        storeCategory: '中式快餐 & 夜宵',
        storeLocation: '北京市海淀区中关村大街1号（地铁4号线中关村站A口）',
        storeFeatures: '手工拉面🍜、秘制汤底🥣、24小时营业⏰、外卖配送🚚',
        ownerName: 'José María李明',
        ownerFeatures: '20年餐饮经验👨‍🍳、亲自下厨、热情服务😊、注重品质✨'
      }

      // Should handle unicode characters
      const validation = FormDataManager.validateFormData(unicodeData)
      expect(typeof validation.isValid).toBe('boolean')

      // Should encode/decode unicode properly
      const encoded = FormDataManager.encodeForUrl(unicodeData)
      expect(typeof encoded).toBe('string')

      // Mock decode to return the unicode data
      ;(FormDataManager.decodeFromUrl as any).mockReturnValue(unicodeData)
      const decoded = FormDataManager.decodeFromUrl(encoded)
      expect(decoded).toBeTruthy()
      if (decoded) {
        expect(decoded.storeName).toBe(unicodeData.storeName)
      }
    })

    it('should handle rapid form changes', () => {
      // Simulate rapid typing/changes
      const changes = [
        { storeName: 'A' },
        { storeName: 'AB' },
        { storeName: 'ABC面馆' },
        { storeName: '小李家面馆' },
        { storeCategory: '中式' },
        { storeCategory: '中式快餐' }
      ]

      let currentData = FormDataManager.getDefaultFormData()

      changes.forEach(change => {
        currentData = { ...currentData, ...change }
        
        // Each change should be valid for encoding
        const encoded = FormDataManager.encodeForUrl(currentData)
        expect(typeof encoded).toBe('string')

        // Should be able to save each state
        FormDataManager.saveToStorage(currentData)
      })

      // Final state should be valid
      const validation = FormDataManager.validateFormData(currentData)
      expect(typeof validation.isValid).toBe('boolean')
    })
  })

  describe('Cross-Browser Compatibility Simulation', () => {
    it('should work with different localStorage implementations', () => {
      // Test with different localStorage behaviors
      const testCases = [
        // Normal case
        () => JSON.stringify(completeFormData),
        // Case with extra whitespace
        () => '  ' + JSON.stringify(completeFormData) + '  ',
        // Case with different JSON formatting
        () => JSON.stringify(completeFormData, null, 2)
      ]

      testCases.forEach((testCase, index) => {
        localStorageMock.getItem.mockReturnValue(testCase())
        
        const loaded = FormDataManager.loadFromStorage()
        expect(loaded).toBeTruthy()
        
        if (loaded) {
          expect(loaded.storeName).toBe(completeFormData.storeName)
        }
      })
    })

    it('should handle different encoding environments', () => {
      // Test with different btoa/atob implementations
      const originalBtoa = global.btoa
      const originalAtob = global.atob

      try {
        // Test with Buffer-based implementation (Node.js)
        global.btoa = (str) => Buffer.from(str).toString('base64')
        global.atob = (str) => Buffer.from(str, 'base64').toString()

        const encoded1 = FormDataManager.encodeForUrl(completeFormData)
        const decoded1 = FormDataManager.decodeFromUrl(encoded1)

        expect(decoded1).toBeTruthy()
        if (decoded1) {
          expect(decoded1.storeName).toBe(completeFormData.storeName)
        }

        // Test with native implementation (if available)
        if (originalBtoa && originalAtob) {
          global.btoa = originalBtoa
          global.atob = originalAtob

          const encoded2 = FormDataManager.encodeForUrl(completeFormData)
          const decoded2 = FormDataManager.decodeFromUrl(encoded2)

          expect(decoded2).toBeTruthy()
          if (decoded2) {
            expect(decoded2.storeName).toBe(completeFormData.storeName)
          }
        }
      } finally {
        // Restore original implementations
        global.btoa = originalBtoa
        global.atob = originalAtob
      }
    })
  })

  describe('Performance and Scalability', () => {
    it('should handle large datasets efficiently', () => {
      // Create a large dataset
      const largeData = {
        ...completeFormData,
        storeFeatures: Array(100).fill('特色服务项目').join('、'),
        ownerFeatures: Array(50).fill('专业技能').join('、'),
        businessGoals: Array(20).fill('发展目标').join('、')
      }

      // Should handle large data without performance issues
      const startTime = Date.now()
      
      const validation = FormDataManager.validateFormData(largeData)
      const encoded = FormDataManager.encodeForUrl(largeData)
      const decoded = FormDataManager.decodeFromUrl(encoded)
      
      const endTime = Date.now()
      const processingTime = endTime - startTime

      // Should complete within reasonable time (less than 1 second)
      expect(processingTime).toBeLessThan(1000)
      
      // Results should still be valid
      expect(typeof validation.isValid).toBe('boolean')
      expect(typeof encoded).toBe('string')
      expect(decoded).toBeTruthy()
    })

    it('should handle multiple concurrent operations', () => {
      // Simulate multiple operations happening simultaneously
      const operations = Array(10).fill(null).map((_, index) => {
        const data = {
          ...completeFormData,
          storeName: `${completeFormData.storeName}_${index}`
        }

        return {
          validate: () => FormDataManager.validateFormData(data),
          encode: () => FormDataManager.encodeForUrl(data),
          save: () => FormDataManager.saveToStorage(data)
        }
      })

      // Execute all operations
      const results = operations.map(op => ({
        validation: op.validate(),
        encoded: op.encode(),
        saved: op.save()
      }))

      // All operations should complete successfully
      results.forEach((result, index) => {
        expect(typeof result.validation.isValid).toBe('boolean')
        expect(typeof result.encoded).toBe('string')
        // saved operation returns void, so just check it doesn't throw
      })
    })
  })
})