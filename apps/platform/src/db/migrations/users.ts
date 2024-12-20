import { eq } from 'drizzle-orm/expressions';
import { db } from "src/db/connect";
import { users } from "src/db/schema";
import { auth } from "src/lib/auth";
import dbConnect from "src/lib/dbConnect";
import UserModel from "src/models/user";

// import { loadEnvConfig } from "@next/env";
// const projectDir = process.cwd();
// loadEnvConfig(projectDir);


export async function mongoToPgDatabase(ENV:"production" | "testing" = "production") {
    try {

        const time = new Date();
        await dbConnect(ENV);
        console.log("MongoDB connected successfully!");

        /** MIGRATE USERS */
        const mongoUsers = await UserModel.find().sort({ createdAt: 1 })
            .lean();
        console.log("mongoUsers:", mongoUsers.length);
        if (mongoUsers.length === 0) {
            console.log("No users to migrate!");
            return {
                    result: "success",
                    message: "No users to migrate",
                }
            
        }
        let migratedUsers = 0;
        for await (const user of mongoUsers) {
            if (user.rollNo === "21dec026" || user.email === "kanakkholwal@gmail.com") {
                continue;
            }

            // Check if user already exists in the database
            const existingUser = await db
                .select()
                .from(users)
                .where(eq(users.email, user.email))
                .limit(1);

            if (existingUser.length > 0) {
                console.log(`User with email ${user.email} already exists. Skipping migration.`);
                continue;
            }
            console.log("Migrating user:", user.rollNo);

            await auth.api.signUpEmail({
                body: {
                    email: user.email,
                    password: user.email + user.password,
                    name: `${user.name} ${user?.lastName || ""}`,
                    username: user.rollNo,
                    image: user.profilePicture,
                    gender: "not_specified",
                    role: user.rollNo === "21dec026" ? "admin" : "user",
                    other_roles: [...user.roles.filter((role: string) => role !== "admin")],
                    department: user.department === "Mathematics & Computing" ? "Mathematics & Scientific Computing" : user.department,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    emailVerified: true,
                },
            });
            migratedUsers++;
            console.log("Migrated Users:", migratedUsers);
            console.log("Migrated remaining:", mongoUsers.length - migratedUsers);
        }

        console.log("mongoUsers migrated successfully!");

        return  {
                result: "success",
                timeTaken: `${(new Date().getTime() - time.getTime())/1000} seconds`,
            }
        }
    catch (error) {
        console.error("Error during data migration:", error);
        if (error instanceof Error) {
            return {
                    result: "fail",
                    message: error.message,

                }
        }
        return{
                result: "fail",
                message: "Internal Server Error",
            }
    }
}

