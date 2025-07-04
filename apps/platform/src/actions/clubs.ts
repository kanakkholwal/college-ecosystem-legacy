"use server";
import { ClubModel } from "~/models/clubs";
import { ClubSchemaType } from "~/constants/clubs";
import dbConnect from "~/lib/dbConnect";

export async function createClub(club: ClubSchemaType) {
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

export async function getAllClubs() {
  try {
    await dbConnect();
    const clubs = await ClubModel.find().lean();
    return clubs.map((club) => JSON.parse(JSON.stringify(club)));
  } catch (error) {
    console.error("Error fetching clubs:", error);
    throw new Error("Error fetching clubs");
  }
}