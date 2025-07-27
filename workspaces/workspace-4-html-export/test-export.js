#!/usr/bin/env node

// 测试导出功能的脚本
const fs = require('fs')
const path = require('path')

const testHTML = `
<h1>Test Document</h1>
<h2>Project Overview</h2>
<p>This is a test document for HTML export functionality.</p>

<h3>Feature List</h3>
<ul>
  <li>Word export feature</li>
  <li>PDF export feature</li>
  <li>Watermark processing</li>
  <li>Batch export</li>
</ul>

<h3>Test Table</h3>
<table>
  <tr>
    <th>Feature</th>
    <th>Status</th>
    <th>Notes</th>
  </tr>
  <tr>
    <td>Word Export</td>
    <td>OK</td>
    <td>Supports basic HTML elements</td>
  </tr>
  <tr>
    <td>PDF Export</td>
    <td>OK</td>
    <td>Supports watermark and styles</td>
  </tr>
</table>

<blockquote>
This is a quote block for testing quote style export.
</blockquote>

<hr>

<p><strong>Note:</strong> This is a <em>test document</em> for verifying export functionality.</p>
`

const watermarkConfig = {
  enabled: true,
  text: 'Test Watermark',
  opacity: 0.1,
  fontSize: 16,
  color: '#cccccc',
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
    title: 'Test Document',
    author: 'Export Test',
    wordCount: testHTML.replace(/<[^>]*>/g, '').length
  }
}

async function testWordExport() {
  console.log('🔵 测试Word导出...')
  
  try {
    const response = await fetch('http://localhost:3004/api/export-word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    if (response.ok) {
      const buffer = await response.arrayBuffer()
      const filename = `test-word-export-${Date.now()}.docx`
      fs.writeFileSync(filename, Buffer.from(buffer))
      console.log(`✅ Word导出成功: ${filename} (${buffer.byteLength} bytes)`)
    } else {
      const error = await response.json()
      console.log(`❌ Word导出失败: ${error.error}`)
    }
  } catch (error) {
    console.log(`❌ Word导出错误: ${error.message}`)
  }
}

async function testPDFExport() {
  console.log('🔴 测试PDF导出...')
  
  try {
    const response = await fetch('http://localhost:3004/api/export-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    if (response.ok) {
      const buffer = await response.arrayBuffer()
      const filename = `test-pdf-export-${Date.now()}.pdf`
      fs.writeFileSync(filename, Buffer.from(buffer))
      console.log(`✅ PDF导出成功: ${filename} (${buffer.byteLength} bytes)`)
    } else {
      const error = await response.json()
      console.log(`❌ PDF导出失败: ${error.error}`)
    }
  } catch (error) {
    console.log(`❌ PDF导出错误: ${error.message}`)
  }
}

async function testHealthCheck() {
  console.log('🟢 测试健康检查...')
  
  try {
    const response = await fetch('http://localhost:3004/api/health')
    const data = await response.json()
    
    console.log(`✅ 服务状态: ${data.status}`)
    console.log(`📊 内存使用: ${data.performance?.memoryUsage?.heapUsed || 'N/A'} MB`)
    console.log(`⏱️  运行时间: ${data.performance?.uptime || 'N/A'} 秒`)
  } catch (error) {
    console.log(`❌ 健康检查失败: ${error.message}`)
  }
}

async function runTests() {
  console.log('🚀 开始测试工作区4导出功能...\n')
  
  await testHealthCheck()
  console.log()
  
  await testWordExport()
  console.log()
  
  await testPDFExport()
  console.log()
  
  console.log('✨ 测试完成！')
  console.log('\n💡 使用说明:')
  console.log('1. 确保服务运行在 http://localhost:3004')
  console.log('2. 运行 npm run dev 启动开发服务器')
  console.log('3. 检查生成的测试文件')
}

// 检查是否有Node.js fetch支持
if (typeof fetch === 'undefined') {
  console.log('❌ 需要Node.js 18+或安装node-fetch')
  console.log('请运行: npm install node-fetch')
  process.exit(1)
}

runTests().catch(console.error)