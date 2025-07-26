import { FormData } from './types'

/**
 * 表单数据管理器
 * 负责表单数据的编码/解码、持久化存储和验证
 */
export class FormDataManager {
  private static readonly STORAGE_KEY = 'two-page-ip-form-data'
  private static readonly URL_PARAM_KEY = 'data'

  /**
   * 将表单数据保存到localStorage
   */
  static saveToStorage(data: FormData): void {
    try {
      const serialized = JSON.stringify(data)
      localStorage.setItem(this.STORAGE_KEY, serialized)
    } catch (error) {
      console.error('Failed to save form data to storage:', error)
    }
  }

  /**
   * 从localStorage加载表单数据
   */
  static loadFromStorage(): FormData | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return null
      
      const parsed = JSON.parse(stored)
      const normalized = this.validateAndNormalizeFormData(parsed)
      
      // 如果数据损坏，尝试恢复部分数据
      if (!normalized) {
        console.warn('Stored data is corrupted, attempting partial recovery')
        return this.attemptDataRecovery(parsed)
      }
      
      return normalized
    } catch (error) {
      console.error('Failed to load form data from storage:', error)
      // 尝试从备份恢复
      return this.loadFromBackup()
    }
  }

  /**
   * 清除localStorage中的表单数据
   */
  static clearStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear form data from storage:', error)
    }
  }

  /**
   * 将表单数据编码为URL参数字符串
   */
  static encodeForUrl(data: FormData): string {
    try {
      const compressed = this.compressFormData(data)
      const encoded = btoa(JSON.stringify(compressed))
      return encodeURIComponent(encoded)
    } catch (error) {
      console.error('Failed to encode form data for URL:', error)
      return ''
    }
  }

  /**
   * 从URL参数字符串解码表单数据
   */
  static decodeFromUrl(encoded: string): FormData | null {
    try {
      const decoded = decodeURIComponent(encoded)
      const decompressed = JSON.parse(atob(decoded))
      const expanded = this.expandFormData(decompressed)
      return this.validateAndNormalizeFormData(expanded)
    } catch (error) {
      console.error('Failed to decode form data from URL:', error)
      return null
    }
  }

  /**
   * 验证表单数据的完整性和格式
   */
  static validateFormData(data: FormData): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    // 必填字段验证
    const requiredFields = [
      { key: 'storeName', label: '店铺名称' },
      { key: 'storeCategory', label: '店铺品类' },
      { key: 'storeLocation', label: '店铺位置' },
      { key: 'businessDuration', label: '经营时长' },
      { key: 'storeFeatures', label: '店铺特色' },
      { key: 'ownerName', label: '老板姓名' },
      { key: 'ownerFeatures', label: '老板特色' }
    ]

    requiredFields.forEach(({ key, label }) => {
      const value = data[key as keyof FormData]
      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        errors[key] = `${label}不能为空`
      }
    })

    // 字段长度验证
    const lengthValidations = [
      { key: 'storeName', max: 50, label: '店铺名称' },
      { key: 'storeCategory', max: 30, label: '店铺品类' },
      { key: 'storeLocation', max: 100, label: '店铺位置' },
      { key: 'businessDuration', max: 20, label: '经营时长' },
      { key: 'storeFeatures', max: 500, label: '店铺特色' },
      { key: 'ownerName', max: 20, label: '老板姓名' },
      { key: 'ownerFeatures', max: 500, label: '老板特色' }
    ]

    lengthValidations.forEach(({ key, max, label }) => {
      const value = data[key as keyof FormData]
      if (value && typeof value === 'string' && value.length > max) {
        errors[key] = `${label}不能超过${max}个字符`
      }
    })

    // 特殊格式验证
    if (data.ownerName && !/^[\u4e00-\u9fa5a-zA-Z\s]{1,20}$/.test(data.ownerName)) {
      errors.ownerName = '老板姓名只能包含中文、英文和空格'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  /**
   * 获取默认的空表单数据
   */
  static getDefaultFormData(): FormData {
    return {
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
    }
  }

  /**
   * 合并表单数据，用新数据覆盖旧数据中的非空字段
   */
  static mergeFormData(existing: FormData, updates: Partial<FormData>): FormData {
    const merged = { ...existing }
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        (merged as any)[key] = value
      }
    })

    return merged
  }

  /**
   * 压缩表单数据以减少URL长度
   */
  private static compressFormData(data: FormData): Record<string, string> {
    const keyMap: Partial<Record<keyof FormData, string>> = {
      storeName: 'sn',
      storeCategory: 'sc',
      storeLocation: 'sl',
      businessDuration: 'bd',
      storeFeatures: 'sf',
      ownerName: 'on',
      ownerFeatures: 'of',
      storeType: 'st',
      targetAudience: 'ta',
      businessGoals: 'bg'
    }

    const compressed: Record<string, string> = {}
    Object.entries(data).forEach(([key, value]) => {
      const shortKey = keyMap[key as keyof FormData]
      if (shortKey && value) {
        compressed[shortKey] = value
      }
    })

    return compressed
  }

  /**
   * 展开压缩的表单数据
   */
  private static expandFormData(compressed: Record<string, string>): FormData {
    const keyMap: Record<string, keyof FormData> = {
      sn: 'storeName',
      sc: 'storeCategory',
      sl: 'storeLocation',
      bd: 'businessDuration',
      sf: 'storeFeatures',
      on: 'ownerName',
      of: 'ownerFeatures',
      st: 'storeType',
      ta: 'targetAudience',
      bg: 'businessGoals'
    }

    const expanded = this.getDefaultFormData()
    Object.entries(compressed).forEach(([shortKey, value]) => {
      const fullKey = keyMap[shortKey]
      if (fullKey && value) {
        (expanded as any)[fullKey] = value
      }
    })

    return expanded
  }

  /**
   * 验证并规范化表单数据
   */
  static validateAndNormalizeFormData(data: any): FormData | null {
    if (!data || typeof data !== 'object') {
      return null
    }

    const normalized = this.getDefaultFormData()
    
    // 只保留有效的字段
    Object.keys(normalized).forEach(key => {
      const value = data[key]
      if (typeof value === 'string') {
        (normalized as any)[key] = value.trim()
      }
    })

    return normalized
  }

  /**
   * 检查表单数据是否为空
   */
  static isEmptyFormData(data: FormData): boolean {
    const requiredFields = ['storeName', 'storeCategory', 'storeLocation', 'businessDuration', 'storeFeatures', 'ownerName', 'ownerFeatures']
    return requiredFields.every(field => {
      const value = data[field as keyof FormData]
      return !value || (typeof value === 'string' && value.trim() === '')
    })
  }

  /**
   * 生成表单数据的摘要信息
   */
  static getFormDataSummary(data: FormData): string {
    const { storeName, storeCategory, storeLocation } = data
    const parts = [storeName, storeCategory, storeLocation].filter(Boolean)
    return parts.join(' - ') || '未填写信息'
  }

  /**
   * 创建数据备份
   */
  private static createBackup(data: FormData): void {
    try {
      const backupKey = `${this.STORAGE_KEY}_backup`
      const serialized = JSON.stringify({
        data,
        timestamp: Date.now(),
        version: '1.0'
      })
      localStorage.setItem(backupKey, serialized)
    } catch (error) {
      console.error('Failed to create backup:', error)
    }
  }

  /**
   * 从备份恢复数据
   */
  private static loadFromBackup(): FormData | null {
    try {
      const backupKey = `${this.STORAGE_KEY}_backup`
      const stored = localStorage.getItem(backupKey)
      if (!stored) return null

      const backup = JSON.parse(stored)
      if (backup.data && backup.timestamp) {
        // 检查备份是否太旧（超过7天）
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
        if (backup.timestamp > sevenDaysAgo) {
          return this.validateAndNormalizeFormData(backup.data)
        }
      }
      return null
    } catch (error) {
      console.error('Failed to load from backup:', error)
      return null
    }
  }

  /**
   * 尝试从损坏的数据中恢复部分信息
   */
  private static attemptDataRecovery(corruptedData: any): FormData | null {
    try {
      const recovered = this.getDefaultFormData()
      
      // 尝试恢复基本字段
      const basicFields = ['storeName', 'storeCategory', 'storeLocation', 'ownerName']
      basicFields.forEach(field => {
        if (corruptedData[field] && typeof corruptedData[field] === 'string') {
          (recovered as any)[field] = corruptedData[field].trim()
        }
      })

      // 如果至少恢复了一些有用的数据，返回恢复的数据
      if (!this.isEmptyFormData(recovered)) {
        console.log('Partially recovered form data')
        return recovered
      }

      return null
    } catch (error) {
      console.error('Data recovery failed:', error)
      return null
    }
  }

  /**
   * 增强的保存方法，包含备份
   */
  static saveToStorageWithBackup(data: FormData): void {
    try {
      // 先创建备份
      this.createBackup(data)
      
      // 然后保存主数据
      this.saveToStorage(data)
    } catch (error) {
      console.error('Failed to save with backup:', error)
      // 即使备份失败，也尝试保存主数据
      this.saveToStorage(data)
    }
  }

  /**
   * 清理过期的备份数据
   */
  static cleanupOldBackups(): void {
    try {
      const backupKey = `${this.STORAGE_KEY}_backup`
      const stored = localStorage.getItem(backupKey)
      if (stored) {
        const backup = JSON.parse(stored)
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
        if (backup.timestamp && backup.timestamp < thirtyDaysAgo) {
          localStorage.removeItem(backupKey)
          console.log('Cleaned up old backup data')
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old backups:', error)
    }
  }
}