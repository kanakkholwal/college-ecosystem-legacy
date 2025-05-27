"use server";
import { headers } from "next/headers";
import { auth } from "src/lib/auth";

export const getSession = async () => {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};
