import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Provider } from "./client-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "College Platform",
  description: "All-in-One Student Hub: Results, Resources, Attendance & More",
  applicationName: "College Platform",
  authors: [{ name: "Kanak Kholwal", url: "https://kanakkholwal.eu.org" }],
  creator: "Kanak Kholwal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://app.nith.eu.org"),
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
};

export const dynamic = "force-dynamic";

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
      <body className={cn("min-h-screen antialiased", fontSans.variable)}>
        <Provider>{children} </Provider>
        {process.env.NODE_ENV === "production" && (
          <GoogleAnalytics gaId="G-SC4TQQ5PCW" />
        )}
      </body>
    </html>
  );
}
