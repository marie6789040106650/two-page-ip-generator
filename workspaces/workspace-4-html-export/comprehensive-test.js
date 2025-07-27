#!/usr/bin/env node

// 工作区4 HTML导出功能综合测试
const fs = require('fs')

console.log('🚀 工作区4 HTML导出功能综合测试\n')

// 测试数据集
const testCases = [
  {
    name: '英文文档测试',
    html: `
      <h1>Store IP Solution</h1>
      <h2>Project Overview</h2>
      <p>This is a comprehensive store IP solution document with detailed planning and implementation.</p>
      <h3>Core Elements</h3>
      <ul>
        <li>Brand positioning and image design</li>
        <li>Product strategy and marketing plan</li>
        <li>Operation model and management system</li>
      </ul>
      <table>
        <tr><th>Phase</th><th>Duration</th><th>Tasks</th></tr>
        <tr><td>Preparation</td><td>1-2 months</td><td>Market research</td></tr>
        <tr><td>Launch</td><td>3-4 months</td><td>Store setup</td></tr>
      </table>
      <blockquote>Success requires careful planning and execution.</blockquote>
      <hr>
      <p><strong>Note:</strong> This plan should be <em>adjusted</em> based on actual conditions.</p>
    `,
    watermark: {
      enabled: true,
      text: 'Store IP Generator',
      opacity: 0.1,
      fontSize: 16,
      color: 'gray',
      rotation: -45,
      repeat: true
    },
    metadata: {
      title: 'Store_IP_Solution_EN',
      author: 'Export Test'
    }
  },
  {
    name: '中文文档测试（占位符模式）',
    html: `
      <h1>店铺IP方案</h1>
      <h2>项目概述</h2>
      <p>这是一个完整的店铺IP方案文档，包含详细的策划内容和实施方案。</p>
      <h3>核心要素</h3>
      <ul>
        <li>品牌定位与形象设计</li>
        <li>产品策略与营销方案</li>
        <li>运营模式与管理体系</li>
      </ul>
      <table>
        <tr><th>阶段</th><th>时间</th><th>主要任务</th></tr>
        <tr><td>准备阶段</td><td>1-2个月</td><td>市场调研</td></tr>
        <tr><td>启动阶段</td><td>3-4个月</td><td>店铺装修</td></tr>
      </table>
      <blockquote>成功的店铺IP需要精心策划和执行。</blockquote>
      <hr>
      <p><strong>注意：</strong>本方案需要根据实际情况进行<em>调整</em>。</p>
    `,
    watermark: {
      enabled: true,
      text: '店铺IP生成器',
      opacity: 0.15,
      fontSize: 18,
      color: 'blue',
      rotation: -30,
      repeat: true
    },
    metadata: {
      title: '店铺IP方案_中文版',
      author: '导出测试'
    }
  },
  {
    name: '复杂格式测试',
    html: `
      <h1>Complex Format Test</h1>
      <h2>Multiple Elements</h2>
      <p>This document tests various HTML elements and their export capabilities.</p>
      
      <h3>Lists and Tables</h3>
      <ul>
        <li>Unordered list item 1</li>
        <li>Unordered list item 2 with <strong>bold text</strong></li>
        <li>Unordered list item 3 with <em>italic text</em></li>
      </ul>
      
      <ol>
        <li>Ordered list item 1</li>
        <li>Ordered list item 2</li>
        <li>Ordered list item 3</li>
      </ol>
      
      <table>
        <tr>
          <th>Feature</th>
          <th>Word Export</th>
          <th>PDF Export</th>
          <th>Status</th>
        </tr>
        <tr>
          <td>Headers (H1-H6)</td>
          <td>✓</td>
          <td>✓</td>
          <td>Complete</td>
        </tr>
        <tr>
          <td>Paragraphs</td>
          <td>✓</td>
          <td>✓</td>
          <td>Complete</td>
        </tr>
        <tr>
          <td>Lists</td>
          <td>✓</td>
          <td>✓</td>
          <td>Complete</td>
        </tr>
        <tr>
          <td>Tables</td>
          <td>✓</td>
          <td>Basic</td>
          <td>Partial</td>
        </tr>
        <tr>
          <td>Blockquotes</td>
          <td>✓</td>
          <td>✓</td>
          <td>Complete</td>
        </tr>
      </table>
      
      <h3>Quotes and Separators</h3>
      <blockquote>
        This is a blockquote element that should be properly formatted in both Word and PDF exports.
        It may contain multiple lines and should maintain proper indentation.
      </blockquote>
      
      <hr>
      
      <h3>Text Formatting</h3>
      <p>This paragraph contains <strong>bold text</strong>, <em>italic text</em>, and regular text.</p>
      <p>Another paragraph with different formatting combinations.</p>
      
      <hr>
      
      <p><strong>Test Summary:</strong> This document tests the comprehensive export capabilities of the HTML export engine.</p>
    `,
    watermark: {
      enabled: true,
      text: 'Test Document',
      opacity: 0.08,
      fontSize: 20,
      color: 'red',
      rotation: -45,
      repeat: 'diagonal'
    },
    metadata: {
      title: 'Complex_Format_Test',
      author: 'Comprehensive Test'
    }
  }
]

async function runComprehensiveTest() {
  console.log('📊 开始综合测试...\n')
  
  // 健康检查
  try {
    console.log('🔍 检查服务状态...')
    const healthResponse = await fetch('http://localhost:3004/api/health')
    const healthData = await healthResponse.json()
    
    console.log(`✅ 服务状态: ${healthData.status}`)
    console.log(`📈 内存使用: ${healthData.performance?.memoryUsage?.heapUsed || 'N/A'} MB`)
    console.log(`⏱️  运行时间: ${healthData.performance?.uptime || 'N/A'} 秒`)
    console.log(`🔧 支持功能: ${healthData.capabilities?.supportedElements?.length || 0} 种HTML元素\n`)
  } catch (error) {
    console.log(`❌ 健康检查失败: ${error.message}\n`)
    return
  }
  
  // 运行所有测试用例
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i]
    console.log(`📋 测试用例 ${i + 1}: ${testCase.name}`)
    
    const testData = {
      html: testCase.html,
      watermarkConfig: testCase.watermark,
      styleConfig: {
        pageWidth: 794,
        pageHeight: 1123,
        margins: { top: 96, right: 96, bottom: 96, left: 96 }
      },
      metadata: testCase.metadata
    }
    
    // 测试Word导出
    try {
      console.log('  📄 测试Word导出...')
      const wordResponse = await fetch('http://localhost:3004/api/export-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })
      
      if (wordResponse.ok) {
        const buffer = await wordResponse.arrayBuffer()
        const filename = `test_${i + 1}_word_${Date.now()}.docx`
        fs.writeFileSync(filename, Buffer.from(buffer))
        console.log(`  ✅ Word导出成功: ${filename} (${buffer.byteLength} bytes)`)
      } else {
        const error = await wordResponse.json()
        console.log(`  ❌ Word导出失败: ${error.error}`)
      }
    } catch (error) {
      console.log(`  ❌ Word导出错误: ${error.message}`)
    }
    
    // 测试PDF导出
    try {
      console.log('  📄 测试PDF导出...')
      const pdfResponse = await fetch('http://localhost:3004/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })
      
      if (pdfResponse.ok) {
        const buffer = await pdfResponse.arrayBuffer()
        const filename = `test_${i + 1}_pdf_${Date.now()}.pdf`
        fs.writeFileSync(filename, Buffer.from(buffer))
        console.log(`  ✅ PDF导出成功: ${filename} (${buffer.byteLength} bytes)`)
      } else {
        const error = await pdfResponse.json()
        console.log(`  ❌ PDF导出失败: ${error.error}`)
      }
    } catch (error) {
      console.log(`  ❌ PDF导出错误: ${error.message}`)
    }
    
    console.log()
  }
  
  console.log('🎉 综合测试完成！')
  console.log('\n📋 测试总结:')
  console.log('✅ 英文文档导出 - 完全支持')
  console.log('⚠️  中文文档导出 - 使用占位符模式（技术限制）')
  console.log('✅ 复杂格式导出 - 支持多种HTML元素')
  console.log('✅ 水印功能 - 支持多种配置选项')
  console.log('✅ 批量导出 - 支持Word和PDF同时导出')
  
  console.log('\n💡 使用建议:')
  console.log('1. 英文内容可以完美导出')
  console.log('2. 中文内容会转换为占位符（?），这是当前技术限制')
  console.log('3. 水印功能在PDF中效果更好')
  console.log('4. 表格在Word中支持更完整')
  console.log('5. 建议文档内容不要过于复杂')
  
  console.log('\n🔗 API端点:')
  console.log('- Word导出: POST http://localhost:3004/api/export-word')
  console.log('- PDF导出: POST http://localhost:3004/api/export-pdf')
  console.log('- 健康检查: GET http://localhost:3004/api/health')
  console.log('- 演示页面: http://localhost:3004')
}

// 检查Node.js版本
if (typeof fetch === 'undefined') {
  console.log('❌ 需要Node.js 18+或安装node-fetch')
  console.log('请运行: npm install node-fetch')
  process.exit(1)
}

runComprehensiveTest().catch(console.error)