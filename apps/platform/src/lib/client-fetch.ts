import { createFetch } from "@better-fetch/fetch";
import { appConfig } from "~/project.config";

const SERVER_IDENTITY = process.env.NEXT_PUBLIC_SERVER_IDENTITY;


if (!SERVER_IDENTITY) {
  throw new Error("Missing environment variables for server identity");
}

export const authHeaders = {
  "Content-Type": "application/json",
  "X-IDENTITY-KEY": SERVER_IDENTITY,
  Origin: appConfig.env.baseUrl,
};
/**
 *  a fetch instance to communicate with the server with the necessary headers
 */

export const apiFetch = createFetch({
  baseURL: appConfig.env.baseUrl,
  headers: {
    ...authHeaders,
  },
});

/**
 *  a fetch instance to communicate with the server with the necessary headers
 */

export const serverFetch = createFetch({
  baseURL: appConfig.env.baseServerUrl,
  headers: {
    ...authHeaders,
  },
});


