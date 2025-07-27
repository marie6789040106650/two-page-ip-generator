import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '工作区3: HTML渲染和样式系统',
  description: '专业的HTML渲染和样式系统，支持Markdown转换、Word样式、水印系统和多主题',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900">
                    HTML渲染和样式系统
                  </h1>
                  <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                    工作区3
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  渲染服务 - 端口: 3003
                </div>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}