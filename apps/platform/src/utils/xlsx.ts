import type { Row } from "read-excel-file";


export function convertRowsToStringArray(rows:Row[]) {

    const sanitized_rows = rows
        .filter((row) => row.every((cell) => cell !== null))
        .map((row) => row.map((cell) => cell.toString()));

    return sanitized_rows
}