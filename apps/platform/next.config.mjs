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
    // output: "standalone",
    logging: (process.env.NODE_ENV !== "production" ? false :({
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
        ],
    },
    experimental: {
        forceSwcTransforms: true,
    }
    // forceSwcTransforms: true,

}

export default withSerWist(nextConfig);
