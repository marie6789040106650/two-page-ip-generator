#!/bin/bash

# 检查是否有意外的文件修改
echo "检查文件修改..."

# 检查关键文件是否被意外修改
CRITICAL_FILES=(
  "lib/types.ts"
  "next.config.js"
  "tailwind.config.js"
  "package.json"
)

for file in "${CRITICAL_FILES[@]}"; do
  if git diff --name-only | grep -q "$file"; then
    echo "⚠️  警告: 关键文件 $file 被修改了"
  fi
done

# 显示所有修改的文件
echo "📝 修改的文件列表:"
git diff --name-only

echo "✅ 检查完成"