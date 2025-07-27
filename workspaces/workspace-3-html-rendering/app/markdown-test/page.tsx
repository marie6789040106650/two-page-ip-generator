'use client'

import React, { useState } from 'react'
import { MarkdownRenderer } from '@/components/renderers/markdown-renderer'
import { WordStyleRenderer, defaultWordStyleConfig } from '@/components/renderers/word-style-renderer'
import { WatermarkSettingsButton, WatermarkConfigManager } from '@/components/watermark/watermark-overlay'
import { predefinedThemes } from '@/lib/theme-manager'
import { MarkdownContent, RenderOptions } from '@/types/renderer-types'

export default function MarkdownTestPage() {
  const [renderOptions, setRenderOptions] = useState<RenderOptions>({
    theme: predefinedThemes[0],
    watermarkConfig: WatermarkConfigManager.getDefaultConfig('Markdown测试'),
    styleConfig: defaultWordStyleConfig
  })

  // 完整的Markdown测试内容
  const testContent: MarkdownContent = {
    content: `# Markdown完整语法测试

## 标题测试

### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

## 文本格式

这是一个普通段落，包含**粗体文本**、*斜体文本*、~~删除线文本~~和\`行内代码\`。

你也可以使用__粗体__和_斜体_的替代语法。

## 列表

### 无序列表
- 第一项
- 第二项
  - 嵌套项目1
  - 嵌套项目2
    - 深层嵌套
- 第三项

### 有序列表
1. 第一步
2. 第二步
   1. 子步骤A
   2. 子步骤B
3. 第三步

### 任务列表
- [x] 已完成的任务
- [ ] 未完成的任务
- [x] 另一个已完成的任务

## 链接和图片

这是一个[链接示例](https://example.com)。

这是一个带标题的链接：[Google](https://google.com "Google搜索")

自动链接：https://github.com

## 引用

> 这是一个引用块。
> 
> 引用可以包含多个段落。
> 
> > 这是嵌套引用。

## 代码

### 行内代码
使用 \`console.log('Hello World')\` 来输出信息。

### 代码块

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 输出: 55
\`\`\`

\`\`\`python
def hello_world():
    print("Hello, World!")
    
if __name__ == "__main__":
    hello_world()
\`\`\`

\`\`\`json
{
  "name": "工作区3",
  "version": "1.0.0",
  "description": "HTML渲染和样式系统"
}
\`\`\`

## 表格

| 功能 | 状态 | 优先级 | 备注 |
|------|------|--------|------|
| 标题渲染 | ✅ 完成 | 高 | 支持6级标题 |
| 列表渲染 | ✅ 完成 | 高 | 支持嵌套列表 |
| 表格渲染 | ✅ 完成 | 中 | 支持对齐 |
| 代码高亮 | ✅ 完成 | 中 | 多语言支持 |
| 数学公式 | ✅ 完成 | 低 | KaTeX渲染 |

### 表格对齐

| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:--------:|-------:|
| 内容1  |   内容2   |  内容3 |
| 长内容示例 | 居中内容 | 右侧内容 |

## 分割线

---

上面是一条分割线。

***

这是另一种分割线。

## 数学公式

### 行内公式
这是一个行内公式：$E = mc^2$

### 块级公式

$$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

$$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
$$

## 特殊字符和转义

使用反斜杠转义特殊字符：\\* \\_ \\# \\[ \\]

## HTML标签

你可以使用一些HTML标签：

<kbd>Ctrl</kbd> + <kbd>C</kbd> 复制

<mark>高亮文本</mark>

上标：H<sup>2</sup>O  
下标：CO<sub>2</sub>

## 脚注

这是一个带脚注的文本[^1]。

这是另一个脚注[^note]。

[^1]: 这是第一个脚注的内容。
[^note]: 这是命名脚注的内容。

## 定义列表

术语1
: 这是术语1的定义

术语2
: 这是术语2的定义
: 术语2还有另一个定义

## 缩写

*[HTML]: HyperText Markup Language
*[CSS]: Cascading Style Sheets

HTML和CSS是网页开发的基础技术。

## Emoji支持

支持emoji表情：😀 😃 😄 😁 😆 😅 😂 🤣

## 特殊格式

~~删除线文本~~

==高亮文本==（如果支持）

## 换行测试

这是第一行  
这是第二行（使用两个空格换行）

这是新段落。

---

*本测试文档展示了Markdown的完整语法支持*`,
    metadata: {
      title: 'Markdown完整语法测试',
      wordCount: 1200,
      sections: ['标题测试', '文本格式', '列表', '链接和图片', '引用', '代码', '表格', '数学公式'],
      generatedAt: new Date().toISOString(),
      template: 'markdown-test'
    }
  }

  const handleWatermarkChange = (watermarkConfig: any) => {
    setRenderOptions(prev => ({ ...prev, watermarkConfig }))
  }

  const handleThemeChange = (themeId: string) => {
    const theme = predefinedThemes.find(t => t.id === themeId)
    if (theme) {
      setRenderOptions(prev => ({ ...prev, theme }))
    }
  }

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            📝 Markdown完整语法测试
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
              ✅ 全语法支持
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">主题选择</label>
            <select
              value={renderOptions.theme.id}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {predefinedThemes.map(theme => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">文档信息</label>
            <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm">
              {testContent.metadata.wordCount} 字 | {testContent.metadata.sections.length} 章节
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">水印设置</label>
            <WatermarkSettingsButton
              storeName="Markdown测试"
              onConfigChange={handleWatermarkChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">支持特性</label>
            <div className="text-xs space-y-1">
              <div className="text-green-600">✅ GitHub风格Markdown</div>
              <div className="text-green-600">✅ 数学公式 (KaTeX)</div>
              <div className="text-green-600">✅ 代码高亮</div>
              <div className="text-green-600">✅ 任务列表</div>
            </div>
          </div>
        </div>
      </div>

      {/* 支持的语法列表 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          🎯 支持的Markdown语法
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">基础语法</h4>
            <ul className="space-y-1 text-gray-600">
              <li>✅ 标题 (H1-H6)</li>
              <li>✅ 段落和换行</li>
              <li>✅ 粗体和斜体</li>
              <li>✅ 删除线</li>
              <li>✅ 行内代码</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">列表和链接</h4>
            <ul className="space-y-1 text-gray-600">
              <li>✅ 有序列表</li>
              <li>✅ 无序列表</li>
              <li>✅ 嵌套列表</li>
              <li>✅ 任务列表</li>
              <li>✅ 链接和图片</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">高级功能</h4>
            <ul className="space-y-1 text-gray-600">
              <li>✅ 表格</li>
              <li>✅ 代码块</li>
              <li>✅ 引用块</li>
              <li>✅ 分割线</li>
              <li>✅ HTML标签</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">扩展功能</h4>
            <ul className="space-y-1 text-gray-600">
              <li>✅ 数学公式</li>
              <li>✅ 代码高亮</li>
              <li>✅ 脚注</li>
              <li>✅ 上标下标</li>
              <li>✅ 键盘按键</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 渲染预览 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            📄 完整语法渲染预览
          </h2>
          <div className="text-sm text-gray-500">
            主题: {renderOptions.theme.name} | 水印: {renderOptions.watermarkConfig.enabled ? '启用' : '禁用'}
          </div>
        </div>
        
        <WordStyleRenderer
          styleConfig={renderOptions.styleConfig}
          watermarkConfig={renderOptions.watermarkConfig}
        >
          <MarkdownRenderer
            content={testContent}
            options={renderOptions}
          />
        </WordStyleRenderer>
      </div>
    </div>
  )
}