import axios from "axios";
import type { Request, Response } from 'express';
import HTMLParser from "node-html-parser";
import { z } from "zod";
import { DEPARTMENTS_LIST, type Department } from "../constants/departments";
import Faculty from "../models/faculty";
import dbConnect from "../utils/dbConnect";

type FacultyType = {
    name: string;
    email: string;
    department: string;
}

async function getFacultyListByDepartment(department: Department): Promise<{
    error: boolean;
    message: string;
    data: FacultyType[];
}> {
    const url = department.page
    const response = await axios.get(url);
    const document = HTMLParser.parse(response.data.toString());
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

async function getFacultyList(): Promise<FacultyType[]> {

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
        res.status(400).json({
            error: true,
            message: "Invalid department",
            data: []
        });
        return;
    }
    const facultyList = await Faculty.find({department})

    if (facultyList.length === 0) {
        res.status(404).json({
            error: true,
            message: "Faculty not found",
            data: []
        });
        return;
    }
    res.status(200).json({
        error: false,
        message: "Success",
        data: facultyList
    });
}

export const getFacultyListHandler = async (req: Request, res: Response) => {
    const data = await Faculty.find({})
    res.status(200).json(data);
}

export const getFacultyByEmailHandler = async (req: Request, res: Response) => {
    const email = req.params.email;
    const emailSchema = z.string().email();
    if(!emailSchema.safeParse(email).success) {
        res.status(400).json({
            error: true,
            message: "Invalid email",
            data: null
        });
        return;
    }
    await dbConnect()
    const faculty = await Faculty.findOne({email})
    if (!faculty) {
        res.status(404).json({
            error: true,
            message: "Faculty not found",
            data: null
        });
        return;
    }
    res.status(200).json({
        error: false,
        message: "Success",
        data: faculty
    });
}

export const refreshFacultyListHandler = async (req: Request, res: Response) => {
    try{
        await dbConnect()
        const faculties = await getFacultyList();
        await Faculty.deleteMany({});
        await Faculty.insertMany(faculties);
        res.status(200).json({
            error: false,
            message: "Success",
            data: faculties
        });
    }catch(e){
        if (e instanceof Error) {
            console.error(e.message);
            res.status(500).json({
                error: true,
                message: e.message,
                data: []
            });
            return;
        }
        res.status(500).json({
            error: true,
            message: "Unknown error",
            data: []
        });
    }
}