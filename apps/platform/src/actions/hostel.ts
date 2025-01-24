"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { ROLES } from "~/constants";
import type { emailSchema } from "~/constants/hostel_n_outpass";
import {
  createHostelSchema,
  createHostelStudentSchema,
  updateHostelSchema,
  updateHostelStudentSchema,
} from "~/constants/hostel_n_outpass";
import { getSession } from "~/lib/auth-server";
import dbConnect from "~/lib/dbConnect";
import serverApis from "~/lib/server-apis";
import {
  HostelModel,
  HostelStudentModel,
  type HostelType,
  type HostelStudentType,
  type HostelTypeWithStudents,
  type IHostelType,
} from "~/models/hostel_n_outpass";
import ResultModel, { type ResultTypeWithId } from "~/models/result";
import { getUserByEmail } from "./user";
import mongoose from "mongoose";

const allowedRolesForHostel = [
  ROLES.ADMIN,
  ROLES.STUDENT,
  ROLES.ASSISTANT_WARDEN,
  ROLES.WARDEN,
];
type allowedRolesForHostelType = (typeof allowedRolesForHostel)[number];
/*
    Hostel Actions
*/

export async function createHostel(data: z.infer<typeof createHostelSchema>) {
  try {
    const response = createHostelSchema.safeParse(data);
    if (!response.success) {
      return { error: response.error };
    }
    await dbConnect();
    const newHostel = new HostelModel(data);
    await newHostel.save();
    return { success: true };
  } catch (err) {
    return { error: err };
  }
}

export async function createHostelStudent(
  data: z.infer<typeof createHostelStudentSchema>
) {
  try {
    const response = createHostelStudentSchema.safeParse(data);
    if (!response.success) {
      return { error: response.error };
    }
    await dbConnect();
    const newStudent = new HostelStudentModel(data);
    await newStudent.save();
    return { success: true };
  } catch (err) {
    return { error: err };
  }
}

export async function updateHostel(
  slug: string,
  data:
    | Partial<z.infer<typeof updateHostelSchema>>
    | z.infer<typeof updateHostelStudentSchema>,
  studentsOnly?: boolean
) {
  try {
    if (studentsOnly) {
      const response = updateHostelStudentSchema.safeParse(data);
      if (!response.success) {
        return Promise.reject("Invalid schema has passed");
      }
    } else {
      const response = updateHostelSchema.safeParse(data);
      if (!response.success) {
        return Promise.reject("Invalid schema has passed");
      }
    }
    console.log("valid schema");

    const hostel = (await HostelModel.findOne({
      slug,
    }).lean()) as IHostelType | null;
    if (!hostel) {
      return Promise.reject("Hostel not found");
    }

    await dbConnect();
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let changes = { ...data } as any;

    // Convert email list to ObjectId
    if (data?.students) {
      const students = await HostelStudentModel.find({
        email: { $in: data.students },
      })
        .select("_id")
        .lean();

      if (students.length !== (data.students ?? []).length) {
        console.log("syncHostelStudents");
        const response = await syncHostelStudents(
          (hostel._id as string).toString(),
          data.students
        );

        if (!response.success) {
          console.log("Failed to sync students", response.error);
          return Promise.reject(response.error);
        }

        if (response?.data) {
          changes.students = response.data.map(
            (student) => new mongoose.Types.ObjectId(student as string)
          );
        } else {
          const { students, ...rest } = changes;
          changes = rest; // Remove `students` if no valid IDs are found
        }
      } else {
        // Use the found student ObjectIds
        changes.students = students.map((student) => student._id);
      }
    }

    await HostelModel.findOneAndUpdate({ slug }, changes, { new: true }).exec();
    return Promise.resolve(`${hostel.name} has been updated`);
  } catch (err) {
    console.log("Failed to update hostel", err);
    return Promise.reject(err?.toString());
  } finally {
    revalidatePath(`/admin/hostels/${slug}`);
  }
}

async function syncHostelStudents(
  hostelId: string,
  student_emails: z.infer<typeof emailSchema>[]
) {
  try {
    const hostel = (await HostelModel.findById(hostelId)) as IHostelType;
    const updates = [];
    const result_updates = [];

    if (student_emails) {
      const students = await HostelStudentModel.find({
        email: { $in: student_emails },
        $nor: [{ hostelId: hostel._id }],
      }).lean();

      for await (const student_email of student_emails) {
        const student = students.find(
          (student) => student.email === student_email
        );
        if (student) {
          updates.push({
            updateOne: {
              filter: {
                email: student_email,
              },
              update: {
                $set: {
                  hostelId: hostel._id,
                  gender: hostel.gender,
                  roomNumber: "UNKNOWN",
                  position: "none",
                },
              },
            },
          });
          if (student.gender !== "not_specified") {
            result_updates.push({
              updateOne: {
                filter: {
                  rollNo: student_email.split("@")[0],
                },
                update: {
                  $set: {
                    gender: hostel.gender,
                  },
                },
              },
            });
          }
        } else {
          const result = (await ResultModel.findOne({
            rollNo: student_email.split("@")[0],
          })
            .lean()
            .exec()) as unknown as ResultTypeWithId;
          if (!result) {
            console.log("result of Student not found", student_email);
            continue;
          }
          if (
            result.gender !== hostel.gender &&
            result.gender !== "not_specified"
          ) {
            console.log("Student gender doesn't match", result);
            continue;
          }
          const studentUser = await getUserByEmail(student_email);

          updates.push({
            insertOne: {
              document: {
                rollNumber: result.rollNo,
                userId: studentUser?.id || null,
                name: result.name,
                gender:
                  result.gender !== "not_specified"
                    ? result.gender
                    : hostel.gender,
                email: student_email,
                hostelId: hostel._id,
                roomNumber: "UNKNOWN",
                position: "none",
              },
            },
          });

          if (result?.gender === "not_specified") {
            result_updates.push({
              updateOne: {
                filter: {
                  rollNo: student_email.split("@")[0],
                },
                update: {
                  $set: {
                    gender: hostel.gender,
                  },
                },
              },
            });
          }
        }
      }
    }
    if (updates.length > 0) {
      await HostelStudentModel.bulkWrite(updates);
    }
    if (result_updates.length > 0) {
      await ResultModel.bulkWrite(result_updates);
    }
    const output = await HostelStudentModel.find({
      hostelId,
    })
      .select("_id")
      .lean()
      .exec();

    return {
      success: true,
      data: output.map((student) => student?._id?.toString()),
    };
  } catch (err) {
    return { success: false, error: err?.toString() };
  }
}

export async function getHostel(slug: string): Promise<{
  success: boolean;
  hostel: HostelTypeWithStudents | null;
  error?: object;
}> {
  try {
    await dbConnect();
    const hostel = await HostelModel.findOne({ slug })
      .populate("students")
      .lean();
    if (!hostel) {
      return Promise.resolve({ success: false, hostel: null });
    }
    return Promise.resolve({
      success: true,
      hostel: JSON.parse(JSON.stringify(hostel)),
    });
  } catch (err) {
    return Promise.reject({
      success: false,
      hostel: null,
      error: JSON.parse(JSON.stringify(err)),
    });
  }
}

interface getHostelByUserType {
  success: boolean;
  message: string;
  hostel: HostelType | null;
  hosteler: HostelStudentType | null;
  inCharge: boolean;
}

export async function getHostelByUser(
  slug?: string
): Promise<getHostelByUserType> {
  try {
    const session = await getSession();
    if (!session) {
      return Promise.resolve({
        success: false,
        hostel: null,
        message: "Session not found",
        hosteler: null,
        inCharge: false,
      });
    }
    const is_allowed =
      session?.user?.other_roles?.some((role) =>
        allowedRolesForHostel.includes(role as allowedRolesForHostelType)
      ) ||
      allowedRolesForHostel.includes(
        session?.user?.role as allowedRolesForHostelType
      );
    if (!is_allowed) {
      return Promise.resolve({
        success: false,
        hostel: null,
        message: "User is not access hostel features",
        hosteler: null,
        inCharge: false,
      });
    }
    await dbConnect();
    // (special) : if user is admin
    if (session.user.role === ROLES.ADMIN && slug) {
      const hostel = await HostelModel.findOne({ slug }).lean();
      if (!hostel) {
        return Promise.resolve({
          success: false,
          hostel: null,
          message: "Hostel not found",
          hosteler: null,
          inCharge: true,
        });
      }
      return Promise.resolve({
        success: true,
        hostel: JSON.parse(JSON.stringify(hostel)),
        message: "User is allowed to access hostel features",
        hosteler: null,
        inCharge: true,
      });
    }

    // Check if user is a student
    const hostelerStudent = (await HostelStudentModel.findOne({
      email: session.user.email,
      userId: session.user.id,
    })
      .populate("hostelId", "_id name slug gender")
      .lean()) as HostelStudentType | null;
    if (hostelerStudent) {
      // Check if user is a student of the hostel
      const hostel = await HostelModel.findById(
        hostelerStudent.hostelId
      ).lean();
      if (!hostel) {
        return Promise.resolve({
          success: false,
          hostel: null,
          message: "Hostel not found",
          hosteler: JSON.parse(JSON.stringify(hostelerStudent)),
          inCharge: false,
        });
      }
      return Promise.resolve({
        success: true,
        hostel: JSON.parse(JSON.stringify(hostel)),
        message: "User is allowed to access hostel features",
        hosteler: JSON.parse(JSON.stringify(hostelerStudent)),
        inCharge: false,
      });
    }
    // Check if user is a warden or administrator
    const hostel = await HostelModel.findOne({
      $or: [
        { "warden.email": session.user.email as string },
        { "warden.email": { $in: session.user?.other_emails || [] } },
        { "administrators.email": session.user.email as string },
        { "administrators.email": { $in: session.user?.other_emails || [] } },
      ],
    }).lean();
    if (!hostel) {
      return Promise.resolve({
        success: false,
        hostel: null,
        message: "Hostel not found",
        hosteler: null,
        inCharge: false,
      });
    }
    return Promise.resolve({
      success: true,
      hostel: JSON.parse(JSON.stringify(hostel)),
      message: "User is allowed to access hostel features",
      hosteler: null,
      inCharge: true,
    });
  } catch (err) {
    console.log("Failed to fetch hostel", err);
    return Promise.reject("Failed to fetch hostel");
  } finally {
    // revalidatePath("/hostel");
  }
}

export async function getHostels(): Promise<{
  success: boolean;
  data: IHostelType[];
}> {
  try {
    await dbConnect();
    const hostels = await HostelModel.find({}).lean();
    return Promise.resolve({
      success: true,
      data: JSON.parse(JSON.stringify(hostels)),
    });
  } catch (err) {
    return Promise.resolve({ success: false, data: [] });
  }
}

export async function importHostelsFromSite() {
  try {
    const res = await serverApis.hostels.getAll();
    console.log(res);
    const response = res.data;
    if (res?.error || response?.error || !response?.data) {
      return Promise.reject(
        res?.error?.message || "Some error occurred while fetching hostels"
      );
    }
    await dbConnect();
    const hostels = response?.data?.hostels.map((hostel) => {
      return {
        name: hostel.name,
        slug: hostel.slug,
        gender: hostel.gender,
        warden: hostel.warden,
        administrators: hostel.administrators,
        students: [],
      };
    });
    await HostelModel.insertMany(hostels);

    return Promise.resolve(`${hostels.length} hostels imported`);
  } catch (err) {
    console.log("Failed to import hostels", err);
    return Promise.reject("Failed to import hostels");
  } finally {
    revalidatePath("/admin/hostels");
  }
}
