"use server";

import dbConnect from "~/lib/dbConnect";
import {
  OutPassModel
} from "~/models/hostel_n_outpass";


/*
    OutPass Actions
*/

export async function createOutPass() {
  try {
    await dbConnect();
    const newOutPass = await OutPassModel.find({});
    // await newOutPass.save();
    return { success: true };
  } catch (err) {
    return { error: err };
  }
}
