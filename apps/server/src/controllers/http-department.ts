import {
    DEPARTMENTS_LIST,
    DEPARTMENTS
} from '../constants/departments';

import { type Request, type Response, Router } from 'express';


export const getDepartmentsList = async (req: Request, res: Response) => {
    res.json(DEPARTMENTS);
}
export const getDepartments = async (req: Request, res: Response) => {
    res.json(DEPARTMENTS_LIST);
}
