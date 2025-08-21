// sw.ts
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { NetworkOnly, Serwist } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}
declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    ...defaultCache,
    {
      matcher: ({ url }) =>
        url.hostname === "pagead2.googlesyndication.com",
      handler: new NetworkOnly(),
    },
    {
      matcher: ({ url }) =>
        url.hostname === "googleads.g.doubleclick.net",
      handler: new NetworkOnly(),
    },
    {
      matcher: ({ url }) =>
        url.hostname === "www.googletagservices.com",
      handler: new NetworkOnly(),
    },
  ],
  // importScripts: ['notifications-worker.js'], // Import the custom service worker script
});
serwist.addEventListeners();
