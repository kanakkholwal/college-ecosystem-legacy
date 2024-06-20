"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "src/lib/dbConnect";
import RoomModel, { RoomTypeWithId } from "src/models/room";
import { getSession } from "../auth";

export async function getRooms(
  query: string,
  currentPage: number,
  filter: {
    currentStatus?: string;
    roomType?: string;
  }
) {
  await dbConnect();

  const resultsPerPage = 32;
  const skip = currentPage * resultsPerPage - resultsPerPage;

  const filterQuery = {
    $or: [{ roomNumber: { $regex: query, $options: "i" } }],
  } as unknown as any;

  // Apply filters if provided and not equal to "all"
  if (filter.currentStatus && filter.currentStatus !== "all") {
    filterQuery["currentStatus"] = filter.currentStatus;
  }
  if (filter.roomType && filter.roomType !== "all") {
    filterQuery["roomType"] = filter.roomType;
  }

  const rooms = await RoomModel.find(filterQuery)
    .skip(skip)
    .limit(resultsPerPage)
    .exec();
  const currentStatuses = await RoomModel.distinct("currentStatus");
  const roomTypes = await RoomModel.distinct("roomType");
  const totalPages = Math.ceil(
    (await RoomModel.countDocuments(filterQuery)) / resultsPerPage
  );

  return {
    rooms: JSON.parse(JSON.stringify(rooms)) as RoomTypeWithId[],
    totalPages,
    currentStatuses,
    roomTypes,
  };
}
export async function updateStatus(
  roomNumber: string,
  status: "available" | "occupied"
): Promise<boolean> {
  const session = await getSession();
  if (!session) {
    throw new Error("Only admins, faculty and CRs can update room status");
  }
  if (
    !session.user.roles.includes("admin") &&
    !session.user.roles.includes("faculty") &&
    !session.user.roles.includes("cr")
  ) {
    return Promise.reject(
      "Only admins, faculty and CRs can update room status"
    );
  }
  try {
    await dbConnect();

    const room = await RoomModel.findOne({ roomNumber }).exec();
    if (!room) {
      return Promise.reject("Room not found");
    }
    room.currentStatus = status;
    room.lastUpdatedTime = Date.now();
    const historyEntry = {
      user: {
        firstName: session.user.firstName,
        rollNo: session.user.rollNo,
        email: session.user.email,
      },
      time: Date.now(),
    };
    room.usageHistory.push(historyEntry);
    await room.save();
    revalidatePath("/dashboard/rooms");
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
}
