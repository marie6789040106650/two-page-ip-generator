'use client'

import { useState } from 'react'
import { ExportManager } from '@/components/exporters/export-manager'

export default function HomePage() {
  const [htmlContent, setHtmlContent] = useState(`
    <h1>店铺IP方案示例</h1>
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
      <tr>
        <td>运营阶段</td>
        <td>持续</td>
        <td>日常运营、优化改进</td>
      </tr>
    </table>
    
    <blockquote>
      "成功的店铺IP不仅仅是一个商业项目，更是一个品牌文化的载体。"
    </blockquote>
    
    <hr>
    
    <p><strong>注意事项：</strong>本方案需要根据实际情况进行调整和优化。</p>
  `)

  const [watermarkConfig, setWatermarkConfig] = useState({
    enabled: true,
    text: '店铺IP生成器',
    opacity: 0.1,
    fontSize: 16,
    color: '#cccccc',
    rotation: -45,
    repeat: true
  })

  const [filename, setFilename] = useState('店铺IP方案')

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            工作区4: HTML导出和文档生成
          </h1>
          <p className="text-gray-600">
            将HTML内容导出为Word和PDF格式，支持水印保持和批量导出
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：HTML内容编辑 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">HTML内容</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                文件名
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入文件名"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTML内容
              </label>
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="请输入HTML内容..."
              />
            </div>

            {/* 水印配置 */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">水印配置</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={watermarkConfig.enabled}
                      onChange={(e) => setWatermarkConfig(prev => ({
                        ...prev,
                        enabled: e.target.checked
                      }))}
                      className="mr-2"
                    />
                    启用水印
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">水印文本</label>
                  <input
                    type="text"
                    value={watermarkConfig.text}
                    onChange={(e) => setWatermarkConfig(prev => ({
                      ...prev,
                      text: e.target.value
                    }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    disabled={!watermarkConfig.enabled}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    透明度 ({Math.round(watermarkConfig.opacity * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={watermarkConfig.opacity}
                    onChange={(e) => setWatermarkConfig(prev => ({
                      ...prev,
                      opacity: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                    disabled={!watermarkConfig.enabled}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    旋转角度 ({watermarkConfig.rotation}°)
                  </label>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    step="15"
                    value={watermarkConfig.rotation}
                    onChange={(e) => setWatermarkConfig(prev => ({
                      ...prev,
                      rotation: parseInt(e.target.value)
                    }))}
                    className="w-full"
                    disabled={!watermarkConfig.enabled}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：预览和导出 */}
          <div className="space-y-6">
            {/* HTML预览 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">内容预览</h2>
              <div 
                className="border rounded-md p-4 bg-gray-50 max-h-64 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                style={{
                  position: 'relative',
                  backgroundImage: watermarkConfig.enabled 
                    ? `repeating-linear-gradient(
                        ${watermarkConfig.rotation}deg,
                        transparent,
                        transparent 100px,
                        rgba(204, 204, 204, ${watermarkConfig.opacity}) 100px,
                        rgba(204, 204, 204, ${watermarkConfig.opacity}) 120px
                      )`
                    : 'none'
                }}
              />
              {watermarkConfig.enabled && (
                <div className="mt-2 text-xs text-gray-500">
                  💧 预览中的水印效果将在导出文档中保持一致
                </div>
              )}
            </div>

            {/* 导出管理器 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">导出文档</h2>
              <ExportManager
                htmlContent={htmlContent}
                watermarkConfig={watermarkConfig}
                filename={filename}
              />
            </div>

            {/* API信息 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">API接口</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="font-mono">POST /api/export-word</span>
                  <a 
                    href="/api/export-word" 
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    测试
                  </a>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span className="font-mono">POST /api/export-pdf</span>
                  <a 
                    href="/api/export-pdf" 
                    target="_blank"
                    className="text-red-600 hover:underline"
                  >
                    测试
                  </a>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="font-mono">GET /api/health</span>
                  <a 
                    href="/api/health" 
                    target="_blank"
                    className="text-green-600 hover:underline"
                  >
                    检查
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部说明 */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">🎯 工作区4特色功能</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>✅ <strong>前端导出</strong>: 使用docx.js和jsPDF在浏览器中完成文档转换</li>
            <li>✅ <strong>水印保持</strong>: 确保导出文档中的水印效果与预览完全一致</li>
            <li>✅ <strong>批量导出</strong>: 支持同时导出Word和PDF格式，自动打包下载</li>
            <li>✅ <strong>进度显示</strong>: 实时显示导出进度，提供良好的用户体验</li>
            <li>✅ <strong>错误处理</strong>: 完善的错误处理和用户反馈机制</li>
          </ul>
        </div>
      </div>
    </main>
  )
}