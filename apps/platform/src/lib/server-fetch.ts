import { createFetch } from "@better-fetch/fetch";

const BASE_SERVER_URL = process.env.BASE_SERVER_URL;
const BASE_MAIL_SERVER_URL = process.env.BASE_MAIL_SERVER_URL;
const SERVER_IDENTITY = process.env.SERVER_IDENTITY;

if(!BASE_SERVER_URL || !SERVER_IDENTITY || !BASE_MAIL_SERVER_URL) {
    throw new Error("Missing environment variables");
}

/**
 *  a fetch instance to communicate with the server with the necessary headers
 */

export const serverFetch = createFetch({
    baseURL: BASE_SERVER_URL,
    headers: {
        "Content-Type": "application/json",
        "X-IDENTITY-KEY": SERVER_IDENTITY,
        "Origin": process.env.BASE_URL,
    },
})

export const mailFetch = createFetch({
    baseURL: BASE_MAIL_SERVER_URL,
    headers: {
        "Content-Type": "application/json",
        "X-IDENTITY-KEY": SERVER_IDENTITY,
        "Origin": process.env.BASE_URL,
    },
})

