/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  output: 'standalone',
  images: {
    domains: ['localhost', "sejm-stats.pl", "api.sejm.gov.pl"],
  },
};

export default nextConfig;