"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "src/lib/auth-server";
import dbConnect from "src/lib/dbConnect";
import ResultModel from "src/models/result";
import UserModel, { type UserWithId } from "src/models/user";

export async function updateUser(userId: string, data: Partial<UserWithId>) {
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
export async function getUser(userId: string): Promise<UserWithId | null> {
  try {
    await dbConnect();
    const user = await UserModel.findOne({
      $or: [{ rollNo: userId }, { _id: userId }],
    });
    if (!user) {
      return null;
    }
    return Promise.resolve(JSON.parse(JSON.stringify(user)));
  } catch (error) {
    console.log(error);
    return Promise.resolve(null);
  }
}
