"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { createHostelSchema, createHostelStudentSchema } from "~/constants/hostel_n_outpass";
import dbConnect from "~/lib/dbConnect";
import { serverFetch } from "~/lib/server-fetch";
import {
    HostelModel,
    HostelStudentModel,
    type IHostelType,
    OutPassModel
} from "~/models/hostel_n_outpass";

/*
    Hostel Actions
*/

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

export async function getHostels():Promise<{
    success:boolean,
    data:IHostelType[]
}> {
    try {
        await dbConnect();
        const hostels = await HostelModel.find({}).lean();
        return Promise.resolve({ success: true, data: JSON.parse(JSON.stringify(hostels)) })
    }
    catch (err) {
        return Promise.resolve({ success: false, data: [] })
    }
}

type FunctionaryType = {
    name: string;
    email: string;
    role: string;
    phoneNumber: string;
};

type HostelType = {
    name: string;
    slug: string;
    gender:"male"|"female";

    warden: {
        name: string;
        email: string;
        phoneNumber: string;
    };
    administrators: FunctionaryType[];
};

export async function importHostelsFromSite(){
    try{
        const {data:response} = await serverFetch<{
            error: boolean;
            message: string;
            data: {
                in_charges: FunctionaryType[];
                hostels: HostelType[];
            };
        }>("/api/hostels",{
            method:"GET"
        });
        if(response?.error || !response?.data){
            return response
        }
        await dbConnect();
        const hostels = response.data.hostels;
        for await (const hostel of hostels){
            const newHostel = new HostelModel({
                name:hostel.name,
                slug:hostel.slug,
                gender:hostel.gender,
                warden:hostel.warden,
                administrators:hostel.administrators
            });
            await newHostel.save();
        }
        revalidatePath("/admin/hostels")
        return {success:true}

    }catch(err){
        return {error:true,message:JSON.parse(JSON.stringify(err))}
    }
}

/*
    OutPass Actions
*/

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
