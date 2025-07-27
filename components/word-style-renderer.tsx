"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import type { FormData } from '@/lib/types'

interface WordStyleRendererProps {
  content: string
  formData: FormData | null
}

export function WordStyleRenderer({ content, formData }: WordStyleRendererProps) {
  // 解析Markdown内容为结构化数据
  const parseMarkdownContent = (markdown: string) => {
    const lines = markdown.split('\n')
    const sections: Array<{
      type: 'title' | 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'list'
      content: string
      level?: number
    }> = []

    lines.forEach(line => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return

      if (trimmedLine.startsWith('# ')) {
        sections.push({ type: 'title', content: trimmedLine.substring(2) })
      } else if (trimmedLine.startsWith('## ')) {
        sections.push({ type: 'heading1', content: trimmedLine.substring(3) })
      } else if (trimmedLine.startsWith('### ')) {
        sections.push({ type: 'heading2', content: trimmedLine.substring(4) })
      } else if (trimmedLine.startsWith('#### ')) {
        sections.push({ type: 'heading3', content: trimmedLine.substring(5) })
      } else if (trimmedLine.startsWith('- ')) {
        sections.push({ type: 'list', content: trimmedLine.substring(2) })
      } else if (trimmedLine.startsWith('*')) {
        sections.push({ type: 'paragraph', content: trimmedLine })
      } else {
        sections.push({ type: 'paragraph', content: trimmedLine })
      }
    })

    return sections
  }

  const sections = parseMarkdownContent(content)

  return (
    <Card className="bg-white shadow-lg border-0 overflow-hidden">
      {/* Word文档样式的内容区域 */}
      <div 
        className="word-document-style"
        style={{
          fontFamily: '"Source Han Sans SC", "Microsoft YaHei", sans-serif',
          lineHeight: 1.5,
          color: '#000000',
          padding: '2.54cm 3.17cm',
          minHeight: '29.7cm', // A4高度
          maxWidth: '21cm', // A4宽度
          margin: '0 auto',
          backgroundColor: 'white'
        }}
      >
        {sections.map((section, index) => {
          switch (section.type) {
            case 'title':
              return (
                <h1
                  key={index}
                  style={{
                    fontFamily: '"Source Han Serif SC", "Microsoft YaHei", serif',
                    fontSize: '18pt',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: '12pt',
                    marginBottom: '6pt',
                    color: '#000000'
                  }}
                >
                  {section.content}
                </h1>
              )
            case 'heading1':
              return (
                <h2
                  key={index}
                  style={{
                    fontFamily: '"Source Han Serif SC", "Microsoft YaHei", serif',
                    fontSize: '16pt',
                    fontWeight: 'bold',
                    marginTop: '12pt',
                    marginBottom: '6pt',
                    color: '#000000'
                  }}
                >
                  {section.content}
                </h2>
              )
            case 'heading2':
              return (
                <h3
                  key={index}
                  style={{
                    fontFamily: '"Source Han Serif SC", "Microsoft YaHei", serif',
                    fontSize: '14pt',
                    fontWeight: 'bold',
                    marginTop: '6pt',
                    marginBottom: '4pt',
                    color: '#000000'
                  }}
                >
                  {section.content}
                </h3>
              )
            case 'heading3':
              return (
                <h4
                  key={index}
                  style={{
                    fontFamily: '"Source Han Sans SC", "Microsoft YaHei", sans-serif',
                    fontSize: '12pt',
                    fontWeight: 'bold',
                    marginTop: '3pt',
                    marginBottom: '3pt',
                    color: '#000000'
                  }}
                >
                  {section.content}
                </h4>
              )
            case 'list':
              return (
                <div
                  key={index}
                  style={{
                    fontFamily: '"Source Han Sans SC", "Microsoft YaHei", sans-serif',
                    fontSize: '11pt',
                    marginBottom: '6pt',
                    paddingLeft: '0.74cm',
                    color: '#000000'
                  }}
                >
                  • {section.content}
                </div>
              )
            case 'paragraph':
              return (
                <p
                  key={index}
                  style={{
                    fontFamily: '"Source Han Sans SC", "Microsoft YaHei", sans-serif',
                    fontSize: '11pt',
                    marginBottom: '6pt',
                    textIndent: section.content.startsWith('*') ? '0' : '0.74cm',
                    color: '#000000',
                    fontStyle: section.content.startsWith('*') ? 'italic' : 'normal',
                    textAlign: section.content.startsWith('*') ? 'center' : 'left'
                  }}
                >
                  {section.content.startsWith('*') ? section.content.substring(1) : section.content}
                </p>
              )
            default:
              return null
          }
        })}
      </div>
    </Card>
  )
}