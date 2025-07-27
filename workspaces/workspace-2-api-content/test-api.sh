#!/bin/bash

echo "🚀 启动工作区2 API服务测试"
echo "================================"

# 启动服务
echo "📡 启动服务..."
npm run dev &
SERVER_PID=$!
sleep 5

echo ""
echo "🔍 测试1: 健康检查"
echo "--------------------------------"
curl -s http://localhost:3002/api/health | jq .

echo ""
echo "🔍 测试2: 内容生成API"
echo "--------------------------------"
curl -s -X POST http://localhost:3002/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "星光咖啡",
    "storeCategory": "餐饮",
    "storeLocation": "上海徐汇区",
    "businessDuration": "3年",
    "storeFeatures": "精品咖啡，手工烘焙，温馨环境",
    "ownerName": "李明",
    "ownerFeatures": "资深咖啡师，热爱咖啡文化，注重品质"
  }' | jq .

echo ""
echo "🔍 测试3: Banner生成API"
echo "--------------------------------"
curl -s -X POST http://localhost:3002/api/generate-banner \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "星光咖啡",
    "storeCategory": "餐饮",
    "storeLocation": "上海徐汇区",
    "storeFeatures": "精品咖啡，手工烘焙",
    "ownerName": "李明",
    "ownerFeatures": "资深咖啡师"
  }' | jq .

echo ""
echo "🔍 测试4: 缓存功能（重复请求）"
echo "--------------------------------"
echo "第二次请求同样数据，应该从缓存返回..."
curl -s -X POST http://localhost:3002/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "星光咖啡",
    "storeCategory": "餐饮",
    "storeLocation": "上海徐汇区",
    "businessDuration": "3年",
    "storeFeatures": "精品咖啡，手工烘焙，温馨环境",
    "ownerName": "李明",
    "ownerFeatures": "资深咖啡师，热爱咖啡文化，注重品质"
  }' | jq .

echo ""
echo "🔍 测试5: 错误处理（缺少必填字段）"
echo "--------------------------------"
curl -s -X POST http://localhost:3002/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "测试店铺"
  }' | jq .

echo ""
echo "✅ 测试完成"
echo "================================"

# 停止服务
kill $SERVER_PID
echo "🛑 服务已停止"