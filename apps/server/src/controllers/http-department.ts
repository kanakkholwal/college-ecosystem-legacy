import {
    DEPARTMENTS,
    DEPARTMENTS_LIST
} from '../constants/departments';

import type { Request, Response } from 'express';


export const getDepartmentsList = async (req: Request, res: Response) => {
    res
    .status(200)
    .json({
        error: false,
        message: "Success",
        data:DEPARTMENTS_LIST
    });
}
export const getDepartments = async (req: Request, res: Response) => {
    res.status(200).json({
        error: false,
        message: "Success",
        data:  DEPARTMENTS,
    });
}
