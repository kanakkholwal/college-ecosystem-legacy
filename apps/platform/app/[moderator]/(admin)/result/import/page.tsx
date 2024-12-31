"use client";
import readXlsxFile from 'read-excel-file'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react';
import ConditionalRender from "@/components/utils/conditional-render";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function ImportNewStudents() {
    const [tableData, setTableData] = useState<{
        header_cell: string[],
        row_cells: string[][]
    } | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const rows = await readXlsxFile(file);
            console.log(rows);
            const sanitized_rows = rows.filter((row) => row.every(cell => cell !== null)).map((row) => row.map((cell) => cell.toString()));
            setTableData({
                header_cell: Array.from(sanitized_rows[0]),
                row_cells:  Array.from(sanitized_rows.slice(1))
            });
        }
    };

    return (
        <div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="excel">
                    Import Excel file
                </Label>
                <Input id="excel" type="file" accept=".xlsx" onChange={handleFileChange} />
            </div>
            <ConditionalRender condition={tableData !== null}>
                <Table>
                    <TableCaption>
                        Imported Data from Excel
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            {tableData?.header_cell.map((cell) => {
                                return <TableHead key={cell} className="font-medium">{cell}</TableHead>
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            {tableData?.row_cells.map((row, index) => {
                                return (
                                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                        <TableRow key={row.length + index}>
                                        {row.map((cell) => {
                                            return <TableCell key={cell}>{cell}</TableCell>
                                        })}
                                    </TableRow>
                                )
                            })}
                        </TableRow>
                    </TableBody>
                </Table>

            </ConditionalRender>

        </div>
    );
}
