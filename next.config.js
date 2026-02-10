/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'https://bot-sports-empire.onrender.com/api/v1'
  }
}

module.exports = nextConfig
