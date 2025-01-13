"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createHostelSchema,
  createHostelStudentSchema,
  updateHostelSchema,
} from "~/constants/hostel_n_outpass";
import dbConnect from "~/lib/dbConnect";
import serverApis from "~/lib/server-apis";
import {
  HostelModel,
  HostelStudentModel,
  type HostelType,
  type IHostelType,
  OutPassModel,
} from "~/models/hostel_n_outpass";
import ResultModel from "~/models/result";

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
  data: Partial<z.infer<typeof updateHostelSchema>>
) {
  try {
    const hostel = await HostelModel.findOne({ slug }).lean() as IHostelType | null;
    if (!hostel) {
      return { success: false, error: "Hostel not found" };
    }
    const response = updateHostelSchema.safeParse(data);
    if (!response.success) {
      return { success: false, error: response.error };
    }
    await dbConnect();
    if (data?.students) {
      const students = await HostelStudentModel.find({ email: { $in: data?.students } }).lean();
      if (students.length !== (data.students ?? []).length) {
        console.log("syncHostelStudents")
        const response = await syncHostelStudents((hostel._id as string).toString(), data.students);
        if (!response.success) {
          return { success: false, error: response.error };
        }
      }
    }

    await HostelModel.findOneAndUpdate({ slug }, data, { new: true }).exec();
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  } finally {
    revalidatePath(`/admin/hostels/${slug}`);
  }
}

// ends with @nith.ac.in
const emailSchema = z
  .string()
  .email()
  .refine((email) => email.endsWith("@nith.ac.in"), {
    message: "Email should end with @nith.ac.in",
  });

async function syncHostelStudents(hostelId: string, student_emails: z.infer<typeof emailSchema>[]) {
  try {
    const hostel = await HostelModel.findById(hostelId) as IHostelType;
    const updates = [];
    const result_updates = []
    if (student_emails) {
      const students = await HostelStudentModel.find({ email: { $in: student_emails } }).lean();

      for (const student_email of student_emails) {
        const student = students.find(student => student.email === student_email);
        if (student) {
          updates.push({
            updateOne: {
              filter: {
                email: student_email
              },
              update: {
                $set: {
                  hostelId: hostel._id,
                  gender: hostel.gender,
                }
              },
            }
          })
          if (student.gender !== "not_specified") {
            result_updates.push({
              updateOne: {
                filter: {
                  email: student_email.split('@')[0]
                },
                update: {
                  $set: {
                    gender: hostel.gender
                  }
                }
              }
            })
          }
        } else {
          const response = await serverApis.results.getResultByRollNo(student_email.split('@')[0]);
          if (response?.error || !response?.data) {
            console.log('Error fetching student data', response?.error)
            continue;
          }
          const result = response.data;
          if (!result) {
            console.log('result of Student not found', student_email)
            continue;
          }
          if (result.data.gender !== hostel.gender && result.data.gender !== "not_specified") {
            console.log("Student gender doesn't match", result.data)
            continue;
          }

          updates.push({
            insertOne: {
              document: {
                rollNumber: result.data.rollNo,
                userId: null,
                name: result.data.name,
                gender: result.data.gender !== "not_specified" ? result.data.gender : hostel.gender,
                email: student_email,
                hostelId: hostel._id,
                roomNumber: "",
                position: "",

              }
            },
          })

          if (result.data?.gender === "not_specified") {
            result_updates.push({
              updateOne: {
                filter: {
                  email: student_email.split('@')[0]
                },
                update: {
                  $set: {
                    gender: hostel.gender
                  }
                },
              }
            })
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
    return { success: true }
  }
  catch (err) {
    return { success: false, error: err }
  }

}

export async function getHostel(slug: string): Promise<{
  success: boolean;
  hostel: HostelType | null;
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
    // console.log(res)
    const response = res.data;
    if (res?.error || response?.error || !response?.data) {
      return Promise.reject(response);
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

    return {
      error: false,
      data: hostels,
      message: "Hostels imported successfully",
    };
  } catch (err) {
    return Promise.reject({
      error: true,
      data: JSON.parse(JSON.stringify(err)),
      message: "Failed to import hostels",
    });
  } finally {
    revalidatePath("/admin/hostels");
  }
}

/*
    OutPass Actions
*/

export async function createOutPass() {
  try {
    await dbConnect();
    const newOutPass = new OutPassModel();
    await newOutPass.save();
    return { success: true };
  } catch (err) {
    return { error: err };
  }
}
