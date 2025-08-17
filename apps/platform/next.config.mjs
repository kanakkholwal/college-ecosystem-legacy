/** @type {import('next').NextConfig} */

import withSerWistInit from '@serwist/next';

const withSerWist = withSerWistInit({
    cacheOnNavigation: true,
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
    disable: process.env.NODE_ENV !== "production"
});

const nextConfig = {
    reactStrictMode: true,
    crossOrigin: 'anonymous',
    logging: (process.env.NODE_ENV !== "production" ? false : ({
        fetches: {
            fullUrl: false
        }
    })),
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "**",
            },
            {
                protocol: 'https',
                hostname: "api.dicebear.com",
            },
            {
                hostname: "visitor-badge.laobi.icu",
            },
        ],
    },
    // output: "standalone",
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
    // This is required to support PostHog trailing slash API requests
    skipTrailingSlashRedirect: true,
};

export default withSerWist(nextConfig);
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
initOpenNextCloudflareForDev();
