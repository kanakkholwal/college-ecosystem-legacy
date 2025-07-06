"use server";
import { ClubSchemaType } from "~/constants/clubs";
import dbConnect from "~/lib/dbConnect";
import { ClubModel, ClubTypeJson } from "~/models/clubs";

export async function createClub(club: ClubSchemaType):Promise<ClubTypeJson> {
  try {
    await dbConnect();
    const newClub = new ClubModel(club);
    const savedClub = await newClub.save();
    return JSON.parse(JSON.stringify(savedClub));
  } catch (error) {
    console.error("Error creating club:", error);
    throw new Error("Error creating club");
  }
}

export async function getAllClubs():Promise<ClubTypeJson[]> {
  try {
    await dbConnect();
    const clubs = await ClubModel.find().lean();
    return clubs.map((club) => JSON.parse(JSON.stringify(club)));
  } catch (error) {
    console.error("Error fetching clubs:", error);
    throw new Error("Error fetching clubs");
  }
}
export async function getClubById(id: string):Promise<ClubTypeJson | null> {
  try {
    await dbConnect();
    const club = await ClubModel.findById(id).lean();
    return club ? JSON.parse(JSON.stringify(club)) : null;
  } catch (error) {
    console.error("Error fetching club:", error);
    throw new Error("Error fetching club");
  }
}
export async function getClubBySubDomain(subDomain: string):Promise<ClubTypeJson | null> {
  try {
    await dbConnect();
    const club = await ClubModel.findOne({ subDomain }).lean();
    return club ? JSON.parse(JSON.stringify(club)) : null;
  } catch (error) {
    console.error("Error fetching club:", error);
    throw new Error("Error fetching club");
  }
}
export async function updateClub(id: string, clubData: Partial<ClubSchemaType>):Promise<ClubTypeJson | null> {
  try {
    await dbConnect();
    const updatedClub = await ClubModel.findByIdAndUpdate(id, clubData, { new: true }).lean();
    return updatedClub ? JSON.parse(JSON.stringify(updatedClub)) : null;
  } catch (error) {
    console.error("Error updating club:", error);
    throw new Error("Error updating club");
  }
}