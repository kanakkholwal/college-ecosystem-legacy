import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { appConfig, orgConfig } from "~/project.config";
import { Provider } from "./client-provider";
import "./globals.css";



export const metadata: Metadata = {
  title: {
    default: `${appConfig.name} | ${orgConfig.name}`,
    template: `%s | ${appConfig.name} - ${orgConfig.shortName}`,
  },
  description: appConfig.description,
  applicationName: appConfig.name,
  authors: appConfig.authors,
  creator: appConfig.creator,
  keywords: appConfig.keywords + ", " + orgConfig.shortName + ", " + orgConfig.name,
  metadataBase: new URL(appConfig.url),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true, // Changed to allow indexing
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true, // Enabled for better crawling
      noimageindex: false, // Allow image indexing
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appConfig.url,
    title: `${appConfig.name} | ${orgConfig.name}`,
    description: appConfig.description,
    siteName: appConfig.name,
    images: [
      {
        url: new URL(appConfig.logo, appConfig.url).toString(),
        width: 1200,
        height: 630,
        alt: `${appConfig.name} - ${orgConfig.shortName}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${appConfig.name} | ${orgConfig.shortName}`,
    description: appConfig.description,
    images: [new URL(appConfig.logo, appConfig.url).toString()],
    creator: "@kanakkholwal",
    site: "@kanakkholwal",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },


};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;



export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen min-w-screen w-full antialiased",
          fontSans.variable
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgConfig.jsonLds.EducationalOrganization) }}
          id="json-ld-educational-organization"
        />
        <Provider>{children} </Provider>
        {process.env.NODE_ENV === "production" && (
          <GoogleAnalytics gaId="G-SC4TQQ5PCW" />
        )}

      </body>
    </html>
  );
}
