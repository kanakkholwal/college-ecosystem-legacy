/** @type {import('next').NextConfig} */

import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
    cacheOnNavigation: true,
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
    disable: process.env.NODE_ENV !== "production"
});



const nextConfig = {
    reactStrictMode: true,
    crossOrigin: 'anonymous',
    output: "standalone",
    logging: {
        fetches: {
            fullUrl: false
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "**",
            },
        ],
    },
    experimental: {
        forceSwcTransforms: true,
    },
}

export default withSerwist(nextConfig);
