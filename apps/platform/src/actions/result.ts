"use server";
import type { ResultTypeWithId } from "src/models/result";

import dbConnect from "src/lib/dbConnect";
import ResultModel from "src/models/result";
import { z } from "zod";
import { serverFetch } from "~/lib/server-fetch";

export async function getResultByRollNo(
    rollNo: string,
    update?: boolean,
    is_new?: boolean
): Promise<ResultTypeWithId | null> {
    await dbConnect();
    const result = await ResultModel.findOne({
        rollNo,
    }).exec();
    if (result && update) {
        const response = await serverFetch<{
            data: ResultTypeWithId | null;
            message: string;
            error: boolean;
        }>("/api/results/:rollNo/update",
            {
                method: "POST",
                params: { rollNo }
            });
        if (response.error || !response.data) {
            return JSON.parse(JSON.stringify(null));
        }
        await assignRanks();
        return JSON.parse(JSON.stringify(response.data.data));
    }
    if (!result && is_new) {
        const response = await serverFetch<{
            data: ResultTypeWithId | null;
            message: string;
            error: boolean;
        }>("/api/results/:rollNo/add",
            {
                method: "POST",
                params: { rollNo }
            });
        if (response.error || !response.data) {
            return JSON.parse(JSON.stringify(null));
        }
        await assignRanks();

        return JSON.parse(JSON.stringify(response.data.data));
    }
    return JSON.parse(JSON.stringify(result));
}

export async function assignRanks() {
    const response = await serverFetch<{
        error: boolean;
        message: string;
        data: object | null;
    }>("/api/result/assign-ranks", {
        method: "POST",
    });

    if (!response.data || response.data?.error) {
        return Promise.resolve(false);
    }

    return Promise.resolve(true);
}


const freshersDataSchema = z.array(z.object({
    name: z.string(),
    rollNo: z.string(),
    gender: z.enum(["male", "female", "not_specified"]),
}))
export async function bulkUpdateGenders(data: z.infer<typeof freshersDataSchema>) {
    try {
        const parsedData = freshersDataSchema.safeParse(data);
        if (!parsedData.success) {
            console.log("not success")
            return {
                error: true,
                message: "Invalid data",
                data: parsedData.error
            };
        }
        await dbConnect("production");

        const batchSize = 8;
        for (let i = 0; i < parsedData.data.length; i += batchSize) {
            const batch = parsedData.data.slice(i, i + batchSize);
            await Promise.allSettled(batch.map(async (student) => {
                const result = await ResultModel.findOne({ rollNo: student.rollNo });
                if (result && result.gender !== "not_specified") {
                    result.gender = student.gender;
                    console.log(student.gender);
                    await result.save();
                } else {
                    const res = await serverFetch("/api/results/:rollNo/add", {
                        method: "POST",
                        params: { rollNo: student.rollNo }
                    });
                    if (!res.data) {
                        console.log(res.error);
                    }
                    console.log(res.data);
                }
            }));
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return Promise.resolve(true);
    } catch (e) {
        console.error(e);
        return Promise.resolve(false);
    }
}