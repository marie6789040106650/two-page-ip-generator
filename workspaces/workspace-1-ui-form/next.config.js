/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    WORKSPACE_NAME: 'workspace-1-ui-form',
    WORKSPACE_PORT: '3001',
  },
  async rewrites() {
    return [
      {
        source: '/api/content/:path*',
        destination: 'http://localhost:3002/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig