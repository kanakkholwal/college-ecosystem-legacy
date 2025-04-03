import path from "node:path";
import readXlsxFile from "read-excel-file/node";
import { z } from "zod";
import { getInfoFromRollNo } from "../lib/scrape";
import ResultModel from "../models/result";
import dbConnect from "../utils/dbConnect";

const freshersDataSchema = z.array(
  z.object({
    name: z.string(),
    rollNo: z.string(),
    gender: z.enum(["male", "female", "not_specified"]),
  })
);

async function importFreshers(ENV: "production" | "testing", filePath: string) {
  try {
    const time = new Date();
    await dbConnect(ENV);

    const rows = await readXlsxFile(path.join(__dirname, filePath));
    const sanitized_rows = rows
      .filter((row) => row.every((cell) => cell !== null))
      .map((row) => row.map((cell) => cell.toString()));

    const sanitized_data = [];
    const rows_info = new Map([
      [2, "name"],
      [3, "rollNo"],
      [4, "gender"],
    ]);
    for (const row of sanitized_rows.slice(1)) {
      const data = {} as Record<string, string>;
      for (let i = 0; i < row.length; i++) {
        const key = rows_info.get(i);
        if (key) {
          if (i === 2) {
            data[key] = row[i].trim();
          } else data[key] = row[i].toLowerCase().trim();
        }
      }
      sanitized_data.push(data);
    }
    console.log(sanitized_data.slice(0, 5));
    const parsedData = freshersDataSchema.safeParse(sanitized_data);
    if (!parsedData.success) {
      console.log({
        error: true,
        message: "Invalid data",
        data: parsedData.error,
      });
      process.exit(0);
      return;
    }
    console.log("valid Schema");
    const getSanitizedData = () =>
      parsedData.data?.map(async (student) => {
        const data = await getInfoFromRollNo(student.rollNo);
        return {
          name: student.name,
          rollNo: student.rollNo,
          branch: data.branch,
          batch: data.batch,
          programme: data.programme,
          gender: student.gender,
          semesters: [],
        };
      });
    // verify the data against the schema and set the required keys

    const results = await Promise.all(getSanitizedData());
    await ResultModel.deleteMany({
      batch: "2024",
    });
    const resultsWithRanks = await ResultModel.insertMany(results);

    console.log("Freshers imported successfully.");

    console.log({
      error: false,
      message: "Freshers imported successfully.",
      data: {
        timeTaken: `${(new Date().getTime() - time.getTime()) / 1000}s`,
        lastUpdated: new Date().toISOString(),
        results: `${resultsWithRanks.length} freshers imported`,
      },
    });
    process.exit(1);
  } catch (error) {
    console.log(error);
    console.log({
      error: true,
      message: "An error occurred",
      data: error || "Internal Server Error",
    });
    process.exit(0);
  }
}

importFreshers("production", "./freshers.xlsx");
