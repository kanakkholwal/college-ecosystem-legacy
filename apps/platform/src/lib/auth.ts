import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin, username } from "better-auth/plugins";
import { ROLES } from "~/constants";
import {
  getDepartmentByRollNo,
  isValidRollNumber,
} from "~/constants/departments";
import { db } from "~/db/connect";
import { accounts, sessions, users, verifications } from "~/db/schema";
import type { ResultType } from "~/types/result";
import { mailFetch, serverFetch } from "./server-fetch";

const ALLOWED_ROLES = [ROLES.STUDENT, ROLES.FACULTY, ROLES.STAFF];
const ALLOWED_GENDERS = ["male", "gender", "not_specified"];
// const VERIFY_EMAIL_PATH_PREFIX = "/sign-in?tab=verify-email&token=";
const VERIFY_EMAIL_PATH_PREFIX = "/verify-email?token=";

const baseUrl = process.env.BASE_URL || process.env.VERCEL_URL;

export const auth = betterAuth({
  appName: "College Platform",
  baseURL: baseUrl,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users,
      sessions,
      accounts,
      verifications,
    },
    //if all of them are just using plural form, you can just pass the option below
    usePlural: true,
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const info = await getUserInfo(user.email);

          return {
            data: {
              ...user,
              ...info,
            },
          };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      const verification_url = `${baseUrl}${VERIFY_EMAIL_PATH_PREFIX}${token}`;
      try {
        const response = await mailFetch<{
          data: string[] | null;
          error?: string | null | object;
        }>("/api/send", {
          method: "POST",
          body: JSON.stringify({
            template_key: "reset-password",
            targets: [user.email],
            subject: "Reset Password",
            payload: {
              name: user.name,
              email: user.email,
              reset_link: verification_url,
            },
          }),
        });
        if (response.error) {
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Error sending email",
          });
        }
        console.log(response);
      } catch (err) {
        console.error(err);
        throw new APIError("INTERNAL_SERVER_ERROR", {
          message: "Error sending email",
        });
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verification_url = `${baseUrl}${VERIFY_EMAIL_PATH_PREFIX}${token}`;
      try {
        const response = await mailFetch<{
          data: string[] | null;
          error?: string | null | object;
        }>("/api/send", {
          method: "POST",
          body: JSON.stringify({
            template_key: "welcome_verify",
            targets: [user.email],
            subject: "Welcome to College Platform",
            payload: {
              platform_name: "College Platform",
              name: user.name,
              email: user.email,
              verification_url: verification_url,
            },
          }),
        });
        if (response.error) {
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Error sending email",
          });
        }
        console.log(response);
      } catch (err) {
        console.error(err);
        throw new APIError("INTERNAL_SERVER_ERROR", {
          message: "Error sending email",
        });
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      mapProfileToUser: async (profile) => {
        return {
          image: profile.picture,
        };
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: false,
      },
      other_roles: {
        type: "string[]",
        required: true,
        input: true,
      },
      other_emails: {
        type: "string[]",
        required: false,
        input: false,
      },
      hostelId: {
        type: "string",
        required: false,
        input: false,
      },
      gender: {
        type: "string",
        input: true,
      },
      username: {
        type: "string",
        required: true,
        unique: true,
        input: true,
      },
      department: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === "production",
      domain: process.env.NODE_ENV === "production" ? "nith.eu.org" : undefined,
    },
  },
  plugins: [
    username(),
    admin({
      defaultRole: "user",
      adminRole: ["admin"],
      defaultBanExpiresIn: 60 * 60 * 24 * 7, // 1 week
    }),
    nextCookies(),
  ], // make sure this is the last plugin (nextCookies) in the array
});



type getUserInfoReturnType = {
  email: string;
  username: string;
  other_roles: string[];
  department: string;
  name?: string;
  emailVerified: boolean;
  gender: string;
  other_emails?: string[];
};

type FacultyType = {
  name: string;
  email: string;
  department: string;
};

async function getUserInfo(email: string): Promise<getUserInfoReturnType> {
  const username = email.split("@")[0];
  const isStudent = isValidRollNumber(username);

  if (isStudent) {
    console.log("Student");
    const res = await serverFetch<{
      message: string;
      data: ResultType | null;
      error?: string | null;
    }>("/api/results/:rollNo/get", {
      method: "GET",
      params: {
        rollNo: username,
      },
    });
    const response = res.data;
    console.log(res);
    console.log(response?.data ? "has result" : "No result");

    if (!response?.data) {
      throw new APIError("UPGRADE_REQUIRED", {
        message: "Result not found for the given roll number | Contact admin",
      });
    }
    console.log(response.data?.gender);

    return {
      other_roles: [ROLES.STUDENT],
      department: getDepartmentByRollNo(username) as string,
      name: response.data.name.toUpperCase(),
      emailVerified: true,
      email,
      username,
      gender: response.data.gender || "not_specified",
    };
  }
  const { data: response } = await serverFetch<{
    message: string;
    data: FacultyType | null;
    error?: string | null;
  }>("/api/faculties/search/:email", {
    method: "POST",
    params: {
      email,
    },
  });
  const faculty = response?.data;
  console.log(faculty ? "is faculty" : "Not faculty");

  if (faculty) {
    console.log("Faculty");
    console.log(faculty.email);
    return {
      other_roles: [ROLES.FACULTY],
      department: faculty.department,
      name: faculty.name.toUpperCase(),
      emailVerified: true,
      email,
      username,
      gender: "not_specified",
    };
  }
  console.log("Other:Staff");
  console.log(email);
  return {
    other_roles: [ROLES.STAFF],
    department: "Staff",
    email,
    emailVerified: true,
    username,
    gender: "not_specified",
  };
}

export type Session = typeof auth.$Infer.Session;
