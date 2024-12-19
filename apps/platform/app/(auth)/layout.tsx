"use client";

import React from "react";
import { Gradient } from "whatamesh";

export default function Layout({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
  }, []);

  return (
    <>
      <canvas
        id="gradient-canvas"
        data-transition-in
        className="fixed inset-0"
      />
      <div className="flex min-h-screen flex-col items-center justify-between p-6 md:p-12 lg:p-24 @container space-y-4">
        {children}
      </div>
    </>
  );
}
