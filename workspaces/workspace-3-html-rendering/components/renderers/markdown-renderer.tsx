'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import parse from 'html-react-parser'
import DOMPurify from 'dompurify'
import { motion } from 'framer-motion'
import { MarkdownContent, RenderOptions } from '@/types/renderer-types'

interface MarkdownRendererProps {
  content: MarkdownContent
  options: RenderOptions
  className?: string
  onRenderComplete?: (html: string) => void
}

export function MarkdownRenderer({
  content,
  options,
  className = '',
  onRenderComplete
}: MarkdownRendererProps) {
  const [htmlContent, setHtmlContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 处理Markdown转换 - 支持完整的Markdown语法
  const processMarkdown = useMemo(() => async (markdown: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // 使用remark处理完整的Markdown语法
      const result = await remark()
        .use(remarkGfm) // GitHub风格Markdown (表格、删除线、任务列表等)
        .use(remarkBreaks) // 支持换行
        .use(remarkMath) // 数学公式支持
        .use(remarkHtml, { sanitize: false })
        .use(rehypeKatex) // 数学公式渲染
        .use(rehypeHighlight) // 代码高亮
        .process(markdown)

      let html = String(result)

      // 清理HTML内容
      if (typeof window !== 'undefined') {
        html = DOMPurify.sanitize(html, {
          ADD_TAGS: ['math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac', 'munder', 'mover'],
          ADD_ATTR: ['class', 'style']
        })
      }

      // 应用Word样式类名
      html = applyWordStyles(html)

      setHtmlContent(html)
      onRenderComplete?.(html)

    } catch (err) {
      console.error('Markdown processing error:', err)
      setError('内容渲染失败')
    } finally {
      setIsLoading(false)
    }
  }, [onRenderComplete])

  // 应用Word文档样式
  const applyWordStyles = (html: string): string => {
    return html
      // 标题样式
      .replace(/<h1([^>]*)>/g, '<h1$1 class="word-h1">')
      .replace(/<h2([^>]*)>/g, '<h2$1 class="word-h2">')
      .replace(/<h3([^>]*)>/g, '<h3$1 class="word-h3">')
      .replace(/<h4([^>]*)>/g, '<h4$1 class="word-h4">')
      .replace(/<h5([^>]*)>/g, '<h5$1 class="word-h5">')
      .replace(/<h6([^>]*)>/g, '<h6$1 class="word-h6">')
      // 段落样式
      .replace(/<p([^>]*)>/g, '<p$1 class="word-paragraph">')
      // 列表样式
      .replace(/<ul([^>]*)>/g, '<ul$1 class="word-ul">')
      .replace(/<ol([^>]*)>/g, '<ol$1 class="word-ol">')
      .replace(/<li([^>]*)>/g, '<li$1 class="word-li">')
      // 表格样式
      .replace(/<table([^>]*)>/g, '<table$1 class="word-table">')
      .replace(/<thead([^>]*)>/g, '<thead$1 class="word-thead">')
      .replace(/<tbody([^>]*)>/g, '<tbody$1 class="word-tbody">')
      .replace(/<tr([^>]*)>/g, '<tr$1 class="word-tr">')
      .replace(/<th([^>]*)>/g, '<th$1 class="word-th">')
      .replace(/<td([^>]*)>/g, '<td$1 class="word-td">')
      // 代码样式
      .replace(/<pre([^>]*)>/g, '<pre$1 class="word-pre">')
      .replace(/<code([^>]*)>/g, '<code$1 class="word-code">')
      // 引用样式
      .replace(/<blockquote([^>]*)>/g, '<blockquote$1 class="word-blockquote">')
      // 强调样式
      .replace(/<strong([^>]*)>/g, '<strong$1 class="word-strong">')
      .replace(/<em([^>]*)>/g, '<em$1 class="word-em">')
      // 删除线
      .replace(/<del([^>]*)>/g, '<del$1 class="word-del">')
      // 链接样式
      .replace(/<a([^>]*)>/g, '<a$1 class="word-link">')
      // 图片样式
      .replace(/<img([^>]*)>/g, '<img$1 class="word-img">')
      // 分割线
      .replace(/<hr([^>]*)>/g, '<hr$1 class="word-hr">')
      // 任务列表
      .replace(/<input type="checkbox"([^>]*)>/g, '<input type="checkbox"$1 class="word-checkbox">')
  }

  useEffect(() => {
    if (content.content) {
      processMarkdown(content.content)
    }
  }, [content.content, processMarkdown])

  if (isLoading) {
    return (
      <div className={`markdown-renderer loading ${className}`}>
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
          />
          <span className="ml-3 text-gray-600">正在渲染内容...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`markdown-renderer error ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`markdown-renderer word-document-style ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}