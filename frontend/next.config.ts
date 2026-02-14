import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
          protocol: "https",
          hostname: "res.cloudinary.com",
          port: "",
          pathname: "/**",
      },
    ],
  },
}

export default withNextIntl(nextConfig)
