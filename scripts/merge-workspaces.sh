#!/bin/bash

# 工作区合并脚本
echo "🔀 开始合并多工作区代码..."

# 检查是否在项目根目录
if [ ! -d "integration" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 创建集成目录
echo "📁 准备集成环境..."
rm -rf integration/merged-project
mkdir -p integration/merged-project

# 初始化集成项目
echo "🚀 初始化集成项目..."
cd integration/merged-project
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# 返回根目录
cd ../..

# 合并工作区1: UI和表单组件
echo "🎨 合并工作区1: UI和表单组件..."
if [ -d "workspace-1-ui-form" ]; then
    # 复制页面文件
    cp -r workspace-1-ui-form/app/* integration/merged-project/app/ 2>/dev/null || true
    
    # 复制组件
    mkdir -p integration/merged-project/components
    cp -r workspace-1-ui-form/components/* integration/merged-project/components/ 2>/dev/null || true
    
    # 复制样式
    cp -r workspace-1-ui-form/styles/* integration/merged-project/styles/ 2>/dev/null || true
    
    # 复制Hooks
    mkdir -p integration/merged-project/hooks
    cp -r workspace-1-ui-form/hooks/* integration/merged-project/hooks/ 2>/dev/null || true
    
    echo "  ✅ 工作区1合并完成"
else
    echo "  ⚠️ 工作区1不存在，跳过"
fi

# 合并工作区2: API和内容生成
echo "🤖 合并工作区2: API和内容生成..."
if [ -d "workspace-2-api-content" ]; then
    # 复制API路由
    mkdir -p integration/merged-project/app/api
    cp -r workspace-2-api-content/app/api/* integration/merged-project/app/api/ 2>/dev/null || true
    
    # 复制服务
    mkdir -p integration/merged-project/services
    cp -r workspace-2-api-content/services/* integration/merged-project/services/ 2>/dev/null || true
    
    # 复制模板
    mkdir -p integration/merged-project/templates
    cp -r workspace-2-api-content/templates/* integration/merged-project/templates/ 2>/dev/null || true
    
    # 复制中间件
    cp workspace-2-api-content/middleware.ts integration/merged-project/ 2>/dev/null || true
    
    echo "  ✅ 工作区2合并完成"
else
    echo "  ⚠️ 工作区2不存在，跳过"
fi

# 合并工作区3: Markdown到HTML转换
echo "📄 合并工作区3: Markdown到HTML转换..."
if [ -d "workspace-3-markdown-html" ]; then
    # 复制转换器库
    mkdir -p integration/merged-project/lib
    cp -r workspace-3-markdown-html/lib/* integration/merged-project/lib/ 2>/dev/null || true
    
    # 复制转换相关组件
    cp -r workspace-3-markdown-html/components/* integration/merged-project/components/ 2>/dev/null || true
    
    # 复制模板
    cp -r workspace-3-markdown-html/templates/* integration/merged-project/templates/ 2>/dev/null || true
    
    # 复制配置
    mkdir -p integration/merged-project/config
    cp -r workspace-3-markdown-html/config/* integration/merged-project/config/ 2>/dev/null || true
    
    echo "  ✅ 工作区3合并完成"
else
    echo "  ⚠️ 工作区3不存在，跳过"
fi

# 合并工作区4: 导出和部署
echo "🚀 合并工作区4: 导出和部署..."
if [ -d "workspace-4-export-deploy" ]; then
    # 复制导出组件
    cp -r workspace-4-export-deploy/components/* integration/merged-project/components/ 2>/dev/null || true
    
    # 复制导出库
    cp -r workspace-4-export-deploy/lib/* integration/merged-project/lib/ 2>/dev/null || true
    
    # 复制导出服务
    cp -r workspace-4-export-deploy/services/* integration/merged-project/services/ 2>/dev/null || true
    
    # 复制部署配置
    cp workspace-4-export-deploy/vercel.json integration/merged-project/ 2>/dev/null || true
    cp workspace-4-export-deploy/next.config.js integration/merged-project/ 2>/dev/null || true
    
    # 复制GitHub Actions
    mkdir -p integration/merged-project/.github
    cp -r workspace-4-export-deploy/.github/* integration/merged-project/.github/ 2>/dev/null || true
    
    echo "  ✅ 工作区4合并完成"
else
    echo "  ⚠️ 工作区4不存在，跳过"
fi

# 复制共享资源
echo "📦 复制共享资源..."
mkdir -p integration/merged-project/shared
cp -r shared/* integration/merged-project/shared/ 2>/dev/null || true

# 合并package.json依赖
echo "📋 合并依赖包..."
node -e "
const fs = require('fs');
const path = require('path');

// 读取主项目package.json
const mainPkg = JSON.parse(fs.readFileSync('integration/merged-project/package.json', 'utf8'));

// 合并各工作区的依赖
const workspaces = ['workspace-1-ui-form', 'workspace-2-api-content', 'workspace-3-markdown-html', 'workspace-4-export-deploy'];

workspaces.forEach(workspace => {
    const pkgPath = \`\${workspace}/package.json\`;
    if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        
        // 合并dependencies
        if (pkg.dependencies) {
            mainPkg.dependencies = { ...mainPkg.dependencies, ...pkg.dependencies };
        }
        
        // 合并devDependencies
        if (pkg.devDependencies) {
            mainPkg.devDependencies = { ...mainPkg.devDependencies, ...pkg.devDependencies };
        }
    }
});

// 添加项目特定的依赖
mainPkg.dependencies = {
    ...mainPkg.dependencies,
    'marked': '^9.1.6',
    'html-docx-js': '^0.3.1',
    'jspdf': '^2.5.1',
    'file-saver': '^2.0.5'
};

// 更新项目信息
mainPkg.name = 'two-page-ip-generator';
mainPkg.description = '两页面IP生成器 - 多工作区合并版本';
mainPkg.version = '1.0.0';

// 写回文件
fs.writeFileSync('integration/merged-project/package.json', JSON.stringify(mainPkg, null, 2));
" 2>/dev/null || true

# 更新TypeScript配置
echo "🔧 更新TypeScript配置..."
node -e "
const fs = require('fs');
const configPath = 'integration/merged-project/tsconfig.json';

if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // 添加路径映射
    if (!config.compilerOptions.paths) {
        config.compilerOptions.paths = {};
    }
    
    config.compilerOptions.paths = {
        ...config.compilerOptions.paths,
        '@/*': ['./*'],
        '@/shared/*': ['./shared/*'],
        '@/components/*': ['./components/*'],
        '@/lib/*': ['./lib/*'],
        '@/services/*': ['./services/*'],
        '@/hooks/*': ['./hooks/*']
    };
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
" 2>/dev/null || true

# 创建合并报告
echo "📊 生成合并报告..."
cat > integration/MERGE_REPORT.md << EOF
# 工作区合并报告

## 合并时间
$(date)

## 合并内容

### 工作区1: UI和表单组件
- 页面文件: $(find integration/merged-project/app -name "*.tsx" | wc -l) 个
- 组件文件: $(find integration/merged-project/components -name "*.tsx" 2>/dev/null | wc -l) 个
- Hook文件: $(find integration/merged-project/hooks -name "*.ts" 2>/dev/null | wc -l) 个

### 工作区2: API和内容生成
- API路由: $(find integration/merged-project/app/api -name "route.ts" 2>/dev/null | wc -l) 个
- 服务文件: $(find integration/merged-project/services -name "*.ts" 2>/dev/null | wc -l) 个
- 模板文件: $(find integration/merged-project/templates -name "*.json" 2>/dev/null | wc -l) 个

### 工作区3: Markdown到HTML转换
- 转换器: $(find integration/merged-project/lib -name "*converter*.ts" 2>/dev/null | wc -l) 个
- 配置文件: $(find integration/merged-project/config -name "*.json" 2>/dev/null | wc -l) 个

### 工作区4: 导出和部署
- 导出组件: $(find integration/merged-project/components -name "*export*.tsx" 2>/dev/null | wc -l) 个
- 部署配置: $(ls integration/merged-project/vercel.json integration/merged-project/.github/workflows/*.yml 2>/dev/null | wc -l) 个

## 总计文件数
- TypeScript文件: $(find integration/merged-project -name "*.ts" -o -name "*.tsx" | wc -l) 个
- 配置文件: $(find integration/merged-project -name "*.json" | wc -l) 个
- 样式文件: $(find integration/merged-project -name "*.css" | wc -l) 个

## 下一步
1. 进入 integration/merged-project 目录
2. 运行 npm install 安装依赖
3. 运行 npm run dev 启动开发服务器
4. 进行集成测试
5. 推送到GitHub develop分支
EOF

echo "✅ 工作区合并完成！"
echo ""
echo "📋 合并结果："
echo "  - 合并项目位置: integration/merged-project/"
echo "  - 合并报告: integration/MERGE_REPORT.md"
echo ""
echo "🚀 下一步操作："
echo "  1. cd integration/merged-project"
echo "  2. npm install"
echo "  3. npm run dev"
echo "  4. 测试功能完整性"
echo "  5. 推送到GitHub develop分支"