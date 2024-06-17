
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        id: "college-platform",
        name: "College Platform for NITH",
        short_name: "College Platform",
        description: "All-in-One Student Hub: Results, Resources, Attendance & More",
        icons: [
            {
                "src": "./favicon-16x16.png",
                "sizes": "16x16",
                "type": "image/png"
            },
            {
                "src": "./favicon-32x32.png",
                "sizes": "32x32",
                "type": "image/png"
            },
            {
                "src": "./android-chrome-192x192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "./android-chrome-512x512.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ],
        theme_color: "#7c3aed",
        background_color: "#7c3aed1a",
        start_url: "/",
        scope: ".",
        display: "standalone",
        orientation: "portrait",
    }
}