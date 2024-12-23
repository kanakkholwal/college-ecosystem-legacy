"use server"
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { db } from "~/db/connect";
import { roomUsageHistory, rooms, users } from "~/db/schema";

// Define types for rooms and usage history
type RoomSelect = InferSelectModel<typeof rooms>;
type RoomInsert = InferInsertModel<typeof rooms>;
type UsageHistoryInsert = InferInsertModel<typeof roomUsageHistory>;
type UsageHistorySelect = InferSelectModel<typeof roomUsageHistory>;


/* FOR ADMIN USERS */



// Function to get a room by ID with full history for admin

export async function getRoomByIdForAdmin(
  roomId: string
): Promise<
  RoomSelect & {
    usageHistory: { username: string; name: string; createdAt: Date }[];
  } | null
> {
  "use server"
  // Fetch room details
  const room = await db
    .select()
    .from(rooms)
    .where(eq(rooms.id, roomId))
    .then((res) => res[0]);

  if (!room) return null;

  // Fetch usage history for the room
  const usageHistory = await db
    .select({
      roomId: roomUsageHistory.roomId,
      userId: roomUsageHistory.userId,
      createdAt: roomUsageHistory.createdAt,
      username: users.username,
      name: users.name,
    })
    .from(roomUsageHistory)
    .innerJoin(users, eq(users.id, roomUsageHistory.userId))
    .where(eq(roomUsageHistory.roomId, roomId))
    .orderBy(desc(roomUsageHistory.createdAt));

  return {
    ...room,
    usageHistory: usageHistory
      .filter((history) => history.createdAt !== null)
      .map((history) => ({
        username: history.username,
        name: history.name,
        createdAt: history.createdAt as Date,
      })),
  };
}

export async function getRoomsInfo(): Promise<{
  totalRooms: number;
  totalAvailableRooms: number;
  totalOccupiedRooms: number;
}> {
  "use server"
  // Count total rooms
  const totalRooms = await db
    .select({ count: sql`count(*)`.mapWith(Number) })
    .from(rooms)
    .then((res) => res[0]?.count ?? 0);

  // Count available rooms
  const totalAvailableRooms = await db
    .select({ count: sql`count(*)`.mapWith(Number) })
    .from(rooms)
    .where(eq(rooms.currentStatus, "available"))
    .then((res) => res[0]?.count ?? 0);

  // Count occupied rooms
  const totalOccupiedRooms = await db
    .select({ count: sql`count(*)`.mapWith(Number) })
    .from(rooms)
    .where(eq(rooms.currentStatus, "occupied"))
    .then((res) => res[0]?.count ?? 0);

  return {
    totalRooms,
    totalAvailableRooms,
    totalOccupiedRooms,
  };
}


/* FOR NON-ADMIN USERS */

// Function to list all rooms with their usage history
export async function listAllRoomsWithHistory(
  filters?: { status?: string; roomNumber?: string }
): Promise<(RoomSelect & { latestUsageHistory: { username: string; name: string } | null })[]> {
  "use server"
  // Build the filters for the query
  const conditions = [];
  if (filters?.status) {
    conditions.push(eq(rooms.currentStatus, filters.status));
  }
  if (filters?.roomNumber) {
    conditions.push(like(rooms.roomNumber, `%${filters.roomNumber}%`));
  }

  // Apply filters if any
  const roomQuery = conditions.length
    ? db.select().from(rooms).where(and(...conditions))
    : db.select().from(rooms);

  const filteredRooms = await roomQuery;

  // Fetch latest usage history per room
  const latestHistories = await db
    .select({
      roomId: roomUsageHistory.roomId,
      userId: roomUsageHistory.userId,
      createdAt: roomUsageHistory.createdAt,
      username: users.username,
      name: users.name,
    })
    .from(roomUsageHistory)
    .innerJoin(users, eq(users.id, roomUsageHistory.userId))
    .orderBy(desc(roomUsageHistory.createdAt));

  // Map latest usage history by roomId
  const latestHistoryMap = latestHistories.reduce((acc, history) => {
    if (history.roomId && !acc[history.roomId]) {
      acc[history.roomId] = {
        username: history.username,
        name: history.name,
      };
    }
    return acc;
  }, {} as Record<string, { username: string; name: string }>);

  // Populate rooms with latest usage history
  return filteredRooms.map((room) => ({
    ...room,
    latestUsageHistory: latestHistoryMap[room.id] || null,
  }));
}


// Function to create a new room
export async function createRoom(
  roomData: RoomInsert,
  initialUsageHistory?: UsageHistoryInsert
): Promise<RoomSelect> {
  "use server"
  const [newRoom] = await db.insert(rooms).values(roomData).returning();

  if (!newRoom) {
    throw new Error("Failed to create room");
  }

  if (initialUsageHistory) {
    await db.insert(roomUsageHistory).values({
      ...initialUsageHistory,
      roomId: newRoom.id,
    });
  }

  return newRoom;
}

// Function to update a room
export async function updateRoom(
  roomId: string,
  updatedData: Partial<RoomInsert>,
  usageHistoryData?: UsageHistoryInsert
): Promise<RoomSelect> {
  // "use server"
  const [updatedRoom] = await db
    .update(rooms)
    .set(updatedData)
    .where(eq(rooms.id, roomId))
    .returning();

  if (!updatedRoom) {
    throw new Error(`Failed to update room with ID: ${roomId}`);
  }

  if (usageHistoryData) {
    await db.insert(roomUsageHistory).values({
      ...usageHistoryData,
      roomId,
    });
  }

  return updatedRoom;
}

// Function to delete a room and its usage history
export async function deleteRoom(roomId: string): Promise<RoomSelect> {
  const [deletedRoom] = await db
    .delete(rooms)
    .where(eq(rooms.id, roomId))
    .returning();

  if (!deletedRoom) {
    throw new Error(`Failed to delete room with ID: ${roomId}`);
  }

  // Delete usage history associated with the room
  await db.delete(roomUsageHistory).where(eq(roomUsageHistory.roomId, roomId));

  return deletedRoom;
}

// Function to add usage history to a room
export async function addUsageHistory(
  usageHistoryData: UsageHistoryInsert
): Promise<UsageHistorySelect> {
  const [newHistory] = await db
    .insert(roomUsageHistory)
    .values(usageHistoryData)
    .returning();

  if (!newHistory) {
    throw new Error("Failed to add usage history");
  }

  return newHistory;
}

// Function to list usage history for a specific room
export async function listRoomUsageHistory(
  roomId: string
): Promise<UsageHistorySelect[]> {
  return await db
    .select()
    .from(roomUsageHistory)
    .where(eq(roomUsageHistory.roomId, roomId));
}
