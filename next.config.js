/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  publicRuntimeConfig: {
    jsonlink_api_url: "https://jsonlink.io/api",
  },
};

module.exports = nextConfig;
