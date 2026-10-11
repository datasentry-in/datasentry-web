import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The DPDP console mock moved from /demo to /app/dpdp-demo. Keep old links working.
  async redirects() {
    return [
      { source: '/demo', destination: '/app/dpdp-demo', permanent: true },
      { source: '/demo/:path*', destination: '/app/dpdp-demo/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
