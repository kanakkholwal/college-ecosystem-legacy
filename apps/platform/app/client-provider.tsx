/* eslint-disable @next/next/no-img-element */
// provider.tsx
"use client";
// import Aos from "aos";
// import "aos/dist/aos.css";
import { Toaster } from "@/components/ui/toaster";
import { all_themes } from "@/constants/theme";
import { cn } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { Next13ProgressBar } from "next13-progressbar";
import type React from "react";
import { Toaster as HotToaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnReconnect: true,
    },
  },
});

export function Consumer({ children }: { children: React.ReactNode }) {
  // const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const { theme } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <div className={cn("min-h-screen w-full h-full bg-background")}>
        {children}
      </div>
      <Next13ProgressBar
        height="4px"
        color="var(--primary)"
        options={{ showSpinner: true, trickle: true }}
        showOnShallow={true}
      />
      <HotToaster
        position="bottom-right"
        toastOptions={{
          // Define default options
          duration: 2500,
        }}
      />
      <Toaster />
      <div className="fixed bottom-2 right-2 left-auto top-auto z-50 flex gap-1 items-center">
        <span>
          <img
            height={20}
            width={80}
            src="http://visitor-badge.laobi.icu/badge?page_id=nith_portal.visitor-badge"
            alt="Visitor counter"
            className="inline-block font-inherit h-4"
            loading="lazy"
          />
        </span>
      </div>
    </QueryClientProvider>
  );
}

export function Provider({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      themes={all_themes as unknown as string[]}
      defaultTheme="system"
      {...props}
    >
      <Consumer>{children}</Consumer>
    </NextThemesProvider>
  );
}
