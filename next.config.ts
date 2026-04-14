import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['circular-natal-horoscope-js', 'lunar-javascript', 'iztro'],
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
