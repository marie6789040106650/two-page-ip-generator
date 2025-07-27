// 表单数据类型 - 与原项目完全兼容
export interface FormData {
  storeName: string
  storeCategory: string
  storeLocation: string
  businessDuration: string
  storeFeatures: string
  ownerName: string
  ownerFeatures: string
  // 扩展字段，用于关键词扩展功能
  storeType?: string
  targetAudience?: string
  businessGoals?: string
  // 为了兼容原项目的generate-page-content.tsx，添加别名属性
  name?: string
  industry?: string
  coreValue?: string
  personalStory?: string
  skills?: string[]
  contentDirection?: string[]
  platforms?: string[]
}

// 表单验证错误类型
export interface FormErrors {
  [key: string]: string
}

// 表单状态类型
export interface FormState {
  data: Partial<FormData>
  errors: FormErrors
  isLoading: boolean
  isValid: boolean
  isDirty: boolean
}

// 批量输入数据类型
export interface BulkInputData {
  format: 'text' | 'json' | 'csv'
  content: string
  parsedData?: Partial<FormData>
}

// 关键词扩展类型
export interface KeywordSuggestion {
  keyword: string
  relevance: number
  category: string
}

// 表单配置类型
export interface FormConfig {
  autoSave: boolean
  autoSaveInterval: number
  showProgress: boolean
  enableBulkInput: boolean
  enableKeywordExpansion: boolean
}

// 表单事件类型
export interface FormEvent {
  type: 'FIELD_CHANGE' | 'FORM_SUBMIT' | 'FORM_RESET' | 'BULK_INPUT' | 'KEYWORD_EXPAND'
  field?: string
  value?: any
  timestamp: number
}