#!/bin/bash

# GitHub仓库和分支设置脚本
echo "🐙 开始设置GitHub仓库和分支..."

# 检查是否已经初始化Git
if [ ! -d ".git" ]; then
    echo "📝 初始化Git仓库..."
    git init
    git add .
    git commit -m "Initial commit: 多工作区项目初始化"
fi

# 设置远程仓库（需要用户提供仓库URL）
echo "🔗 设置远程仓库..."
read -p "请输入GitHub仓库URL (例: https://github.com/username/two-page-ip-generator.git): " REPO_URL

if [ -n "$REPO_URL" ]; then
    git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"
    echo "  ✅ 远程仓库设置完成: $REPO_URL"
else
    echo "  ⚠️ 未设置远程仓库，请稍后手动设置"
fi

# 创建并推送develop分支
echo "🌿 创建develop分支..."
git checkout -b develop 2>/dev/null || git checkout develop
git push -u origin develop

# 创建各工作区分支
echo "🔀 创建工作区分支..."

# 工作区分支列表
workspaces=(
    "workspace-1-ui-form"
    "workspace-2-api-content"
    "workspace-3-markdown-html"
    "workspace-4-export-deploy"
)

for workspace in "${workspaces[@]}"; do
    echo "  📝 创建分支: $workspace"
    git checkout -b "$workspace" develop 2>/dev/null || git checkout "$workspace"
    git push -u origin "$workspace"
done

# 创建集成分支
echo "🔧 创建integration分支..."
git checkout -b integration develop 2>/dev/null || git checkout integration
git push -u origin integration

# 回到develop分支
git checkout develop

# 创建分支保护规则说明
cat > docs/BRANCH_STRATEGY.md << 'EOF'
# Git分支策略

## 分支结构

```
main (受保护)
├── develop (开发主分支，推送目标)
├── workspace-1-ui-form (工作区1分支)
├── workspace-2-api-content (工作区2分支)
├── workspace-3-markdown-html (工作区3分支)
├── workspace-4-export-deploy (工作区4分支)
└── integration (集成测试分支)
```

## 分支说明

### main分支
- **用途**: 生产环境代码
- **保护**: 受保护分支，不允许直接推送
- **合并**: 只能通过PR从develop分支合并

### develop分支
- **用途**: 开发环境主分支
- **推送**: 各工作区开发完成后推送到此分支
- **部署**: 自动部署到Vercel预览环境

### 工作区分支
- **workspace-1-ui-form**: UI复用和表单优化
- **workspace-2-api-content**: API集成和内容生成
- **workspace-3-markdown-html**: Markdown到HTML转换
- **workspace-4-export-deploy**: 导出系统和部署

### integration分支
- **用途**: 集成测试和代码合并
- **合并**: 各工作区代码在此分支进行集成测试

## 工作流程

1. **开发阶段**: 在各自的工作区分支进行开发
2. **集成阶段**: 合并到integration分支进行测试
3. **发布阶段**: 测试通过后合并到develop分支
4. **生产阶段**: 通过PR将develop合并到main分支

## 分支保护规则建议

### main分支
- 要求PR审查
- 要求状态检查通过
- 要求分支为最新
- 限制推送权限

### develop分支
- 要求状态检查通过
- 允许管理员绕过限制
EOF

# 创建GitHub Actions工作流
mkdir -p .github/workflows

cat > .github/workflows/ci.yml << 'EOF'
name: CI/CD Pipeline

on:
  push:
    branches: [ develop, main ]
  pull_request:
    branches: [ develop, main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run type check
      run: npm run type-check
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm run test
    
    - name: Build project
      run: npm run build

  deploy-preview:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel Preview
      uses: vercel/action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel Production
      uses: vercel/action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
EOF

# 创建PR模板
mkdir -p .github/pull_request_template.md
cat > .github/pull_request_template.md << 'EOF'
## 变更描述
请简要描述此PR的变更内容

## 变更类型
- [ ] 新功能
- [ ] Bug修复
- [ ] 文档更新
- [ ] 样式调整
- [ ] 重构
- [ ] 性能优化
- [ ] 其他

## 测试
- [ ] 已在本地测试
- [ ] 已添加单元测试
- [ ] 已进行集成测试
- [ ] 已在多个浏览器测试

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 已更新相关文档
- [ ] 无TypeScript错误
- [ ] 无ESLint警告
- [ ] 已测试所有功能

## 截图（如适用）
请添加相关截图

## 相关Issue
关联的Issue编号: #
EOF

echo "✅ GitHub仓库和分支设置完成！"
echo ""
echo "📋 已创建的分支："
echo "  - develop (开发主分支)"
echo "  - workspace-1-ui-form"
echo "  - workspace-2-api-content"
echo "  - workspace-3-markdown-html"
echo "  - workspace-4-export-deploy"
echo "  - integration"
echo ""
echo "📚 已创建的文档："
echo "  - docs/BRANCH_STRATEGY.md (分支策略说明)"
echo "  - .github/workflows/ci.yml (CI/CD流水线)"
echo "  - .github/pull_request_template.md (PR模板)"
echo ""
echo "🚀 下一步："
echo "  1. 在GitHub仓库设置中配置分支保护规则"
echo "  2. 添加Vercel集成的环境变量"
echo "  3. 开始多工作区并行开发"