"use server";
import type z from "zod";
import { getHostelByUser } from "~/actions/hostel";
import { REASONS, requestOutPassSchema } from "~/constants/outpass";
// import { getSession } from "~/lib/auth-server";
import dbConnect from "~/lib/dbConnect";
import {
  OutPassModel,
  type OutPassType,
} from "~/models/hostel_n_outpass";

/*
    OutPass Actions
*/

export async function createOutPass(data: z.infer<typeof requestOutPassSchema>) {
  try {
    const validationResponse = requestOutPassSchema.safeParse(data);
    if (!validationResponse.success) {
      return Promise.reject(validationResponse.error);
    }
    // const session = await getSession()
    // if(!session){
    //   return Promise.reject("Unauthorized")
    // }
    const { success, message, hostel, hosteler } = await getHostelByUser();
    if (!success || !hosteler || !hostel) {
      return Promise.reject(message);
    }

    if(hosteler.banned){
      return Promise.reject(`${hosteler.bannedReason} till ${hosteler.bannedTill ? new Date(hosteler.bannedTill).toLocaleString() : 'N/A'}`)
    }
    if(!REASONS.includes(data.reason)){
      return Promise.reject("Invalid Reason")
    }

    // if(session.user.id !== hosteler.userId){
    //   return Promise.reject("You are not authorized to request outpass for this user")
    // }
    await dbConnect();
    const payload = {
      student: hosteler._id,
      hostel: hostel._id,
      rollNumber:hosteler.rollNumber,
      roomNumber: hosteler.roomNumber,
      address: data.address,
      reason: data.reason,
      expectedInTime: data.expectedInTime,
      expectedOutTime: data.expectedOutTime,
      status: "pending",
    }
    const newOutpass = await OutPassModel.create(payload);
    return Promise.resolve("Outpass Requested Successfully");
  } catch (err) {
    console.error(err);
    return Promise.reject(err?.toString() || "Something went wrong");
  }
}

export async function getOutPassForHosteler():Promise<OutPassType[]> {
  try {
    
    const { success, message, hostel, hosteler } = await getHostelByUser();
    if (!success || !hosteler || !hostel) {
      return Promise.reject(message);
    }
    await dbConnect();
    const outPasses = await OutPassModel.find({student: hosteler._id})
    .populate('hostel')
    .populate('student')
    .sort({createdAt: -1})
    .limit(10)
    .lean();
    return Promise.resolve(JSON.parse(JSON.stringify(outPasses)));
  } catch (err) {
    console.error(err);
    return Promise.reject(err?.toString() || "Something went wrong");
  }

}