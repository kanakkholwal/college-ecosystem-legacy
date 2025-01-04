"use server";
import { getSession } from "src/lib/auth-server";

export async function updateUser(userId: string) {
  "use server";
  try {
    const session = await getSession();
    return {
      success: false,
      message: "Unauthorized",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred",
    };
  }
}
export async function getUser(userId: string){
  try {
    
    return Promise.resolve(JSON.parse(JSON.stringify({})));
  } catch (error) {
    console.log(error);
    return Promise.resolve(null);
  }
}
