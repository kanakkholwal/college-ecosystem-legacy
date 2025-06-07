import { createFetch } from "@better-fetch/fetch";

const serverIdentity = process.env.NEXT_PUBLIC_SERVER_IDENTITY;
const baseServerUrl = process.env.NEXT_PUBLIC_BASE_SERVER_URL;
const baseMailServerUrl = process.env.NEXT_PUBLIC_BASE_MAIL_SERVER_URL;

if (!serverIdentity) {
  throw new Error("Missing environment variables for server identity");
}
if (!baseServerUrl) {
  throw new Error("Missing environment variables for base server URL");
}
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export const authHeaders = {
  "Content-Type": "application/json",
  "X-Authorization": serverIdentity,
  Origin: baseUrl,
};
/**
 *  a fetch instance to communicate with the server with the necessary headers
 */

export const apiFetch = createFetch({
  baseURL: baseUrl,
  headers: {
    ...authHeaders,
  },
});

/**
 *  a fetch instance to communicate with the server with the necessary headers
 */

export const serverFetch = createFetch({
  baseURL:baseServerUrl,
  headers: {
    ...authHeaders,
  },
});
export const mailFetch = createFetch({
  baseURL:baseMailServerUrl,
  headers: {
    ...authHeaders,
  },
});


