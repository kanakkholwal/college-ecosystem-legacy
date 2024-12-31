
import axios from "axios";
import type { Request, Response } from 'express';
import HTMLParser from "node-html-parser";
import { z } from "zod";
import { DEPARTMENTS_LIST, type Department } from "../constants/departments";


type FacultyType = {
    name: string;
    email: string;
    department: string;
}

// TODO: Implement the following functions to add and retrieve from database

export async function getFacultyListByDepartment(department: Department): Promise<{
    error: boolean;
    message: string;
    data: FacultyType[];
}> {
    const url = department.page
    const response = await axios.get(url);
    // console.log("Fetching", url);
    const document = HTMLParser.parse(response.data.toString());
    // console.log("Fetched", url);
    const section = document.querySelector(".departmentTab#138");
    if (!section) {
        console.error("Invalid department page", department);
        return {
            error: true,
            message: "Invalid department page",
            data: []
        }
    }
    const faculties: FacultyType[] = [];

    for (const faculty of section.querySelectorAll("tr")) {
        const tds = faculty.querySelectorAll("td:not([class])")
        if (tds.length < 5) {
            continue;
        }
        const name = tds[1].innerText.trim();
        const email = tds[3].innerText.trim();
        if (!name || !email) {
            console.error("Invalid faculty", { name, email });
            continue;
        }
        if (email === "Email") {
            continue;
        }
        const emailSchema = z.string().email();
        if (!emailSchema.safeParse(email).success) {
            console.error("Invalid email", email);
            continue;
        }
        faculties.push({
            name,
            email,
            department: department.name
        });
    }

    return {
        error: false,
        message: "Success",
        data: faculties
    }
}

export async function getFacultyList(): Promise<FacultyType[]> {

    const faculties: FacultyType[] = [];
    const promises = DEPARTMENTS_LIST.map(department => getFacultyListByDepartment(department));
    const results = await Promise.allSettled(promises);

    for (const result of results) {
        if (result.status === "fulfilled") {
            faculties.push(...result.value.data);
        }
    }

    return faculties;
}


export const getFacultyListByDepartmentHandler = async (req: Request, res: Response) => {
    const department = req.params.departmentCode;
    const dept = DEPARTMENTS_LIST.find(d => d.code === department);
    if (!dept) {
        res.json({
            error: true,
            message: "Invalid department",
            data: []
        });
        return;
    }
    const { error, data } = await getFacultyListByDepartment(dept);
    res.json({ error, message: error ? "Error" : "Success", data });
}

export const getFacultyListHandler = async (req: Request, res: Response) => {
    const data = await getFacultyList();
    res.json(data);
}

export const getFacultyByEmailHandler = async (req: Request, res: Response) => {
    const email = req.params.email;
    const emailSchema = z.string().email();
    if(!emailSchema.safeParse(email).success) {
        res.json({
            error: true,
            message: "Invalid email",
            data: null
        });
        return;
    }
    const faculties = await getFacultyList();
    const faculty = faculties.find(f => f.email === email);
    if (!faculty) {
        res.json({
            error: true,
            message: "Faculty not found",
            data: null
        });
        return;
    }
    res.json({
        error: false,
        message: "Success",
        data: faculty
    });
}




