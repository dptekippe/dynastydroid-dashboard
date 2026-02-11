/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Better for Docker/Render deployments
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bot-sports-empire.onrender.com/api/v1'
  }
}

module.exports = nextConfig
