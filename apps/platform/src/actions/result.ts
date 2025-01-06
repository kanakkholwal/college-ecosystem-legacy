"use server";
import type { ResultTypeWithId } from "src/models/result";

import dbConnect from "src/lib/dbConnect";
import ResultModel from "src/models/result";
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

    console.log(response);

    if (response.error) {
        return Promise.reject("Failed to assign ranks");
    }
    return Promise.resolve(true);
}