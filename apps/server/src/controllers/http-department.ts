import {
    DEPARTMENTS,
    DEPARTMENTS_LIST
} from '../constants/departments';

import type { Request, Response } from 'express';


export const getDepartmentsList = async (req: Request, res: Response) => {
    res.json(DEPARTMENTS);
}
export const getDepartments = async (req: Request, res: Response) => {
    res.json(DEPARTMENTS_LIST);
}
