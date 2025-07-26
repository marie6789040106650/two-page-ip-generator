import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/error-boundary'
import { preloadCriticalComponents, addResourceHints } from '@/lib/dynamic-imports'
import { preloadCriticalResources } from '@/lib/performance'
import { structuredData } from '@/lib/seo'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: '老板IP打造方案生成器',
  description: '专业的老板IP打造方案生成工具，帮助您快速生成个性化的IP打造方案',
  keywords: ['老板IP', 'IP打造', '方案生成器', '品牌建设', '个人品牌', '商业IP'],
  authors: [{ name: 'IP Generator Team' }],
  creator: 'IP Generator Team',
  publisher: 'IP Generator Team',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    title: '老板IP打造方案生成器',
    description: '专业的老板IP打造方案生成工具，帮助您快速生成个性化的IP打造方案',
    siteName: '老板IP打造方案生成器',
  },
  twitter: {
    card: 'summary_large_image',
    title: '老板IP打造方案生成器',
    description: '专业的老板IP打造方案生成工具，帮助您快速生成个性化的IP打造方案',
  },
  verification: {
    // Add verification codes when available
    // google: 'your-google-verification-code',
    // baidu: 'your-baidu-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/globals.css" as="style" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        
        {/* Viewport meta tag for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Theme color and color scheme */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="light" />
        
        {/* Accessibility improvements */}
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        
        {/* Performance and accessibility script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize performance monitoring and accessibility
              if (typeof window !== 'undefined') {
                // Web Vitals reporting
                function reportWebVitals(metric) {
                  if (${process.env.NODE_ENV === 'development'}) {
                    console.log('[Web Vitals]', metric.name + ':', metric.value);
                  }
                }
                
                // Initialize on load
                window.addEventListener('load', function() {
                  // Preload critical components
                  ${preloadCriticalComponents.toString()}
                  preloadCriticalComponents();
                  
                  // Add resource hints
                  ${addResourceHints.toString()}
                  addResourceHints();
                  
                  // Preload critical resources
                  ${preloadCriticalResources.toString()}
                  preloadCriticalResources();
                  
                  // Initialize accessibility features
                  // Skip to main content link
                  const skipLink = document.createElement('a');
                  skipLink.href = '#main-content';
                  skipLink.textContent = '跳转到主要内容';
                  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded';
                  document.body.insertBefore(skipLink, document.body.firstChild);
                });
                
                // Keyboard navigation improvements
                document.addEventListener('keydown', function(e) {
                  // Show focus indicators when using keyboard
                  if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                  }
                });
                
                document.addEventListener('mousedown', function() {
                  // Hide focus indicators when using mouse
                  document.body.classList.remove('keyboard-navigation');
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <div className="min-h-screen gradient-bg">
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}