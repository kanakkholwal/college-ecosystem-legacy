import mongoose from "mongoose";
import {} from "src/db/schema";
import { auth } from "src/lib/auth";
import dbConnect from "src/lib/dbConnect";
import UserModel from "src/models/user";

import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

// MongoDB Connection
const mongoConnect = async () => {
  await dbConnect();
  console.log("MongoDB connected successfully!");
};

// Migration Function
const migrateData = async () => {
  try {
    /** MIGRATE USERS */
    const mongoUsers = await UserModel.find().lean();
    console.log("mongoUsers:", mongoUsers.length);
    if (mongoUsers.length === 0) {
      console.log("No users to migrate!");
      return;
    }
    let migratedUsers = 0;
    for (const user of mongoUsers) {
      await auth.api.signUpEmail({
        body: {
          email: user.email,
          password: user.password,
          name: `${user.firstName} ${user.lastName}`,
          username: user.rollNo,
          image: user.profilePicture,
          gender: user.gender,
          roles: user.roles,
          department: user.department,
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
  } catch (error) {
    console.error("Error during data migration:", error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run Migration
(async () => {
  await mongoConnect();
  await migrateData();
})();
