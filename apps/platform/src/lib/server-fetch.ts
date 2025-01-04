import { createFetch } from "@better-fetch/fetch";

/**
 *  a fetch instance to communicate with the server with the necessary headers
 */

export const serverFetch = createFetch({
    baseURL: process.env.BASE_SERVER_URL,
    headers: {
        "Content-Type": "application/json",
        "X-IDENTITY-KEY": process.env.SERVER_IDENTITY,
    },
})

export const mailFetch = createFetch({
    baseURL: process.env.BASE_MAIL_SERVER_URL,
    headers: {
        "Content-Type": "application/json",
        "X-IDENTITY-KEY": process.env.SERVER_IDENTITY,
    },
})

