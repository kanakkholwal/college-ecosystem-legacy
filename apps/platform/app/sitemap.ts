import { MetadataRoute } from "next";
import { appConfig } from "~/project.config";

const BASE_URL = appConfig.url

const staticRoutes = [
    { path: "/", },
    { path: "/auth/sign-in", },
    { path: "/results", },
    { path: "/academic-calendar", },
    { path: "/classroom-availability", },
    { path: "/schedules", },
    { path: "/syllabus", },
    { path: "/announcements", },
    { path: "/community", },
    { path: "/polls", },

];

// Use a consistent lastmod date (e.g., build time)
const LASTMOD = new Date().toISOString();

export default function sitemap(): MetadataRoute.Sitemap {
    // Optionally, fetch dynamic routes here (e.g., blog posts)
    // const dynamicRoutes = await fetchDynamicRoutes();

    // const sitemap = generateSiteMap([
    //     ...staticRoutes.map((route) => ({
    //         ...route,
    //         date: LASTMOD,
    //         priority: route.path === '/' ? 1 : 0.8,
    //         changefreq: 'daily',

    //     })),
    //     // ...dynamicRoutes
    // ]);

    return staticRoutes.map((route) => ({
        date: LASTMOD,
        priority: route.path === '/' ? 1 : 0.8,
        changefreq: 'daily',
        url: BASE_URL + escapeXml(route.path)
    }));
}

function escapeXml(unsafe: string) {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "'":
                return "&apos;";
            case '"':
                return "&quot;";
            default:
                return "";
        }
    });
}

function generateSiteMap(
    pages: { path: string; date: string; priority: number; changefreq: string }[]
) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages
            .map(
                (page) => `
    <url>
        <loc>${BASE_URL}${escapeXml(page.path)}</loc>
        <lastmod>${escapeXml(page.date)}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`
            )
            .join("")}
</urlset>`;
}