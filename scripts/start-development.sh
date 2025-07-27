#!/bin/bash

# 多工作区协作开发启动脚本
echo "🚀 启动多工作区协作开发环境..."

# 检查Node.js和npm
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到Node.js，请先安装Node.js"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ 错误：未找到npm，请先安装npm"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"

# 创建项目根目录
PROJECT_NAME="two-page-ip-generator"
if [ ! -d "$PROJECT_NAME" ]; then
    echo "📁 创建项目根目录: $PROJECT_NAME"
    mkdir -p "$PROJECT_NAME"
fi

cd "$PROJECT_NAME"

# 初始化主项目
echo "🔧 初始化主项目..."
if [ ! -f "package.json" ]; then
    npm init -y
    
    # 更新package.json
    cat > package.json << 'EOF'
{
  "name": "two-page-ip-generator",
  "version": "1.0.0",
  "description": "两页面IP生成器 - 多工作区协作开发项目",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "setup-workspaces": "bash scripts/setup-workspaces.sh",
    "sync-shared": "bash scripts/sync-shared.sh",
    "merge-workspaces": "bash scripts/merge-workspaces.sh",
    "github-setup": "bash scripts/github-setup.sh",
    "dev:workspace1": "cd workspaces/workspace-1-ui-form && npm run dev",
    "dev:workspace2": "cd workspaces/workspace-2-api-content && npm run dev",
    "dev:workspace3": "cd workspaces/workspace-3-html-rendering && npm run dev",
    "dev:workspace4": "cd workspaces/workspace-4-html-export && npm run dev"
  },
  "keywords": [
    "ip-generator",
    "markdown",
    "html",
    "word",
    "pdf",
    "export",
    "watermark",
    "nextjs",
    "typescript"
  ],
  "author": "Kiro AI Assistant",
  "license": "MIT",
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "marked": "^9.1.6",
    "html2pdf.js": "^0.10.1",
    "html-docx-js": "^0.3.1",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1",
    "file-saver": "^2.0.5",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-label": "^2.0.2",
    "lucide-react": "^0.294.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "@tailwindcss/typography": "^0.5.10",
    "concurrently": "^8.2.2"
  }
}
EOF
fi

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 创建基础项目结构
echo "🏗️ 创建基础项目结构..."
mkdir -p {app,components,lib,hooks,styles,config,docs,scripts,workspaces}

# 创建Next.js配置
if [ ! -f "next.config.js" ]; then
    cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }
    return config
  },
}

module.exports = nextConfig
EOF
fi

# 创建TypeScript配置
if [ ! -f "tsconfig.json" ]; then
    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/styles/*": ["./styles/*"],
      "@/config/*": ["./config/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
fi

# 创建Tailwind配置
if [ ! -f "tailwind.config.js" ]; then
    cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './workspaces/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
EOF
fi

# 创建全局样式
mkdir -p app
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* 自定义样式 */
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-glass {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hover-lift {
  transition: transform 0.2s ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.6s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* 水印预览样式 */
.watermark-preview-container {
  position: relative;
  width: 100%;
  height: 200px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.watermark-preview-content {
  padding: 16px;
  position: relative;
  z-index: 1;
}

.watermark-element {
  position: absolute;
  pointer-events: none;
  user-select: none;
  font-weight: bold;
  white-space: nowrap;
}
EOF

# 创建基础布局文件
cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '两页面IP生成器',
  description: '专业的老板IP打造方案生成工具',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
EOF

# 创建基础首页
cat > app/page.tsx << 'EOF'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-6">两页面IP生成器</h1>
        <p className="text-xl mb-8">多工作区协作开发项目</p>
        <div className="space-y-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">开发状态</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-green-500/20 rounded p-3">
                <div className="font-medium">工作区1</div>
                <div>UI复用和表单优化</div>
              </div>
              <div className="bg-blue-500/20 rounded p-3">
                <div className="font-medium">工作区2</div>
                <div>API集成和内容生成</div>
              </div>
              <div className="bg-purple-500/20 rounded p-3">
                <div className="font-medium">工作区3</div>
                <div>HTML渲染和样式系统</div>
              </div>
              <div className="bg-orange-500/20 rounded p-3">
                <div className="font-medium">工作区4</div>
                <div>HTML导出引擎</div>
              </div>
            </div>
          </div>
          <Link 
            href="/docs" 
            className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            查看开发文档
          </Link>
        </div>
      </div>
    </div>
  )
}
EOF

# 运行工作区设置脚本
echo "🔧 设置多工作区环境..."
if [ -f "scripts/setup-workspaces.sh" ]; then
    chmod +x scripts/setup-workspaces.sh
    ./scripts/setup-workspaces.sh
else
    echo "⚠️ 工作区设置脚本不存在，请手动运行 npm run setup-workspaces"
fi

# 创建开发启动脚本
cat > scripts/dev-all.sh << 'EOF'
#!/bin/bash

echo "🚀 启动所有工作区开发服务器..."

# 使用concurrently同时启动多个开发服务器
npx concurrently \
  --names "MAIN,WS1,WS2,WS3,WS4" \
  --prefix-colors "cyan,green,blue,magenta,yellow" \
  "npm run dev" \
  "npm run dev:workspace1" \
  "npm run dev:workspace2" \
  "npm run dev:workspace3" \
  "npm run dev:workspace4"
EOF

chmod +x scripts/dev-all.sh

echo "🎉 多工作区协作开发环境设置完成！"
echo ""
echo "📋 下一步操作："
echo "1. 运行 'npm run dev' 启动主项目开发服务器"
echo "2. 运行 './scripts/dev-all.sh' 同时启动所有工作区"
echo "3. 在不同的Kiro窗口中打开各个工作区文件夹进行开发"
echo ""
echo "🔗 访问地址："
echo "- 主项目: http://localhost:3000"
echo "- 工作区1: http://localhost:3001"
echo "- 工作区2: http://localhost:3002"
echo "- 工作区3: http://localhost:3003"
echo "- 工作区4: http://localhost:3004"
echo ""
echo "📚 文档位置："
echo "- 开发指南: docs/DEVELOPMENT_GUIDE.md"
echo "- 多工作区规划: docs/MULTI_WORKSPACE_PLAN.md"
echo "- 水印系统设计: docs/WATERMARK_SYSTEM_DESIGN.md"
echo ""
echo "🚀 开始愉快的多工作区协作开发吧！"