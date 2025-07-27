/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    WORKSPACE_NAME: 'workspace-4-html-export',
    WORKSPACE_PORT: '3004',
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
  webpack: (config) => {
    // 处理Canvas依赖
    config.externals = config.externals || []
    config.externals.push({
      canvas: 'canvas',
    })
    return config
  },
}

module.exports = nextConfig