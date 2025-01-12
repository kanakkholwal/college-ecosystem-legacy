"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { createHostelSchema, createHostelStudentSchema, updateHostelSchema } from "~/constants/hostel_n_outpass";
import dbConnect from "~/lib/dbConnect";
import { serverFetch } from "~/lib/server-fetch";
import {
    HostelModel,
    HostelStudentModel,
    type HostelType,
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

export async function updateHostel(slug: string, data: z.infer<typeof updateHostelSchema>) {
    try {
        const response = updateHostelSchema.safeParse(data);
        if (!response.success) {
            return {success: false, error: response.error }
        }
        await dbConnect();
        // map data.students (array of emails) to 
        // const students = await HostelStudentModel.find({ email: { $in: data.students } }).select('_id').lean();
        // data.students = students.map((student) => student._id) as string[];
        await HostelModel
            .findOneAndUpdate({ slug }, data, { new: true })
            .exec();
        return { success: true }
    }
    catch (err) {
        return { success: false,error: err }
    }
    finally{
        revalidatePath(`/admin/hostels/${slug}`)
    }

}

export async function getHostel(slug: string):Promise<{
    success:boolean,
    hostel:HostelType | null,
    error?:object
}> {
    try {
        await dbConnect();
        const hostel = await HostelModel.findOne({ slug }).populate('students').lean();
        if (!hostel) {
            return Promise.resolve({ success: false, hostel: null })
        }
        return Promise.resolve({ success: true, hostel: JSON.parse(JSON.stringify(hostel)) })
    }
    catch (err) {
        return Promise.reject({ success: false, hostel: null, error: JSON.parse(JSON.stringify(err)) })
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

type RawFunctionaryType = {
    name: string;
    email: string;
    role: string;
    phoneNumber: string;
};

type RawHostelType = {
    name: string;
    slug: string;
    gender: "male" | "female" | "guest_hostel"
    warden: {
        name: string;
        email: string;
        phoneNumber: string;
    };
    administrators: RawFunctionaryType[];
};

export async function importHostelsFromSite(){
    try{     
        const res = await serverFetch<{
            error: boolean;
            message: string;
            data: {
                in_charges: RawFunctionaryType[];
                hostels: RawHostelType[];
            };
        }>("/api/hostels",{
            method:"GET"
        });
        // console.log(res)
        const response = res.data;
        if(res?.error || response?.error || !response?.data){
            return Promise.reject(response)
        }
        await dbConnect();
        const hostels = response?.data?.hostels.map((hostel)=>{
            return {
                name:hostel.name,
                slug:hostel.slug,
                gender:hostel.gender,
                warden:hostel.warden,
                administrators:hostel.administrators,
                students:[]
            }
        })
        // await HostelModel.deleteMany({});
        await HostelModel.insertMany(hostels);

        return {error:false,data:hostels, message:"Hostels imported successfully"}
    }catch(err){
        return Promise.reject({error:true,data:JSON.parse(JSON.stringify(err)), message:"Failed to import hostels"})
    }finally{
        revalidatePath("/admin/hostels")
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
