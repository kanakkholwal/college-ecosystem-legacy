// provider.tsx
"use client";
import Aos from 'aos';
import "aos/dist/aos.css";
import { Next13ProgressBar } from 'next13-progressbar';
import { useEffect } from "react";


export function Provider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out',
    });
  }, [])
  return <>
    {children}
    <Next13ProgressBar height="4px" color="hsl(var(--primary))" options={{ showSpinner: true, trickle: true }} showOnShallow={true} />
  </>;
}