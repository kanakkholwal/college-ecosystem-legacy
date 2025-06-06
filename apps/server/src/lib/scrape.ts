import axios from "axios";
import HTMLParser from "node-html-parser";
import { getDepartmentCoursePrefix } from "../constants/departments";
import type { rawResultType } from "../types/result";

const PROGRAMME_KEYS = {
  "Dual Degree": ["dcs", "dec"],
  "B.Tech": ["bce", "bme", "bms", "bma", "bph", "bee", "bec", "bcs", "bch"],
  "B.Arch": ["bar"],
  "M.Tech": ["mce", "mme", "mms", "mma", "mph", "mee", "mec", "mcs", "mch"],
};
const CACHE = new Map<string, string>();

const RESPONSE = {
  ERROR: {
    INVALID_ROLL_NO: "Invalid Roll No",
    BATCH_NOT_SUPPORTED: "Batch not supported",
    NO_SIMILAR_BRANCH: "No Similar branch",
    NO_PROGRAMME: "No Programme",
    NO_BRANCH: "No Branch",
    NO_URL: "No URL",
    NO_HEADERS: "No Headers",
    OTHER: "Something went wrong",
  },
  SUCCESS: {
    RESULT_FETCHED: "Result fetched successfully!",
  },
  OTHER: {
    WELCOME: "Welcome to the server!",
    HEALTHY: "Healthy",
    SOMETHING_WRONG: "Something went wrong!",
    OTHER: "Other",
  },
};

// function parseResponse(res_type:keyof typeof RESPONSE,response_code:keyof typeof RESPONSE[keyof typeof RESPONSE]){
//     return {
//         type:RESPONSE[res_type] ? res_type : "OTHER",
//         message:RESPONSE[res_type][response_code] ? RESPONSE[res_type][response_code] : RESPONSE.OTHER.OTHER
//     }
// }

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
        semester: "0".concat((index + 1).toString()).slice(-2), // pad with 0
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
    if (student.programme === "Dual Degree") {
      const data = await getInfoFromRollNo(rollNo, true);
      const [result, msg] = await fetchData(data.url, rollNo, data.headers);
      if (result === null) {
        return Promise.resolve({
          message: msg,
          data: null,
          error: "Invalid Roll No",
        });
      }
      const student_dual = await parseResult(result, {
        rollNo,
        ...data,
      });
      student.semesters = student.semesters.concat(
        student_dual.semesters.map((semester) => ({
          ...semester,
          // semester:  8 + idx + 1, // dual degree semesters start from 8
          semester: `${semester.semester} (masters)`,
        }))
      );
    }

    return Promise.resolve({
      message: "Result fetched successfully!",
      data: student,
      error: null,
    });
  } catch (err) {
    return Promise.resolve({
      message: "Something went wrong",
      data: null,
      error: err?.toString(),
    });
  }
}

const headerMap = new Map<
  string | number,
  {
    url: string;
    Referer: string;
    CSRFToken: string;
    RequestVerificationToken: string;
  }
>([
  [
    20,
    {
      url: "http://results.nith.ac.in/scheme20/studentresult/result.asp",
      Referer: "http://results.nith.ac.in/scheme20/studentresult/index.asp",
      CSRFToken: "{782F96DF-5115-4492-8CB2-06104ECFF0CA}",
      RequestVerificationToken: "094D0BF7-EE18-E102-8CBF-23C329B32E1C",
    },
  ],
  [
    21,
    {
      url: "http://results.nith.ac.in/scheme21/studentresult/result.asp",
      Referer: "http://results.nith.ac.in/scheme21/studentresult/index.asp",
      CSRFToken: "{D5D50B24-2DDE-4C35-9F41-10426C59EEA7}",
      RequestVerificationToken: "7BA3D112-507E-5379-EE25-9539F0DE9076",
    },
  ],
  [
    22,
    {
      url: "http://results.nith.ac.in/scheme22/studentresult/result.asp",
      Referer: "http://results.nith.ac.in/scheme22/studentresult/index.asp",
      CSRFToken: "{AF6DB03B-F6EC-475E-B331-6C9DE3846923}",
      RequestVerificationToken: "DA92D62F-BF6E-B268-4E04-F419F5EA6233",
    },
  ],
  [
    23,
    {
      url: "http://results.nith.ac.in/scheme23/studentresult/result.asp",
      Referer: "http://results.nith.ac.in/scheme23/studentresult/index.asp",
      CSRFToken: "{F1E16363-FEDA-48AF-88E9-8A186425C213}",
      RequestVerificationToken: "4FFEE8F3-14C9-27C4-B370-598406BF99C1",
    },
  ],
  [
    24,
    {
      url: "http://results.nith.ac.in/scheme24/studentresult/result.asp",
      Referer: "http://results.nith.ac.in/scheme24/studentresult/index.asp",
      CSRFToken: "{0696D16E-58AD-472B-890E-6537BE62A5EA}",
      RequestVerificationToken: "F797B72F-DC73-D06D-6B19-012ED5EBA98B",
    },
  ],
  [
    "21_dual",
    {
      url: "http://results.nith.ac.in/dualdegree21/studentresult/result.asp",
      Referer: "http://results.nith.ac.in/dualdegree21/studentresult/index.asp",
      CSRFToken: "{BC8FDC16-3133-429F-8FD7-CAC7026512F1}",
      RequestVerificationToken: "13FD6203-F8C9-FBC3-877F-3D7480CF2325",
    },
  ],
]);

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
