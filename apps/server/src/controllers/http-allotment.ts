import type { Request, Response } from "express";
import * as XLSX from 'xlsx';
import { allotRooms } from '../services/allotment.service';



export async function allotRoomsFromExcel(req: Request, res: Response) {
    try {
        const buffer = req.file?.buffer;
        if (!buffer) return res.status(400).send('Excel file required');

        const workbook = XLSX.read(buffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any[] = XLSX.utils.sheet_to_json(sheet);

        const roomDistribution = JSON.parse(req.body.roomDistribution); // e.g., { "4": 94, "3": 110 }
        const gender = req.body.gender;
        const extraFields = JSON.parse(req.body.extraFields || '[]');

        const resultWb = await allotRooms(data, roomDistribution, gender, extraFields);

        const resultBuffer = await resultWb.xlsx.writeBuffer();
        res.setHeader('Content-Disposition', 'attachment; filename=allotment.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(resultBuffer);
        // res.status(200).send('Allotment successful, file generated');
        res.status(200).json({
            error: false,
            message: 'Allotment successful, file generated',
            data: null,
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}