import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/cecagem/:path*",
  //       // destination: "https://back.ecomassystems.com/api/v1/:path*",
  //       // destination: "http://localhost:3001/api/v1/:path*",
  //       destination: "https://back-system.cecagem.com/api/v1/:path*",
  //     },
  //   ];
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
        port: "",
        pathname: "/",
      },
    ],
  },
};

export default nextConfig;
