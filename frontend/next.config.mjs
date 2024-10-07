/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;