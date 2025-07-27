export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          内容生成服务
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          工作区2 - 负责接收表单数据并生成Markdown格式的店铺IP方案内容
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">API端点</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-mono text-sm">POST /api/generate-content</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">生成内容</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-mono text-sm">GET /api/health</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">健康检查</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">服务状态</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>内容生成服务</span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                运行中
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>缓存服务</span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                运行中
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>AI服务</span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                模拟模式
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">使用说明</h2>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-4">
            本服务接收来自工作区1的表单数据，通过AI生成店铺IP方案内容，并返回Markdown格式的结果。
          </p>
          
          <h3 className="text-lg font-medium mb-2">请求格式</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`{
  "storeName": "店铺名称",
  "storeCategory": "店铺类别",
  "storeLocation": "店铺位置",
  "businessDuration": "经营时长",
  "storeFeatures": "店铺特色",
  "ownerName": "店主姓名",
  "ownerFeatures": "店主特色"
}`}
          </pre>

          <h3 className="text-lg font-medium mb-2 mt-4">响应格式</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`{
  "success": true,
  "content": "# 店铺IP方案\\n\\n## 店铺概况\\n...",
  "metadata": {
    "wordCount": 1200,
    "generatedAt": "2024-01-01T12:00:00.000Z",
    "template": "restaurant-template",
    "qualityScore": 85
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}