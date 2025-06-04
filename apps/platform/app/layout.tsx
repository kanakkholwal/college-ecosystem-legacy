import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { appConfig } from "~/project.config";
import { Provider } from "./client-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: appConfig.name,
    template: `%s - ${appConfig.name}`,
  },
  description: appConfig.description,
  applicationName: appConfig.name,
  authors: appConfig.authors,
  creator: appConfig.creator,
  keywords: appConfig.keywords,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(appConfig.url),
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
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appConfig.url,
    title: appConfig.name,
    description: appConfig.description,
    siteName: appConfig.name,
    images: [
      {
        url: appConfig.logo,
        width: 1200,
        height: 630,
        alt: appConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: appConfig.name,
    description: appConfig.description,
    images: [appConfig.logo],
    creator: "@kanakkholwal",
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
        <Provider>{children} </Provider>
        {process.env.NODE_ENV === "production" && (
          <GoogleAnalytics gaId="G-SC4TQQ5PCW" />
        )}
      </body>
    </html>
  );
}
