#!/bin/bash

# 多工作区协作开发设置脚本
# 用于初始化4个并行工作区

echo "🚀 开始设置多工作区协作开发环境..."

# 创建工作区目录
WORKSPACES=(
    "workspace-1-ui-form"
    "workspace-2-api-content" 
    "workspace-3-html-rendering"
    "workspace-4-html-export"
)

# 创建主工作区目录
mkdir -p workspaces

for workspace in "${WORKSPACES[@]}"; do
    echo "📁 创建工作区: $workspace"
    
    # 创建工作区目录结构
    mkdir -p "workspaces/$workspace"
    mkdir -p "workspaces/$workspace/components"
    mkdir -p "workspaces/$workspace/lib"
    mkdir -p "workspaces/$workspace/hooks"
    mkdir -p "workspaces/$workspace/services"
    mkdir -p "workspaces/$workspace/utils"
    
    # 创建工作区README
    cat > "workspaces/$workspace/README.md" << EOF
# $workspace

## 工作区职责

### 工作区1: UI复用和表单优化 (ui-form-reuse)
- 复用原项目UI组件
- 表单功能增强
- 用户体验优化

### 工作区2: API集成和内容生成 (api-content-generation)
- 复用原项目生成逻辑
- API响应格式调整
- 内容生成流程优化

### 工作区3: HTML渲染和样式系统 (html-rendering-system)
- Markdown到HTML转换
- Word样式HTML生成
- 样式配置系统

### 工作区4: HTML导出引擎 (html-export-engine)
- HTML到Word转换
- HTML到PDF转换
- 导出进度管理

## 开发指南

1. 在此工作区内开发相关功能
2. 遵循项目的代码规范
3. 定期与其他工作区同步
4. 完成后等待合并

## 文件结构

\`\`\`
$workspace/
├── components/     # React组件
├── lib/           # 工具函数和核心逻辑
├── hooks/         # 自定义Hook
├── services/      # API服务
├── utils/         # 辅助工具
└── README.md      # 工作区说明
\`\`\`

## 开发状态

- [ ] 初始化完成
- [ ] 核心功能开发
- [ ] 测试完成
- [ ] 准备合并
EOF

    # 创建工作区配置文件
    cat > "workspaces/$workspace/workspace.config.json" << EOF
{
  "name": "$workspace",
  "version": "1.0.0",
  "description": "工作区配置文件",
  "dependencies": [],
  "tasks": [],
  "status": "initialized"
}
EOF

    echo "✅ 工作区 $workspace 创建完成"
done

# 创建共享资源目录
echo "📦 创建共享资源目录..."
mkdir -p workspaces/shared
mkdir -p workspaces/shared/types
mkdir -p workspaces/shared/constants
mkdir -p workspaces/shared/utils

# 复制共享类型定义
cp lib/types.ts workspaces/shared/types/
cp config/export-styles.json workspaces/shared/constants/

# 创建工作区同步脚本
cat > "scripts/sync-shared.sh" << 'EOF'
#!/bin/bash

echo "🔄 同步共享资源到各工作区..."

WORKSPACES=(
    "workspace-1-ui-form"
    "workspace-2-api-content" 
    "workspace-3-html-rendering"
    "workspace-4-html-export"
)

for workspace in "${WORKSPACES[@]}"; do
    echo "同步到 $workspace..."
    
    # 同步类型定义
    cp workspaces/shared/types/* "workspaces/$workspace/lib/" 2>/dev/null || true
    
    # 同步常量配置
    cp workspaces/shared/constants/* "workspaces/$workspace/lib/" 2>/dev/null || true
    
    echo "✅ $workspace 同步完成"
done

echo "🎉 所有工作区同步完成！"
EOF

chmod +x scripts/sync-shared.sh

# 创建工作区合并脚本
cat > "scripts/merge-workspaces.sh" << 'EOF'
#!/bin/bash

echo "🔀 开始合并工作区..."

# 检查所有工作区状态
WORKSPACES=(
    "workspace-1-ui-form"
    "workspace-2-api-content" 
    "workspace-3-html-rendering"
    "workspace-4-html-export"
)

echo "📋 检查工作区状态..."
for workspace in "${WORKSPACES[@]}"; do
    if [ -d "workspaces/$workspace" ]; then
        echo "✅ $workspace 存在"
    else
        echo "❌ $workspace 不存在"
        exit 1
    fi
done

echo "🔄 开始合并过程..."

# 合并组件
echo "合并组件..."
for workspace in "${WORKSPACES[@]}"; do
    if [ -d "workspaces/$workspace/components" ]; then
        cp -r "workspaces/$workspace/components/"* components/ 2>/dev/null || true
        echo "✅ 合并 $workspace 组件"
    fi
done

# 合并库文件
echo "合并库文件..."
for workspace in "${WORKSPACES[@]}"; do
    if [ -d "workspaces/$workspace/lib" ]; then
        cp -r "workspaces/$workspace/lib/"* lib/ 2>/dev/null || true
        echo "✅ 合并 $workspace 库文件"
    fi
done

# 合并Hook
echo "合并Hook..."
for workspace in "${WORKSPACES[@]}"; do
    if [ -d "workspaces/$workspace/hooks" ]; then
        cp -r "workspaces/$workspace/hooks/"* hooks/ 2>/dev/null || true
        echo "✅ 合并 $workspace Hook"
    fi
done

# 合并服务
echo "合并服务..."
for workspace in "${WORKSPACES[@]}"; do
    if [ -d "workspaces/$workspace/services" ]; then
        mkdir -p services
        cp -r "workspaces/$workspace/services/"* services/ 2>/dev/null || true
        echo "✅ 合并 $workspace 服务"
    fi
done

echo "🎉 工作区合并完成！"
echo "📝 请检查合并结果并运行测试"
EOF

chmod +x scripts/merge-workspaces.sh

# 创建GitHub设置脚本
cat > "scripts/github-setup.sh" << 'EOF'
#!/bin/bash

echo "🐙 设置GitHub仓库..."

# 检查是否已经是Git仓库
if [ ! -d ".git" ]; then
    echo "初始化Git仓库..."
    git init
fi

# 添加所有文件
echo "添加文件到Git..."
git add .

# 创建初始提交
echo "创建初始提交..."
git commit -m "🚀 初始化多工作区协作开发项目

- 设置4个并行工作区
- 配置共享资源同步
- 准备GitHub部署配置"

# 设置主分支
git branch -M main

echo "📋 GitHub仓库设置完成！"
echo "请手动执行以下命令完成GitHub设置："
echo ""
echo "1. 在GitHub创建新仓库 'two-page-ip-generator'"
echo "2. 执行以下命令："
echo "   git remote add origin https://github.com/YOUR_USERNAME/two-page-ip-generator.git"
echo "   git push -u origin main"
echo ""
echo "3. 配置Vercel部署："
echo "   - 连接GitHub仓库到Vercel"
echo "   - 设置自动部署"
EOF

chmod +x scripts/github-setup.sh

# 创建开发指南
cat > "docs/DEVELOPMENT_GUIDE.md" << 'EOF'
# 多工作区协作开发指南

## 🏗️ 项目架构

```
two-page-ip-generator/
├── workspaces/                    # 工作区目录
│   ├── workspace-1-ui-form/       # UI和表单工作区
│   ├── workspace-2-api-content/   # API和内容工作区
│   ├── workspace-3-html-rendering/# HTML渲染工作区
│   ├── workspace-4-html-export/   # HTML导出工作区
│   └── shared/                    # 共享资源
├── scripts/                       # 自动化脚本
├── docs/                         # 文档
└── [主项目文件]
```

## 🚀 快速开始

### 1. 初始化工作区
```bash
./scripts/setup-workspaces.sh
```

### 2. 同步共享资源
```bash
./scripts/sync-shared.sh
```

### 3. 开发流程
1. 选择你的工作区
2. 在工作区内开发功能
3. 定期同步共享资源
4. 完成后等待合并

### 4. 合并工作区
```bash
./scripts/merge-workspaces.sh
```

### 5. 部署到GitHub
```bash
./scripts/github-setup.sh
```

## 📋 工作区职责

### 工作区1: UI复用和表单优化
- 复用原项目UI组件
- 表单功能增强
- 用户体验优化

### 工作区2: API集成和内容生成
- 复用原项目生成逻辑
- API响应格式调整
- 内容生成流程优化

### 工作区3: HTML渲染和样式系统
- Markdown到HTML转换
- Word样式HTML生成
- 样式配置系统

### 工作区4: HTML导出引擎
- HTML到Word转换
- HTML到PDF转换
- 导出进度管理

## 🔄 协作流程

1. **初始化**: 运行设置脚本创建工作区
2. **并行开发**: 各工作区独立开发
3. **定期同步**: 同步共享资源和依赖
4. **集成测试**: 合并前的功能测试
5. **代码合并**: 统一合并所有工作区
6. **部署上线**: 推送到GitHub并部署

## 🛠️ 技术栈

- **前端框架**: Next.js 14+ with App Router
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: Shadcn/ui
- **导出库**: html-docx-js, jsPDF, html2canvas
- **部署**: Vercel

## 📝 开发规范

1. **代码风格**: 遵循ESLint和Prettier配置
2. **类型安全**: 使用TypeScript严格模式
3. **组件命名**: 使用PascalCase
4. **文件命名**: 使用kebab-case
5. **提交信息**: 使用约定式提交格式

## 🧪 测试策略

1. **单元测试**: 每个工作区独立测试
2. **集成测试**: 合并后的功能测试
3. **端到端测试**: 完整用户流程测试
4. **性能测试**: 导出功能性能测试

## 🚀 部署流程

1. **本地构建**: `npm run build`
2. **推送代码**: `git push origin main`
3. **自动部署**: Vercel自动部署
4. **验证功能**: 生产环境功能验证

## 📞 支持

如有问题，请联系项目负责人或查看相关文档。
EOF

echo "🎉 多工作区协作开发环境设置完成！"
echo ""
echo "📋 下一步操作："
echo "1. 运行 ./scripts/sync-shared.sh 同步共享资源"
echo "2. 选择工作区开始开发"
echo "3. 开发完成后运行 ./scripts/merge-workspaces.sh 合并"
echo "4. 运行 ./scripts/github-setup.sh 设置GitHub仓库"
echo ""
echo "📖 详细指南请查看 docs/DEVELOPMENT_GUIDE.md"