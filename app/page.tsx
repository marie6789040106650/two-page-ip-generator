import type { Metadata } from 'next'
import { FormProvider } from '@/context/form-context'
import { PageHeader } from '@/components/page-header'
import { ProgressSteps } from '@/components/progress-steps'
import FormPageContent from './form-page-content'
import { generatePageMetadata, generateBreadcrumbData } from '@/lib/seo'

export const metadata: Metadata = generatePageMetadata(
  '信息填写',
  '填写店铺和老板信息，生成专业的IP打造方案。包括店铺名称、品类、位置、特色等详细信息。',
  '/',
  {
    keywords: ['老板IP', '方案生成', '店铺信息', '品牌打造', '个人品牌', 'IP打造'],
  }
)

// Breadcrumb structured data
const breadcrumbData = generateBreadcrumbData([
  { name: '首页', url: '/' },
  { name: '信息填写', url: '/' },
])

export default function HomePage() {
  return (
    <FormProvider autoSave={true}>
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
          <div className="max-w-4xl mx-auto">
            <div className="animate-fade-in">
              <ProgressSteps currentStep={1} />
            </div>
            
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="text-center animate-slide-up">
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold gradient-text mb-2 text-balance">
                  老板IP打造方案生成器
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto text-balance">
                  填写以下信息，我们将为您生成专业的老板IP打造方案
                </p>
              </div>
              
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <FormPageContent />
              </div>
            </div>
          </div>
        </main>
      </div>
    </FormProvider>
  )
}