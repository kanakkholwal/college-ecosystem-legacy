"use server";

import type { z } from "zod";
import { createHostelSchema, createHostelStudentSchema } from "~/constants/hostel_n_outpass";
import dbConnect from "~/lib/dbConnect";
import {
    HostelModel,
    HostelStudentModel,
    OutPassModel
} from "~/models/hostel_n_outpass";


export async function createHostel(data: z.infer<typeof createHostelSchema>) {
    try {
        const response = createHostelSchema.safeParse(data);
        if (!response.success) {
            return { error: response.error }
        }
        await dbConnect();
        const newHostel = new HostelModel(data);
        await newHostel.save();
        return { success: true }
    }
    catch (err) {
        return { error: err }
    }
}

export async function createHostelStudent(data: z.infer<typeof createHostelStudentSchema>) {
    try {
        const response = createHostelStudentSchema.safeParse(data);
        if (!response.success) {
            return { error: response.error }
        }
        await dbConnect();
        const newStudent = new HostelStudentModel(data);
        await newStudent.save();
        return { success: true }
    }
    catch (err) {
        return { error: err }
    }
}

export async function getHostel(slug: string) {
    try {
        await dbConnect();
        const hostel = await HostelModel.findOne({ slug }).populate('students');
        return { success: true, hostel }
    }
    catch (err) {
        return { error: err }
    }

}

export async function createOutPass(){
    try {
        await dbConnect();
        const newOutPass = new OutPassModel();
        await newOutPass.save();
        return { success: true }
    }
    catch (err) {
        return { error: err }
    }
}
