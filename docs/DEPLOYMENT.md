# 部署指南

本文档详细说明了如何部署老板IP打造方案生成器到不同的环境。

## 🚀 部署选项

### 1. Vercel 部署（推荐）

Vercel 是 Next.js 的官方部署平台，提供最佳的性能和开发体验。

#### 步骤：

1. **连接 GitHub 仓库**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 选择你的 GitHub 仓库

2. **配置环境变量**
   ```
   NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
   NODE_ENV=production
   ```

3. **部署设置**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`

4. **自动部署**
   - 推送到 main 分支自动触发部署
   - 预览部署用于 PR 审查

### 2. Docker 部署

适用于容器化部署环境。

#### 构建镜像：

```bash
# 构建生产镜像
docker build -t two-page-ip-generator:latest .

# 运行容器
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_BASE_URL=https://your-domain.com \
  -e NODE_ENV=production \
  two-page-ip-generator:latest
```

#### Docker Compose：

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_BASE_URL=https://your-domain.com
      - NODE_ENV=production
    restart: unless-stopped
```

### 3. 静态导出部署

适用于静态托管服务（如 GitHub Pages、Netlify）。

#### 配置静态导出：

```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
```

#### 构建和部署：

```bash
# 构建静态文件
npm run build

# 部署 out 目录到静态托管服务
```

### 4. 服务器部署

适用于传统服务器环境。

#### 准备服务器：

```bash
# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2（进程管理器）
npm install -g pm2
```

#### 部署应用：

```bash
# 克隆代码
git clone <repository-url>
cd two-page-ip-generator

# 安装依赖
npm ci

# 构建应用
npm run build

# 使用 PM2 启动
pm2 start npm --name "ip-generator" -- start
pm2 save
pm2 startup
```

## 🔧 环境配置

### 环境变量

| 变量名 | 描述 | 默认值 | 必需 |
|--------|------|--------|------|
| `NEXT_PUBLIC_BASE_URL` | 应用基础URL | `http://localhost:3000` | 是 |
| `NODE_ENV` | 运行环境 | `development` | 是 |
| `NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING` | 性能监控 | `false` | 否 |

### 生产环境优化

1. **启用压缩**
   ```javascript
   // next.config.js
   const nextConfig = {
     compress: true,
   }
   ```

2. **配置缓存头**
   ```javascript
   async headers() {
     return [
       {
         source: '/static/(.*)',
         headers: [
           {
             key: 'Cache-Control',
             value: 'public, max-age=31536000, immutable',
           },
         ],
       },
     ];
   }
   ```

3. **启用 HTTPS**
   - 使用 SSL 证书
   - 配置 HSTS 头
   - 重定向 HTTP 到 HTTPS

## 🔍 健康检查

### 应用健康检查端点

应用会在以下端点提供健康检查：

- `GET /` - 主页面可访问性
- `GET /generate` - 生成页面可访问性

### 监控脚本

```bash
#!/bin/bash
# health-check.sh

URL="https://your-domain.com"
TIMEOUT=10

if curl -f -s --max-time $TIMEOUT $URL > /dev/null; then
    echo "✅ Application is healthy"
    exit 0
else
    echo "❌ Application is unhealthy"
    exit 1
fi
```

## 🚨 故障排除

### 常见部署问题

1. **构建失败**
   ```bash
   # 清理缓存
   rm -rf .next node_modules package-lock.json
   npm install
   npm run build
   ```

2. **内存不足**
   ```bash
   # 增加 Node.js 内存限制
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

3. **端口冲突**
   ```bash
   # 使用不同端口
   PORT=3001 npm start
   ```

### 日志查看

```bash
# PM2 日志
pm2 logs ip-generator

# Docker 日志
docker logs container-name

# 系统日志
journalctl -u your-service-name
```

## 📊 性能监控

### 监控指标

- **响应时间**: 页面加载时间
- **错误率**: 4xx/5xx 错误比例
- **可用性**: 服务正常运行时间
- **资源使用**: CPU、内存、磁盘使用率

### 监控工具

1. **Vercel Analytics**（Vercel 部署）
2. **Google Analytics**（用户行为）
3. **Lighthouse CI**（性能评分）
4. **Sentry**（错误监控）

## 🔄 CI/CD 流程

### GitHub Actions 工作流

1. **代码检查**
   - TypeScript 类型检查
   - ESLint 代码规范检查
   - 单元测试运行

2. **构建测试**
   - 生产环境构建
   - Docker 镜像构建

3. **性能测试**
   - Lighthouse 性能评分
   - 可访问性检查

4. **自动部署**
   - 主分支自动部署到生产环境
   - 功能分支部署到预览环境

### 部署策略

- **蓝绿部署**: 零停机时间部署
- **滚动更新**: 逐步替换实例
- **金丝雀发布**: 小流量测试新版本

## 📋 部署检查清单

### 部署前检查

- [ ] 所有测试通过
- [ ] 代码审查完成
- [ ] 环境变量配置正确
- [ ] 数据库迁移（如适用）
- [ ] 静态资源上传

### 部署后验证

- [ ] 应用正常启动
- [ ] 健康检查通过
- [ ] 关键功能测试
- [ ] 性能指标正常
- [ ] 错误监控配置

### 回滚计划

- [ ] 备份当前版本
- [ ] 回滚脚本准备
- [ ] 数据回滚策略
- [ ] 通知机制设置

---

如有部署相关问题，请参考 [故障排除指南](TROUBLESHOOTING.md) 或创建 Issue。