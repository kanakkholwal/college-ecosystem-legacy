import axios from "axios";
import HTMLParser from "node-html-parser";
import { getDepartmentCoursePrefix } from "../constants/departments";
import { headerMap, PROGRAMME_KEYS, RESPONSE } from "../constants/result_scraping";
import type { rawResultType } from "../types/result";


const CACHE = new Map<string, string>();

/**
 * Fetches the result data from the NITH results page for a given roll number.
 * @param url - The URL to fetch the result from.
 * @param RollNo - The roll number of the student.
 * @param headers - The headers required for the request.
 * @returns A promise that resolves to a tuple containing the result data and a message.
 */

const fetchData = async (
  url: string,
  RollNo: string,
  headers: Record<string, string>
): Promise<[string | null, string]> => {
  const data = `RollNumber=${RollNo}&CSRFToken=${headers.CSRFToken}&RequestVerificationToken=${headers.RequestVerificationToken}&B1=Submit`;

  try {
    const response = await axios.post(url, data, {
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "max-age=0",
        "Content-Type": "application/x-www-form-urlencoded",
        "Upgrade-Insecure-Requests": "1",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        Referer: headers.Referer,
      },
    });
    //  only if the status is 200
    if (response.status !== 200) {
      console.log("Invalid Roll No");
      return Promise.resolve([null, "Invalid Roll No"]);
    }
    return Promise.resolve([response.data.toString(), "successfully fetched"]);
  } catch (error) {
    console.error("Error fetching data:");
    return Promise.resolve([null, (error as Error).toString()]);
  }
};
/**
 * Parses the HTML result string fetched from the NITH results page.
 * @param result - The HTML result string fetched from the NITH results page.
 * @param info - Additional information about the student.
 * @returns A promise that resolves to a rawResultType object.
 */

const parseResult = (
  result: string | null,
  info: {
    rollNo: string;
    url: string;
    branch: string;
    batch: number;
    programme: string;
  }
): Promise<rawResultType> => {
  if (result === null) {
    console.log("Invalid Roll No");
    return Promise.reject("Invalid Roll No");
  }
  const document = HTMLParser.parse(result);
  if (!document.querySelector("#page-wrap")) {
    console.log("Invalid Roll No");
    return Promise.reject("Invalid Roll No");
  }
  console.log("Result is available");

  const student: rawResultType = {
    name: "",
    rollNo: info.rollNo,
    branch: info.branch,
    batch: info.batch,
    programme: info.programme,
    semesters: [] as rawResultType["semesters"],
    gender: "not_specified",
  };


  
    
  result_tables.forEach((table, index) => {
    student.name =
    document
      .querySelectorAll("table")[1]
      .querySelector("td:nth-child(2)>p:nth-child(2)")
      ?.innerText.trim() || "";
  document.querySelector(".pagebreak")?.remove();
  const subject_tables = document.querySelectorAll(
    "table:nth-child(odd):nth-child(n + 3):not(:last-of-type)"
  );
  subject_tables.forEach((table, index) => {
    if (!student.semesters[index]) {
      student.semesters.push({
        semester: "0",
        sgpi: 0,
        sgpi_total: 0,
        cgpi: 0,
        cgpi_total: 0,
        courses: [],
      });
    }
    for (const tr of table.querySelectorAll("tr:not([class])")) {
      const semester = Number.parseFloat(
        tr.querySelector("td:nth-child(6)")?.textContent || "0.00"
      );
      const semester_total = Number.parseFloat(
        tr.querySelector("td:nth-child(4)")?.textContent || "1"
      );
      student.semesters[index].courses.push({
        name: tr.querySelector("td:nth-child(2)")?.innerText.trim() || "",
        code: tr.querySelector("td:nth-child(3)")?.innerText.trim() || "",
        cgpi: semester / semester_total,
      });
    }
  });
  const result_tables = document.querySelectorAll(
    "table:nth-child(even):nth-child(n + 3):not(:last-of-type)"
  );
  result_tables.forEach((table, index) => {
    table.querySelectorAll("td").forEach((td, i, array) => {
      student.semesters[index].semester = `0${index + 1}`.slice(-2);
      student.semesters[index].sgpi = array[1].innerText
        .trim()
        .split("=")[1] as unknown as number;
      student.semesters[index].sgpi_total = array[2].innerText
        .trim()
        .split(" ")
        .pop() as unknown as number;
      student.semesters[index].cgpi = array[3].innerText
        .trim()
        .split("=")[1] as unknown as number;
      student.semesters[index].cgpi_total = array[4].innerText
        .trim()
        .split(" ")
        .pop() as unknown as number;
    });
  });
  
  const [branch_change, department] = determineBranchChange(student);
  if (branch_change && department !== null) {
    student.branch = department;
  }

  console.log("Result parsed");
  return Promise.resolve(student);
};

/**
 * Scrapes the result for a given roll number.
 * @param rollNo - The roll number of the student.
 * @returns A promise that resolves to an object containing the result data or an error message.
 * */
export async function scrapeResult(rollNo: string): Promise<{
  message: string;
  data: rawResultType | null;
  error?: string | null;
}> {

  const data = await getInfoFromRollNo(rollNo, false);
  console.log("Roll No: %s", rollNo);

  try {
    console.log("evaluating");
    const [result, msg] = await fetchData(data.url, rollNo, data.headers);
    if (result === null) {
      return Promise.resolve({
        message: msg,
        data: null,
        error: "Invalid Roll No",
      });
    }
    console.log("evaluated");
    const student = await parseResult(result, {
      rollNo,
      ...data,
    });
    console.log("parsed");
    // if student is dual degree then we need to fetch the other result
    // if (student.programme === "Dual Degree" && student.semesters.length > 6) {
    //   const data = await getInfoFromRollNo(rollNo, true);
    //   console.log("evaluating dual degree result", data.url);
    //   const [result, msg] = await fetchData(data.url, rollNo, data.headers);
    //   if (result === null) {
    //     return Promise.resolve({
    //       message: msg,
    //       data: null,
    //       error: "Invalid Roll No",
    //     });
    //   }
    //   const student_dual = await parseResult(result, {
    //     rollNo,
    //     ...data,
    //   });
    //   console.log("parsed dual degree result");
    //   // if the dual degree result has only one semester, it means the student is in the first semester of the dual degree
    //   student_dual.semesters.forEach((semester) => {
    //     semester.semester = `${semester.semester} (masters)`; // pad with 0, dual degree semesters start from 8
    //     semester.cgpi = semester.cgpi || 0; // ensure cgpi is set
    //     student.semesters.push({
    //       ...semester,
    //       semester: `${semester.semester} (masters)`, // append (masters) to the semester
    //     });
    //   });



    // }

    return Promise.resolve({
      message: "Result fetched successfully!",
      data: student,
      error: null,
    });
  } catch (err) {
    console.error("Error in scrapeResult:", err);
    // If there is an error, return a rejected promise with the error message
    return Promise.resolve({
      message: err instanceof Error ? err.message : "Something went wrong",
      data: null,
      error: err?.toString(),
    });
  }
}

/**
 * Gets the information headers for the roll number.
 * @param rollNo - The roll number of the student.
 * @param isDualDegree - Whether the student is in a dual degree programme.
 * @returns A promise that resolves to an object containing the batch, branch, URL, and headers.
 * */


export async function getInfoFromRollNo(rollNo: string, dualDegree = false) {
  // split the roll no into 3 parts starting two characters then 3 characters and then 3 characters
  const matches = [
    Number.parseInt(rollNo.toLowerCase().substring(0, 2)), // 20
    rollNo.toLowerCase().substring(2, 5), // dec,bec,bar
    rollNo.toLowerCase().substring(5, 8), // 001
  ] as const;
  const [batchCode, programmeCode] = matches;
  const isDualDegree =
    PROGRAMME_KEYS["Dual Degree"].includes(programmeCode) && dualDegree;
  const isMasters = PROGRAMME_KEYS["M.Tech"].includes(programmeCode);
  const batchCodeKey = isDualDegree ? `${batchCode}_dual` : batchCode;
  const programmeScheme = isDualDegree
    ? "dualdegree"
    : isMasters
      ? "mtech"
      : "scheme";

  //  check if we have header for the batch
  if (!headerMap.has(batchCodeKey)) {
    if (batchCode >= 20) {
      // New batches
      if (CACHE.has(batchCodeKey + programmeCode)) {
        const data = CACHE.get(batchCodeKey + programmeCode);
        headerMap.set(batchCodeKey, JSON.parse(data || ""));
      } else if (!headerMap.has(batchCode)) {
        headerMap.set(batchCodeKey, {
          url: `http://results.nith.ac.in/${programmeScheme}${batchCode}/studentresult/result.asp`,
          Referer: `http://results.nith.ac.in/${programmeScheme}${batchCode}/studentresult/index.asp`,
          CSRFToken: `{${Math.random().toString(36).substring(2, 36)}}`,
          RequestVerificationToken: `${Math.random().toString(36).substring(2, 36)}`,
        });

        const header = headerMap.get(batchCodeKey);
        if (!header) {
          return Promise.reject({
            type: "ERROR",
            message: RESPONSE.ERROR.NO_HEADERS,
          });
        }
        const response = await axios.get(header.url);
        const document = HTMLParser.parse(response.data.toString());
        header.CSRFToken =
          document
            .querySelector('input[name="CSRFToken"]')
            ?.getAttribute("value") || "";
        header.RequestVerificationToken =
          document
            .querySelector('input[name="RequestVerificationToken"]')
            ?.getAttribute("value") || "";
        headerMap.set(batchCodeKey, header);
        CACHE.set(batchCodeKey + programmeCode, JSON.stringify(header));
      }
    }
  }
  const header = headerMap.get(batchCode);
  if (!header) {
    return Promise.reject({
      type: "ERROR",
      message: RESPONSE.ERROR.NO_HEADERS,
    });
  }

  return {
    batch: Number.parseInt(`20${batchCode}`),
    branch: determineDepartment(rollNo),
    url: header.url,
    headers: {
      Referer: header.Referer,
      CSRFToken: header.CSRFToken,
      RequestVerificationToken: header.RequestVerificationToken,
    },
    programme: determineProgramme(rollNo),
  };
}

/**
 * Determines the department based on the roll number.
 * @param RollNo - The roll number of the student.
 * @returns The department name as a string.
 */
// This function is used to determine the department based on the roll number.
export function determineDepartment(RollNo: string) {
  const lowerRollNo = RollNo.toLowerCase();
  switch (true) {
    case lowerRollNo.includes("bar"):
      return "Architecture";
    case lowerRollNo.includes("bce"):
      return "Civil Engineering";
    case lowerRollNo.includes("bme"):
      return "Mechanical Engineering";
    case lowerRollNo.includes("bms"):
      return "Materials Science and Engineering";
    case lowerRollNo.includes("bma"):
      return "Mathematics and Computing";
    case lowerRollNo.includes("bph"):
      return "Engineering Physics";
    case lowerRollNo.includes("bee"):
      return "Electrical Engineering";
    case lowerRollNo.includes("bec") || lowerRollNo.includes("dec"):
      return "Electronics and Communication Engineering";
    case lowerRollNo.includes("bcs") || lowerRollNo.includes("dcs"):
      return "Computer Science and Engineering";
    case lowerRollNo.includes("bch"):
      return "Chemical Engineering";
    // case (lowerRollNo.includes("bhs")):
    //     return "Humanities and Social Sciences"
    default:
      throw Error("No Similar branch");
  }
}
/**
 * 
 * @param rollNo - The roll number of the student.
 * @returns The programme name as a string.
 */
export function determineProgramme(rollNo: string) {
  const programmeCode = rollNo.toLowerCase().substring(2, 5);
  let programme = Object.keys(PROGRAMME_KEYS)[0];

  for (const [key, value] of Object.entries(PROGRAMME_KEYS)) {
    if (value.includes(programmeCode)) {
      programme = key;
    }
  }

  return programme;
}
/**
 * Determines if a student has changed their branch based on their results.
 * @param result - The raw result data of the student.
 * @returns A tuple containing a boolean indicating if the branch has changed and the new department name if applicable.
 */

export function determineBranchChange(
  result: rawResultType
): [boolean, string | null] {
  if (result.semesters.length <= 2) {
    return [false, null];
  }

  const semesters = result.semesters.slice(2);
  const course_codes = semesters.flatMap((semester) =>
    semester.courses.map((course) => course.code)
  );
  // get the unique course codes
  const unique_course_codes = [...new Set(course_codes)];
  //  get the unique courses with prefix
  const unique_courses_prefix = unique_course_codes.map(
    (course_code: string) => course_code.toUpperCase().split("-")[0]
  );
  // count the number of courses with the same prefix using hashmap
  const course_count = unique_courses_prefix.reduce(
    (acc, course) => {
      acc[course] = (acc[course] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  //  get the highest count of the courses
  const max_courses = Math.max(...Object.values(course_count));
  // get the course prefix with the highest count
  const course_prefix = Object.keys(course_count).find(
    (course) => course_count[course] === max_courses
  );
  const department = getDepartmentCoursePrefix(course_prefix || "");
  if (
    !(department.trim() === "") &&
    department !== "other" &&
    department !== result.branch
  ) {
    return [true, department];
  }
  return [false, null];
}
