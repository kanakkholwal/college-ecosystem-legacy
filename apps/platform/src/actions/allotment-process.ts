"use server";

import mongoose from "mongoose";
import z from "zod";
import { getStudentsByHostelId } from "~/actions/hostel";
import {
  SLOT_CAPACITY,
  SLOT_DURATION,
  SLOT_TIME_GAP,
} from "~/constants/allotment-process";
import dbConnect from "~/lib/dbConnect";
import { redis } from "~/lib/redis";
import { AllotmentSlotModel, type HostelRoomJson, HostelRoomModel } from "~/models/allotment";
import { HostelModel } from "~/models/hostel_n_outpass";

const allotmentProcessSchema = z.object({
  status: z.enum(["open", "closed", "paused", "waiting", "completed"]),
  hostelId: z.string(),
});

export async function getAllotmentProcess(hostelId: string) {
  const allotmentProcess = await redis.get(`allotment-process-${hostelId}`);
  if (!allotmentProcess) {
    const payload = {
      status: "waiting",
      hostelId,
    };
    await redis.set(`allotment-process-${hostelId}`, JSON.stringify(payload));
    return payload;
  }
  return JSON.parse(allotmentProcess);
}

export async function updateAllotmentProcess(
  hostelId: string,
  payload: z.infer<typeof allotmentProcessSchema>
) {
  // verify payload
  const validatedPayload = allotmentProcessSchema.safeParse(payload);
  if (validatedPayload.success === false) {
    return {
      error: true,
      message: "Invalid payload",
      data: validatedPayload.error.format(),
    };
  }
  const { status } = validatedPayload.data;
  await redis.set(
    `allotment-process-${hostelId}`,
    JSON.stringify(validatedPayload.data)
  );

  return {
    error: false,
    message: "Allotment process updated successfully",
    data: validatedPayload.data,
  };
}
// ⏳ Manage Allotment Slots
export async function startAllotment(hostelId: string) {
  await redis.set(
    `allotment-process-${hostelId}`,
    JSON.stringify({ status: "open", hostelId })
  );
  return { error: false, message: "Allotment process started" };
}

export async function pauseAllotment(hostelId: string) {
  await redis.set(
    `allotment-process-${hostelId}`,
    JSON.stringify({ status: "paused", hostelId })
  );
  return { error: false, message: "Allotment process paused" };
}

export async function closeAllotment(hostelId: string) {
  await redis.set(
    `allotment-process-${hostelId}`,
    JSON.stringify({ status: "closed", hostelId })
  );
  return { error: false, message: "Allotment process closed" };
}

const slotSchema = z.object({
  startingTime: z.string().datetime(),
  endingTime: z.string().datetime(),

  allotedFor: z.array(z.string()),
  hostelId: z.string(),
});

/*
  create Allotment Slot for an hostel
  @param {string} hostelId - The id of the hostel
  @param {object} payload - The payload for the allotment slot
*/

export async function createAllotmentSlot(
  hostelId: string,
  payload: z.infer<typeof slotSchema>
) {
  // verify payload
  const validatedPayload = slotSchema.safeParse(payload);
  if (validatedPayload.success === false) {
    return {
      error: true,
      message: "Invalid payload",
      data: validatedPayload.error.format(),
    };
  }
  await dbConnect();

  const hostel = await HostelModel.findById(hostelId);
  if (!hostel) {
    return {
      error: true,
      message: "Hostel Not Found",
      data: null,
    };
  }

  const payloadData = validatedPayload.data;

  const allotmentSlot = await AllotmentSlotModel.create({
    ...payloadData,
    hostelId,
  });

  return {
    error: false,
    message: "Slot created successfully",
    data: null,
  };
}

// create Allotment Slots for an hostel
export async function distributeSlots(hostelId: string) {
  try {
    await dbConnect();
    // get all students sorted by cgpi
    const hostelStudents = await getStudentsByHostelId(hostelId);
    if (!hostelStudents) {
      return {
        error: true,
        message: "Hostel Not Found",
        data: null,
      };
    }
    // create slot batches of `SLOT_CAPACITY` students
    const slots = [];

    for (let i = 0; i < hostelStudents.length; i += SLOT_CAPACITY) {
      const slot = hostelStudents.slice(i, i + SLOT_CAPACITY);
      slots.push(slot);
    }
    // create allotment slots for each batch and assign them to the students within the batch and gap of `SLOT_TIME_GAP` minutes
    const allotmentSlots = [];
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const slotDurationInMinutes = SLOT_DURATION + SLOT_TIME_GAP;
    let slotStartTime = currentTimeInMinutes;
    for await (const slot of slots) {
      const slotEndTime = slotStartTime + SLOT_DURATION;
      const startTime = new Date(currentTime);
      startTime.setMinutes(slotStartTime);
      const endTime = new Date(currentTime);
      endTime.setMinutes(slotEndTime);

      const allotmentSlot = await AllotmentSlotModel.create({
        startingTime: startTime,
        endingTime: endTime,
        allotedFor: slot.map((student) => student._id),
        hostelId,
      });

      allotmentSlots.push(allotmentSlot);
      slotStartTime += slotDurationInMinutes;
    }

    // update the allotment process to open
    // await redis.set(`allotment-process-${hostelId}`, JSON.stringify({ status: "open", hostelId }));

    return {
      error: false,
      message: "Slots created successfully",
      data: allotmentSlots,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Internal Server Error",
      data: null,
    };
  }
}

// get upcoming slots for an hostel
export async function getUpcomingSlots(hostelId: string) {
  try {
    await dbConnect();

    const upcomingSlots = await AllotmentSlotModel.find({
      hostelId,
      startingTime: { $gte: new Date() },
    }).sort({
      startingTime: 1,
    })
    // console.log(upcomingSlots)
    return {
      error: false,
      message: "Slots fetched successfully",
      data: upcomingSlots,
    };

  }catch(err){
    console.log(err);
    return {
      error: true,
      message: "Internal Server Error",
      data: [],
    };
  }
}

// add rooms for the hostel

const hostelRoomSchema = z.object({
  roomNumber: z.string(),
  capacity: z.number().min(1).max(7),
  occupied_seats: z.number().default(0),
  hostStudent: z.string().nullable(),
  isLocked: z.boolean().default(false),
  hostel: z.string(),
});

const roomsSchema = z.array(hostelRoomSchema);

export async function addHostelRooms(
  hostelId: string,
  rooms: z.infer<typeof roomsSchema>
) {
  // verify payload
  const validatedPayload = roomsSchema.safeParse(rooms);
  if (validatedPayload.success === false) {
    return {
      error: true,
      message: "Invalid payload",
      data: validatedPayload.error.format(),
    };
  }
  const validatedRooms = validatedPayload.data;
  try {
    await dbConnect();
    // check if hostel exists
    const hostel = await HostelModel.findById(hostelId);
    if (!hostel) {
      return {
        error: true,
        message: "Hostel Not Found",
        data: null,
      };
    }

    const newRooms = await HostelRoomModel.insertMany(validatedRooms);
    // update the allotment process to open
    return {
      error: false,
      message: "Rooms added successfully",
      data: null,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Internal Server Error",
      data: null,
    };
  }
}

export async function getHostelRooms(hostelId: string): Promise<{
  error: boolean;
  message: string;
  data: HostelRoomJson[];
}> {
  try {
    await dbConnect();
    // check if hostel exists
    const hostel = await HostelModel.findById(hostelId);
    if (!hostel) {
      return {
        error: true,
        message: "Hostel Not Found",
        data: [],
      };
    }

    const rooms = await HostelRoomModel.aggregate([
      { 
        $match: { hostel: new mongoose.Types.ObjectId(hostelId) } // Ensure hostelId is an ObjectId
      },
      {
        $addFields: {
          numericRoomNumber: {
            $toInt: {
              $arrayElemAt: [
                { $split: [{ $replaceAll: { input: "$roomNumber", find: "G-", replacement: "" } }, "-"] },
                0
              ]
            }
          }
        }
      },
      { $sort: { numericRoomNumber: 1 } }, // Sort numerically in descending order
      { $project: { numericRoomNumber: 0 } } // Exclude extracted field from output
    ]);

    // console.log(rooms)

    return {
      error: false,
      message: "Rooms fetched successfully",
      data: JSON.parse(JSON.stringify(rooms)),
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Internal Server Error",
      data: [],
    };
  }
}
