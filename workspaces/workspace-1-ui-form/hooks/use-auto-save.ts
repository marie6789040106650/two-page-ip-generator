'use client'

import { useEffect, useRef, useCallback } from 'react'

interface UseAutoSaveOptions {
  key: string
  data: any
  enabled: boolean
  interval?: number
  onSave?: (data: any) => void
  onLoad?: (data: any) => void
}

export function useAutoSave({
  key,
  data,
  enabled = true,
  interval = 2000,
  onSave,
  onLoad
}: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastSavedRef = useRef<string>()

  // 保存数据到localStorage
  const saveData = useCallback((dataToSave: any) => {
    try {
      const serializedData = JSON.stringify(dataToSave)
      localStorage.setItem(key, serializedData)
      lastSavedRef.current = serializedData
      onSave?.(dataToSave)
    } catch (error) {
      console.error('Auto-save failed:', error)
    }
  }, [key, onSave])

  // 从localStorage加载数据
  const loadData = useCallback(() => {
    try {
      const savedData = localStorage.getItem(key)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        onLoad?.(parsedData)
        return parsedData
      }
    } catch (error) {
      console.error('Auto-load failed:', error)
    }
    return null
  }, [key, onLoad])

  // 清除保存的数据
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(key)
      lastSavedRef.current = undefined
    } catch (error) {
      console.error('Clear saved data failed:', error)
    }
  }, [key])

  // 自动保存逻辑
  useEffect(() => {
    if (!enabled || !data) return

    const currentData = JSON.stringify(data)
    
    // 如果数据没有变化，不需要保存
    if (currentData === lastSavedRef.current) return

    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // 设置新的定时器
    timeoutRef.current = setTimeout(() => {
      saveData(data)
    }, interval)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, enabled, interval, saveData])

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    saveData,
    loadData,
    clearSavedData
  }
}