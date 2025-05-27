"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ConditionalRender from "@/components/utils/conditional-render";
import { useState } from "react";
import toast from "react-hot-toast";
import readXlsxFile from "read-excel-file";
import z from "zod";
import serverApis from "~/lib/server-apis/client";

const freshersDataSchema = z.object({
  name: z.string(),
  rollNo: z.string(),
  gender: z.enum(["male", "female", "not_specified"]),
});

export default function ImportNewStudents() {
  const [tableData, setTableData] = useState<{
    header_cell: string[];
    row_cells: string[][];
  } | null>(null);
  const [requiredKeys, setRequiredKeys] = useState<{
    name: string;
    rollNo: string;
    gender: string;
  }>({ name: "Name", rollNo: "Roll No.", gender: "Gender" });

  const [data, setData] = useState<z.infer<typeof freshersDataSchema>[] | null>(
    null
  );

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const rows = await readXlsxFile(file);
      console.log(rows);
      const sanitized_rows = rows
        .filter((row) => row.every((cell) => cell !== null))
        .map((row) => row.map((cell) => cell.toString()));
      setTableData({
        header_cell: Array.from(sanitized_rows[0]),
        row_cells: Array.from(sanitized_rows.slice(1)),
      });
      const sanitized_data = [];
      for (const row of sanitized_rows.slice(1)) {
        const data = {} as Record<string, string>;
        for (let i = 0; i < row.length; i++) {
          data[sanitized_rows[0][i]] = row[i];
        }
        sanitized_data.push(data);
      }
      const parsed_data = sanitized_data.map((data) => ({
        name: data[requiredKeys.name],
        rollNo: data[requiredKeys.rollNo],
        gender: data[requiredKeys.gender]?.toLowerCase()?.trim() as
          | "male"
          | "female"
          | "not_specified",
      }));
      // console.log(parsed_data);
      setData(parsed_data);
      // verify the data against the schema and set the required keys
    }
  };

  return (
    <div className="space-y-6 p-4 px-2 md:p-6 @container/local">
      <div>

        <h3 className="text-base md:text-lg font-bold">
          Import New Students
        </h3>
        <p className="text-sm text-muted-foreground">
          Use this form to import new students from an Excel file. Ensure that the
          file contains the required columns: Name, Roll No., and gender.
        </p>
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="excel">
          Import Excel file (Only .xlsx files are supported)
        </Label>
        <Input
          id="excel"
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
        />
      </div>
      <div className="flex w-full flex-wrap items-center gap-1.5">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={requiredKeys.name}
            onChange={(e) =>
              setRequiredKeys({ ...requiredKeys, name: e.target.value })
            }
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="rollNo">Roll No.</Label>
          <Input
            id="rollNo"
            type="text"
            value={requiredKeys.rollNo}
            onChange={(e) =>
              setRequiredKeys({ ...requiredKeys, rollNo: e.target.value })
            }
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="gender">Gender</Label>
          <Input
            id="gender"
            type="text"
            value={requiredKeys.gender}
            onChange={(e) =>
              setRequiredKeys({ ...requiredKeys, gender: e.target.value })
            }
          />
        </div>
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <div>
          <p className="text-sm text-muted-foreground">
            Imported Data
            <Badge size="sm">{data !== null ? data.length : 0} rows</Badge>
            from 
            <Badge size="sm">
              {tableData !== null ? tableData.row_cells.length : 0} rows
            </Badge>
          </p>
        </div>
        <Button
          onClick={async () => {
            if (data === null) return;
            toast.promise(serverApis.results.importFreshers(data), {
              loading: "Updating data",
              success: "Data updated successfully",
              error: "Failed to update data",
            });
          }}
        >
          Save Data
        </Button>
      </div>
      <ConditionalRender condition={tableData !== null}>
        <Table>
          <TableCaption>Imported Data from Excel</TableCaption>
          <TableHeader>
            <TableRow>
              {tableData?.header_cell.map((cell) => {
                return (
                  <TableHead key={cell} className="font-medium">
                    {cell}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData?.row_cells.map((row, index) => {
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <TableRow key={row.length + index}>
                  {row.map((cell) => {
                    return <TableCell key={cell} className="whitespace-nowrap">{cell}</TableCell>;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ConditionalRender>
    </div>
  );
}
