import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '工作区2 - API集成和内容生成',
  description: '店铺IP生成器 - 内容生成服务',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900">
                    内容生成服务
                  </h1>
                  <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                    工作区2
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  API服务 - 端口: 3002
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