import { NextResponse } from 'next/server'
import { AIClient } from '@/lib/ai-client'
import { BannerGenerationService } from '@/services/banner-generation-service'
import { CacheService } from '@/services/cache-service'

export async function GET() {
  try {
    // 检查各个服务的健康状态
    const [aiHealthy, bannerHealthy] = await Promise.all([
      checkAIHealth(),
      BannerGenerationService.checkHealth()
    ])

    const cacheHealthy = checkCacheHealth()

    const allServicesHealthy = aiHealthy && bannerHealthy && cacheHealthy
    
    return NextResponse.json({
      status: allServicesHealthy ? 'healthy' : 'degraded',
      workspace: 'workspace-2-api-content',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        contentGeneration: aiHealthy ? 'active' : 'degraded',
        bannerGeneration: bannerHealthy ? 'active' : 'degraded',
        cache: cacheHealthy ? 'active' : 'error',
        ai: aiHealthy ? 'active' : 'degraded'
      },
      details: {
        aiMode: process.env.OPENAI_API_KEY ? 'real' : 'mock',
        bannerMode: process.env.OPENAI_API_KEY ? 'real' : 'mock'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'error',
      workspace: 'workspace-2-api-content',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      error: 'Health check failed',
      services: {
        contentGeneration: 'unknown',
        bannerGeneration: 'unknown',
        cache: 'unknown',
        ai: 'unknown'
      }
    }, { status: 500 })
  }
}

async function checkAIHealth(): Promise<boolean> {
  try {
    const aiClient = new AIClient()
    return await aiClient.checkHealth()
  } catch (error) {
    console.error('AI health check failed:', error)
    return false
  }
}

function checkCacheHealth(): boolean {
  try {
    const stats = CacheService.getStats()
    return stats !== null
  } catch (error) {
    console.error('Cache health check failed:', error)
    return false
  }
}