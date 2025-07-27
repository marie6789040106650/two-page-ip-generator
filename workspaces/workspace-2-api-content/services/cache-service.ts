import NodeCache from 'node-cache'

export class CacheService {
  private static cache = new NodeCache({ 
    stdTTL: 3600, // 默认1小时过期
    checkperiod: 600 // 每10分钟检查过期项
  })

  static async get(key: string): Promise<any> {
    try {
      const value = this.cache.get(key)
      if (value) {
        console.log(`Cache hit for key: ${key}`)
        return value
      }
      console.log(`Cache miss for key: ${key}`)
      return null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  static async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const success = this.cache.set(key, value, ttl)
      if (success) {
        console.log(`Cache set for key: ${key}`)
      }
      return success
    } catch (error) {
      console.error('Cache set error:', error)
      return false
    }
  }

  static async del(key: string): Promise<number> {
    try {
      return this.cache.del(key)
    } catch (error) {
      console.error('Cache delete error:', error)
      return 0
    }
  }

  static async clear(): Promise<void> {
    try {
      this.cache.flushAll()
      console.log('Cache cleared')
    } catch (error) {
      console.error('Cache clear error:', error)
    }
  }

  static getStats() {
    return this.cache.getStats()
  }
}