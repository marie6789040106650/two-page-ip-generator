import type { Metadata } from 'next'
import { FormProvider } from '@/context/form-context'
import { PageHeader } from '@/components/page-header'
import { ProgressSteps } from '@/components/progress-steps'
import GeneratePageContent from './generate-page-content'
import { generatePageMetadata, generateBreadcrumbData } from '@/lib/seo'

export const metadata: Metadata = generatePageMetadata(
  '方案生成',
  '查看为您量身定制的专业老板IP打造方案，包含个性化的品牌建设建议和实施策略。',
  '/generate',
  {
    keywords: ['老板IP', '方案生成', '品牌打造', 'IP方案', '个人品牌', '商业策略'],
  }
)

// Breadcrumb structured data
const breadcrumbData = generateBreadcrumbData([
  { name: '首页', url: '/' },
  { name: '信息填写', url: '/' },
  { name: '方案生成', url: '/generate' },
])

interface GeneratePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function GeneratePage({ searchParams }: GeneratePageProps) {
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
              <ProgressSteps currentStep={2} />
            </div>
            
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* 页面标题区域 */}
              <div className="text-center animate-slide-up">
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold gradient-text mb-2 text-balance">
                  专业IP打造方案
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto text-balance">
                  基于您的信息，我们为您生成了专业的老板IP打造方案
                </p>
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <GeneratePageContent searchParams={resolvedSearchParams} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </FormProvider>
  )
}