// provider.tsx
"use client";
import useNotificationChecker from '@/hooks/useNotificationChecker';
import Aos from 'aos';
import "aos/dist/aos.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { Next13ProgressBar } from 'next13-progressbar';
import { useEffect } from "react";
import { Toaster as HotToaster } from "react-hot-toast";
import { Gradient } from "whatamesh";

import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}


export function Provider({ children }: { children: React.ReactNode }) {
    useNotificationChecker();

    useEffect(() => {
        Aos.init({
            duration: 1000,
            once: true,
            easing: 'ease-in-out',
        });
        const gradient = new Gradient();
        gradient.initGradient("#gradient-canvas");
    }, [])
    return <SessionProvider>
        <canvas id="gradient-canvas" data-transition-in className="fixed inset-0 -z-[1]" />
        {children}
        <Next13ProgressBar height="4px" color="hsl(var(--primary))" options={{ showSpinner: true, trickle: true }} showOnShallow={true} />
        <HotToaster
            position="bottom-right"
            toastOptions={{
                // Define default options
                duration: 2500,
            }}
        />
    </SessionProvider>;
}

export function GoBackButton(props:ButtonProps) {

    return (
        <Button rounded="full" variant="default_light" width="sm" size="lg" {...props}>
            <ArrowLeft/>
            Go Back
    </Button>
    )
}