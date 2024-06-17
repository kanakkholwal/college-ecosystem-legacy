/** @type {import('next').NextConfig} */
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
    cacheOnNavigation: true,
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
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
}

export default withSerwist(nextConfig);
