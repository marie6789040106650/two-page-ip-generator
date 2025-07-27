#!/usr/bin/env node

// 测试中文导出功能的脚本
const fs = require('fs')

const testHTML = `
<h1>店铺IP方案</h1>
<h2>项目概述</h2>
<p>这是一个完整的店铺IP方案文档，包含了详细的策划内容和实施方案。</p>

<h3>核心要素</h3>
<ul>
  <li>品牌定位与形象设计</li>
  <li>产品策略与营销方案</li>
  <li>运营模式与管理体系</li>
  <li>财务预算与投资回报</li>
</ul>

<h3>实施计划</h3>
<table>
  <tr>
    <th>阶段</th>
    <th>时间</th>
    <th>主要任务</th>
  </tr>
  <tr>
    <td>准备阶段</td>
    <td>1-2个月</td>
    <td>市场调研、品牌设计</td>
  </tr>
  <tr>
    <td>启动阶段</td>
    <td>3-4个月</td>
    <td>店铺装修、人员招聘</td>
  </tr>
</table>

<blockquote>
成功的店铺IP不仅仅是一个商业项目，更是一个品牌文化的载体。
</blockquote>

<hr>

<p><strong>注意事项：</strong>本方案需要根据实际情况进行<em>调整和优化</em>。</p>
`

const watermarkConfig = {
  enabled: true,
  text: '店铺IP生成器',
  opacity: 0.1,
  fontSize: 16,
  color: 'gray',
  rotation: -45,
  repeat: true
}

const testData = {
  html: testHTML,
  watermarkConfig,
  styleConfig: {
    pageWidth: 794,
    pageHeight: 1123,
    margins: {
      top: 96,
      right: 96,
      bottom: 96,
      left: 96
    }
  },
  metadata: {
    title: '店铺IP方案',
    author: '导出测试',
    wordCount: testHTML.replace(/<[^>]*>/g, '').length
  }
}

async function testChineseExport() {
  console.log('🇨🇳 测试中文导出功能...\n')
  
  try {
    // 测试Word导出
    console.log('📄 测试Word导出...')
    const wordResponse = await fetch('http://localhost:3004/api/export-word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    if (wordResponse.ok) {
      const buffer = await wordResponse.arrayBuffer()
      const filename = `chinese-word-export-${Date.now()}.docx`
      fs.writeFileSync(filename, Buffer.from(buffer))
      console.log(`✅ 中文Word导出成功: ${filename} (${buffer.byteLength} bytes)`)
    } else {
      const error = await wordResponse.json()
      console.log(`❌ 中文Word导出失败: ${error.error}`)
    }

    console.log()

    // 测试PDF导出
    console.log('📄 测试PDF导出...')
    const pdfResponse = await fetch('http://localhost:3004/api/export-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    if (pdfResponse.ok) {
      const buffer = await pdfResponse.arrayBuffer()
      const filename = `chinese-pdf-export-${Date.now()}.pdf`
      fs.writeFileSync(filename, Buffer.from(buffer))
      console.log(`✅ 中文PDF导出成功: ${filename} (${buffer.byteLength} bytes)`)
    } else {
      const error = await pdfResponse.json()
      console.log(`❌ 中文PDF导出失败: ${error.error}`)
    }

  } catch (error) {
    console.log(`❌ 测试失败: ${error.message}`)
  }
  
  console.log('\n✨ 中文导出测试完成！')
}

// 检查是否有Node.js fetch支持
if (typeof fetch === 'undefined') {
  console.log('❌ 需要Node.js 18+或安装node-fetch')
  process.exit(1)
}

testChineseExport().catch(console.error)