"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "src/lib/auth";
import dbConnect from "src/lib/dbConnect";
import Announcement, {
  AnnouncementTypeWithId,
  RawAnnouncementType,
} from "src/models/announcement";

export async function createAnnouncement(
  announcementData: RawAnnouncementType
) {
  const session = await getSession();
  if (!session) {
    return Promise.reject("You need to be logged in to create an announcement");
  }
  try {
    await dbConnect();
    // Validate the announcement data
    const announcement = new Announcement({
      ...announcementData,
      createdBy: session.user._id,
    });
    await announcement.save();
    revalidatePath(`/announcements`);
    return Promise.resolve("Announcement created successfully");
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to create announcement");
  }
}
export async function getAnnouncements(): Promise<AnnouncementTypeWithId[]> {
  try {
    await dbConnect();
    const announcements = await Announcement.find();
    return Promise.resolve(JSON.parse(JSON.stringify(announcements)));
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to fetch announcements");
  }
}
export async function getAnnouncementById(
  id: string
): Promise<AnnouncementTypeWithId> {
  try {
    await dbConnect();
    const announcement = await Announcement.findById(id);
    return Promise.resolve(JSON.parse(JSON.stringify(announcement)));
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to fetch announcement");
  }
}
export async function updateAnnouncement(
  id: string,
  announcementData: RawAnnouncementType
) {
  try {
    await dbConnect();
    await Announcement.findByIdAndUpdate(id, announcementData, { new: true });
    revalidatePath(`/announcements`);
    return Promise.resolve("Announcement updated successfully");
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to update announcement");
  }
}
export async function deleteAnnouncement(id: string) {
  try {
    await dbConnect();
    await Announcement.findByIdAndDelete(id);
    revalidatePath(`/announcements`);
    return Promise.resolve("Announcement deleted successfully");
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to delete announcement");
  }
}
// Path: src/models/announcement.tsx
