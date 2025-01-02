"use server";
import { auth } from "src/lib/auth";
import { headers } from "next/headers";

export const getSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
};
