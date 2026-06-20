import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    emotion: true,
  },
  images: {
    domains: ["www.gravatar.com"],
  },
};

export default nextConfig;
