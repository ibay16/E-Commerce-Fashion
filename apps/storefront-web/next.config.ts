import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'standalone',
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'leaflet', 'date-fns'],
  },
  // This helps Next.js trace dependencies correctly in a monorepo
  outputFileTracingRoot: path.join(process.cwd(), "../../"),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ghdadhlyhzdkrjlurifj.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/proxy/commerce/:path*',
        destination: `${process.env.INTERNAL_COMMERCE_API_URL || 'http://commerce-service:3001/api/commerce'}/:path*`
      },
      {
        source: '/proxy/customer/:path*',
        destination: `${process.env.INTERNAL_CUSTOMER_API_URL || 'http://customer-service:3002/api/customer'}/:path*`
      },
      {
        source: '/proxy/orders/:path*',
        destination: `${process.env.INTERNAL_ORDER_API_URL || 'http://order-service:3003/api/orders'}/:path*`
      }
    ]
  }
};

export default nextConfig;
