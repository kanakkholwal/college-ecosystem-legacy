import { createFetch } from "@better-fetch/fetch";

const baseURL = process.env.NEXT_PUBLIC_BASE_SERVER_URL;
const SERVER_IDENTITY = process.env.NEXT_PUBLIC_SERVER_IDENTITY;

if (!SERVER_IDENTITY) {
  throw new Error("Missing environment variables for server identity");
}
if (!baseURL) {
  throw new Error("Missing environment variables for base URL");
}
/**
 *  a fetch instance to communicate with the server with the necessary headers
 */

export const apiFetch = createFetch({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL,
  headers: {
    "Content-Type": "application/json",
    Origin: process.env.NEXT_PUBLIC_BASE_URL,
  },
});

/**
 *  a fetch instance to communicate with the server with the necessary headers
 */

export const serverFetch = createFetch({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    "X-IDENTITY-KEY": SERVER_IDENTITY,
    Origin: process.env.NEXT_PUBLIC_BASE_URL,
  },
});

export const authHeaders = {
  "Content-Type": "application/json",
  "X-IDENTITY-KEY": SERVER_IDENTITY,
  Origin: process.env.NEXT_PUBLIC_BASE_URL,
};
