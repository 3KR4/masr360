/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:2005/api/v1/:path*",
      },
      {
        source: "/api/analytics/:path*",
        destination: "https://about.api.m360travel.com/api/analytics/:path*",
      },
      {
        source: "/api-proxy/:path*",
        destination: "http://101.46.70.242/:path*",
      },
    ];
  },
};

export default nextConfig;
