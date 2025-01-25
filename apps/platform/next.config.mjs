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
    // output: "standalone",
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
    env:{
        NODE_ENV: process.env.NODE_ENV ? process.env.NODE_ENV : "production", // specify measure for vercel and pnpm issue
    }
}

export default withSerwist(nextConfig);
