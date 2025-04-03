"use server";

import z from "zod";
import dbConnect from "~/lib/dbConnect";
import {redis} from "~/lib/redis";
import {AllotmentSlotModel} from "~/models/allotment";

import { HostelModel, HostelStudentModel } from "~/models/hostel_n_outpass";
import { HostelRoomModel, RoomMemberModel } from "~/models/allotment";


const allotmentProcessSchema = z.object({
    status: z.enum(["open", "closed","paused","waiting"]),
    hostelId: z.string(),
})

export async function getAllotmentProcess(hostelId: string) {
  const allotmentProcess = await redis.get(`allotment-process-${hostelId}`);
  if (!allotmentProcess) {
    const payload = {
      status: "waiting",
      hostelId,
    }
    await redis.set(`allotment-process-${hostelId}`, JSON.stringify(payload));
    return payload;
  }
  return JSON.parse(allotmentProcess)
}

export async function updateAllotmentProcess(hostelId: string,payload:z.infer<typeof allotmentProcessSchema>){
  // verify payload
  const validatedPayload = allotmentProcessSchema.safeParse(payload);
  if(validatedPayload.success === false){
    return {
      error: true,
      message: "Invalid payload",
      data: validatedPayload.error.format(),
    };
  }
  const { status } = validatedPayload.data;
  await redis.set(`allotment-process-${hostelId}`, JSON.stringify(validatedPayload.data));

  return {
    error: false,
    message: "Allotment process updated successfully",
    data: validatedPayload.data,
  }
}
// ⏳ Manage Allotment Slots
export async function startAllotment(hostelId: string) {
  await redis.set(`allotment-process-${hostelId}`, JSON.stringify({ status: "open", hostelId }));
  return { error: false, message: "Allotment process started" };
}

export async function pauseAllotment(hostelId: string) {
  await redis.set(`allotment-process-${hostelId}`, JSON.stringify({ status: "paused", hostelId }));
  return { error: false, message: "Allotment process paused" };
}

export async function closeAllotment(hostelId: string) {
  await redis.set(`allotment-process-${hostelId}`, JSON.stringify({ status: "closed", hostelId }));
  return { error: false, message: "Allotment process closed" };
}


const slotSchema = z.object({
  startingTime: z.string().datetime(),
  endingTime: z.string().datetime(),
  
  allotedFor: z.array(z.string()),
  hostelId: z.string(),
})

/*
  create Allotment Slot for an hostel
  @param {string} hostelId - The id of the hostel
  @param {object} payload - The payload for the allotment slot
*/

export async function createAllotmentSlot(hostelId:string,payload:z.infer<typeof slotSchema>)
{
  // verify payload
  const validatedPayload = slotSchema.safeParse(payload);
  if(validatedPayload.success === false){
    return {
      error: true,
      message: "Invalid payload",
      data: validatedPayload.error.format(),
    };
  }
  await dbConnect();

  const hostel = await HostelModel.findById(hostelId);
  if(!hostel){
    return {
      error: true,
      message:"Hostel Not Found",
      data:null
    }
  }


  const payloadData = validatedPayload.data;

  const allotmentSlot = await AllotmentSlotModel.create({
    ...payloadData,
    hostelId,
  });

  return {
    error:false,
    message:"Slot created successfully",
    data:null
  }

}


