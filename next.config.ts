import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
    ],
  },
  // Include the SQLite database in serverless function bundles for Vercel
  outputFileTracingIncludes: {
    '/api/*': ['./prisma/dev.db'],
    '/*': ['./prisma/dev.db'],
  },
};

export default nextConfig;
