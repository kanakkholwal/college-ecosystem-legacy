import { createFetch } from "@better-fetch/fetch";


const baseURL = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_BASE_URL;

if (!baseURL) {
  throw new Error("Missing environment variables");
}
/**
 *  a fetch instance to communicate with the server with the necessary headers
 */

export const apiFetch = createFetch({
  baseURL,
  headers: {
      "Content-Type": "application/json",
      Origin: process.env.NEXT_PUBLIC_BASE_URL,
  },
});
