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
        source: "/api-proxy/:path*",
        destination: "http://101.46.70.242/:path*",
      },
    ];
  },
};

export default nextConfig;
