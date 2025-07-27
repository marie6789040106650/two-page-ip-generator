import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '工作区1: UI复用和表单优化 | 店铺IP生成器',
  description: '专业的店铺IP方案生成工具，支持智能批量输入、自动保存等现代化表单功能',
  keywords: ['店铺IP', '表单优化', '批量输入', '自动保存', '响应式设计'],
  authors: [{ name: '工作区1开发团队' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}