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
    if (!session) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    await dbConnect();
    const adminUser = await UserModel.findById(session.user.id);
    if (!adminUser) {
      return {
        success: false,
        message: "User not found",
      };
    }
    // must be admin
    if (!adminUser.roles.includes("admin")) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    const user = await await UserModel.findOne({
      $or: [{ rollNo: userId }, { _id: session.user.id }],
    });
    // cannot remove admin role from the only admin
    if (data?.roles && data?.roles?.includes("admin")) {
      if (user.roles.includes("admin")) {
        const adminCount = await UserModel.countDocuments({
          roles: "admin",
        });
        if (adminCount === 1) {
          return {
            success: false,
            message: "Cannot remove admin role from the only admin",
          };
        }
      }
    }
    user.roles = data.roles;
    user.department = data.department;
    await user.save();
    // update department in result collection
    if (data?.department) {
      await ResultModel.findOneAndUpdate(
        { rollNo: user.rollNo },
        { branch: data.department }
      );
    }

    revalidatePath("/admin/users", "page");
    revalidatePath(`/admin/users/${userId}/update`, "page");

    return {
      success: true,
      message: "Roles updated",
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

