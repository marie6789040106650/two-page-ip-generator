#!/bin/bash

# 共享资源同步脚本
echo "🔄 开始同步共享资源..."

# 检查是否在项目根目录
if [ ! -d "shared" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 同步共享类型定义到各工作区
echo "📝 同步类型定义..."
for workspace in workspace-1-ui-form workspace-2-api-content workspace-3-markdown-html workspace-4-export-deploy; do
    if [ -d "$workspace" ]; then
        mkdir -p "$workspace/shared/types"
        cp -r shared/types/* "$workspace/shared/types/" 2>/dev/null || true
        echo "  ✅ 已同步到 $workspace"
    fi
done

# 同步共享配置文件
echo "⚙️ 同步配置文件..."
for workspace in workspace-1-ui-form workspace-2-api-content workspace-3-markdown-html workspace-4-export-deploy; do
    if [ -d "$workspace" ]; then
        mkdir -p "$workspace/shared/config"
        cp -r shared/config/* "$workspace/shared/config/" 2>/dev/null || true
        echo "  ✅ 已同步到 $workspace"
    fi
done

# 同步共享工具函数
echo "🛠️ 同步工具函数..."
for workspace in workspace-1-ui-form workspace-2-api-content workspace-3-markdown-html workspace-4-export-deploy; do
    if [ -d "$workspace" ]; then
        mkdir -p "$workspace/shared/utils"
        cp -r shared/utils/* "$workspace/shared/utils/" 2>/dev/null || true
        echo "  ✅ 已同步到 $workspace"
    fi
done

# 同步共享资源文件
echo "📁 同步资源文件..."
for workspace in workspace-1-ui-form workspace-2-api-content workspace-3-markdown-html workspace-4-export-deploy; do
    if [ -d "$workspace" ]; then
        mkdir -p "$workspace/shared/assets"
        cp -r shared/assets/* "$workspace/shared/assets/" 2>/dev/null || true
        echo "  ✅ 已同步到 $workspace"
    fi
done

# 更新各工作区的tsconfig.json以包含共享路径
echo "🔧 更新TypeScript配置..."
for workspace in workspace-1-ui-form workspace-2-api-content workspace-3-markdown-html workspace-4-export-deploy; do
    if [ -f "$workspace/tsconfig.json" ]; then
        # 备份原配置
        cp "$workspace/tsconfig.json" "$workspace/tsconfig.json.backup"
        
        # 使用Node.js脚本更新配置
        node -e "
        const fs = require('fs');
        const path = '$workspace/tsconfig.json';
        const config = JSON.parse(fs.readFileSync(path, 'utf8'));
        
        if (!config.compilerOptions.paths) {
            config.compilerOptions.paths = {};
        }
        
        config.compilerOptions.paths['@/shared/*'] = ['./shared/*'];
        
        fs.writeFileSync(path, JSON.stringify(config, null, 2));
        " 2>/dev/null || true
        
        echo "  ✅ 已更新 $workspace/tsconfig.json"
    fi
done

# 检查同步状态
echo "🔍 检查同步状态..."
for workspace in workspace-1-ui-form workspace-2-api-content workspace-3-markdown-html workspace-4-export-deploy; do
    if [ -d "$workspace/shared" ]; then
        file_count=$(find "$workspace/shared" -type f | wc -l)
        echo "  📊 $workspace: $file_count 个共享文件"
    fi
done

echo "✅ 共享资源同步完成！"
echo ""
echo "📋 同步内容："
echo "  - 类型定义 (shared/types/)"
echo "  - 配置文件 (shared/config/)"
echo "  - 工具函数 (shared/utils/)"
echo "  - 资源文件 (shared/assets/)"
echo "  - TypeScript配置更新"