// provider.tsx
"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import useNotificationChecker from '@/hooks/useNotificationChecker';
import Aos from 'aos';
import "aos/dist/aos.css";
import { ArrowLeft } from 'lucide-react';
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import Image from 'next/image';
import { Next13ProgressBar } from 'next13-progressbar';
import React, { useEffect, useState } from 'react';
import { Toaster as HotToaster } from "react-hot-toast";
import { Gradient } from "whatamesh";
import fallbackImg from "./fallback.png";


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}


export function Provider({ children }: { children: React.ReactNode }) {
    const [isLoaded, setIsLoaded] = useState<boolean>(true);
    useNotificationChecker();

    useEffect(() => {
        Aos.init({
            duration: 1000,
            once: true,
            easing: 'ease-in-out',
        });
        try {
            // Perform canvas operations here
            const gradient = new Gradient();
            gradient.initGradient("#gradient-canvas");
            // If animation loading fails, set isLoaded to false
        } catch (error) {
            setIsLoaded(false);
        }
    }, [])
    return <SessionProvider>
        {isLoaded ? (
            <canvas id="gradient-canvas" data-transition-in className="fixed inset-0 -z-[1]" />
        ) : (
            <Image width={1920} height={1280} src={fallbackImg} className="fixed inset-0 -z-[1]" alt="Fallback" />
        )}
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

export function GoBackButton(props: ButtonProps) {

    return (
        <Button rounded="full" variant="default_light" width="sm" size="lg" {...props}>
            <ArrowLeft />
            Go Back
        </Button>
    )
}