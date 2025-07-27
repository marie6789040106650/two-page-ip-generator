import type { Metadata } from 'next'
import { FormProvider } from '@/context/form-context'
import { PageHeader } from '@/components/page-header'
import { ProgressSteps } from '@/components/progress-steps'
import DisplayPageContent from './display-page-content'
import { generatePageMetadata, generateBreadcrumbData } from '@/lib/seo'

export const metadata: Metadata = generatePageMetadata(
  '方案展示',
  '查看专业的老板IP打造方案，采用Word文档样式展示，便于阅读和导出。',
  '/display',
  {
    keywords: ['老板IP', '方案展示', 'Word样式', 'IP方案', '个人品牌', '文档展示'],
  }
)

// Breadcrumb structured data
const breadcrumbData = generateBreadcrumbData([
  { name: '首页', url: '/' },
  { name: '信息填写', url: '/' },
  { name: '方案生成', url: '/generate' },
  { name: '方案展示', url: '/display' },
])

interface DisplayPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DisplayPage({ searchParams }: DisplayPageProps) {
  const resolvedSearchParams = await searchParams
  
  return (
    <FormProvider autoSave={false}>
      <div className="min-h-screen gradient-bg">
        {/* Structured data for breadcrumbs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbData),
          }}
        />
        
        <PageHeader />
        
        <main id="main-content" className="container-responsive py-4 sm:py-6 lg:py-8" role="main">
          <div className="max-w-6xl mx-auto">
            <div className="animate-fade-in">
              <ProgressSteps currentStep={3} />
            </div>
            
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* 页面标题区域 */}
              <div className="text-center animate-slide-up">
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold gradient-text mb-2 text-balance">
                  专业方案展示
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto text-balance">
                  采用专业文档样式展示您的老板IP打造方案
                </p>
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <DisplayPageContent searchParams={resolvedSearchParams} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </FormProvider>
  )
}