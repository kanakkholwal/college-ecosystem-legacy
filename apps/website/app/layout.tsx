import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Provider } from "./client-provider";

import "./globals.css";

import { Open_Sans } from "next/font/google";

const font = Open_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin-ext", "latin"],
  display: "swap",
  adjustFontFallback: false,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "NITH Portal",
  description:
    "NITH Portal is a platform for students of NITH to get all the resources at one place.",
  applicationName: "NITH Portal",
  authors: [{ name: "Kanak Kholwal", url: "https://kanakkholwal.eu.org" }],
  creator: "Kanak Kholwal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://nith.eu.org"),
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "./manifest.json",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body
        className={
          `${font.className} min-h-screen selection:bg-primary/10 selection:text-primary dark:bg-gray-900`
        }
      >
        <Provider>{children}</Provider>
        <GoogleAnalytics gaId="G-SC4TQQ5PCW" />
      </body>
    </html>
  );
}
