# 工作区2: API集成和内容生成

## 🎯 工作区职责
负责API服务和内容生成，从原项目的 `/api/generate` 重构而来，专注于内容生成逻辑的优化和服务化。

## 🔄 与原项目的关系
- **原功能**: `/api/generate` 的内容生成逻辑
- **格式变更**: 从返回HTML改为返回Markdown格式
- **新增功能**: 缓存机制、错误处理、健康检查、Banner生成
- **架构变更**: 从嵌入式API改为独立的微服务

## 🚀 快速开始
```bash
# 安装依赖
npm install

# 启动开发服务器 (端口3002)
npm run dev

# 访问地址
http://localhost:3002
```

## 📋 主要功能
- ✅ **内容生成**: AI驱动的店铺IP方案生成（支持真实AI API和模拟模式）
- ✅ **模板系统**: 支持多种内容模板（餐饮、零售、服务、通用）
- ✅ **缓存机制**: 相同输入快速返回缓存结果
- ✅ **错误处理**: 完善的错误处理和重试机制
- ✅ **健康检查**: 服务状态监控，包含各服务健康状态
- ✅ **Banner生成**: 自动生成相关图片（支持真实AI图片生成和模拟模式）
- ✅ **Markdown输出**: 标准化Markdown格式输出

## 🔗 API接口

### POST /api/generate-content
接收表单数据，生成Markdown格式的内容和Banner图片
```json
// 请求
{
  "storeName": "店铺名称",
  "storeCategory": "店铺类别",
  "storeLocation": "店铺位置",
  "businessDuration": "经营时长",
  "storeFeatures": "店铺特色",
  "ownerName": "店主姓名",
  "ownerFeatures": "店主特色"
}

// 响应
{
  "success": true,
  "content": "# 店铺IP方案\n\n## 概况\n...",
  "bannerUrl": "https://example.com/banner.jpg",
  "metadata": {
    "wordCount": 1200,
    "generatedAt": "2024-01-01T12:00:00.000Z",
    "template": "restaurant-template",
    "qualityScore": 85
  }
}
```

### POST /api/generate-banner
单独生成Banner图片
```json
// 请求（同上）
// 响应
{
  "success": true,
  "banner": {
    "imageUrl": "https://example.com/banner.jpg",
    "prompt": "Create a professional banner...",
    "template": "ai-generated",
    "generatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### GET /api/health
服务健康检查
```json
{
  "status": "healthy",
  "workspace": "workspace-2-api-content",
  "services": {
    "contentGeneration": "active",
    "bannerGeneration": "active",
    "cache": "active",
    "ai": "active"
  },
  "details": {
    "aiMode": "real", // 或 "mock"
    "bannerMode": "real" // 或 "mock"
  }
}
```

## 🔗 与其他工作区的集成
- **接收工作区1**: 接收来自工作区1的表单数据
- **服务工作区3**: 提供Markdown内容给工作区3进行渲染

## 📁 项目结构
```
workspace-2-api-content/
├── app/api/               # API路由
├── services/              # 业务服务
├── lib/                   # 核心库
├── templates/             # 内容模板
├── middleware/            # 中间件
└── types/                 # 类型定义
```

## 🛠️ 技术栈
- **框架**: Next.js 14 API Routes
- **语言**: TypeScript
- **AI集成**: OpenAI API (可配置)
- **缓存**: Node Cache
- **内容处理**: remark + 自定义Markdown生成器

## 🤖 AI服务配置
```env
# 环境变量配置
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-3.5-turbo
```

## 📚 开发指南
1. 查看 `/.kiro/specs/workspace-2-api-content/requirements.md` 了解详细需求
2. 参考原项目的 `app/api/generate/` 了解原有逻辑
3. 确保返回的Markdown格式符合工作区3的解析要求
4. 实现完善的错误处理和缓存机制

## 🧪 测试
```bash
# 运行完整API测试
./test-api.sh

# 手动测试API接口
curl -X POST http://localhost:3002/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "星光咖啡",
    "storeCategory": "餐饮",
    "storeLocation": "上海徐汇区",
    "businessDuration": "3年",
    "storeFeatures": "精品咖啡，手工烘焙，温馨环境",
    "ownerName": "李明",
    "ownerFeatures": "资深咖啡师，热爱咖啡文化，注重品质"
  }'

# 健康检查
curl http://localhost:3002/api/health

# Banner生成测试
curl -X POST http://localhost:3002/api/generate-banner \
  -H "Content-Type: application/json" \
  -d '{"storeName":"星光咖啡","storeCategory":"餐饮",...}'
```

---
**这是多工作区协作开发架构的API服务工作区，负责核心的内容生成逻辑。**