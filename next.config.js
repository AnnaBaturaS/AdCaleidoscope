/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Ignore problematic dependencies that aren't used
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push('aws-sdk', 'mock-aws-s3', 'nock', 'duckdb');
    }

    return config;
  },
  // Configure headers for iframe content
  async headers() {
    return [
      {
        source: '/playable-demo.html',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'",
          },
        ],
      },
      {
        source: '/playable-runner.html',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;