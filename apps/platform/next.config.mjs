/** @type {import('next').NextConfig} */

import withSerWistInit from '@serwist/next';

const withSerWist = withSerWistInit({
  cacheOnNavigation: true,
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig = {
  reactStrictMode: true,
  crossOrigin: 'anonymous',
  logging: process.env.NODE_ENV !== "production"
    ? false
    : {
        fetches: {
          fullUrl: false,
        },
      },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { hostname: 'visitor-badge.laobi.icu' },
    ],
  },
  experimental: {
    forceSwcTransforms: true,
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default withSerWist(nextConfig);

// Only enable Cloudflare context in dev mode
if (process.env.NODE_ENV === "development") {
  const { initOpenNextCloudflareForDev } = await import('@opennextjs/cloudflare');
  initOpenNextCloudflareForDev();
}
// This is a workaround for the issue with wrangler not being able to read the config file