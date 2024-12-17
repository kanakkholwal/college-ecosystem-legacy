import axios from "axios";
import HTMLParser from "node-html-parser";
import type { rawResultType } from "~/types/result";

const PROGRAMME_KEYS = {
    "Dual Degree": ["dcs", "dec"],
    "B.Tech": [
        "bce",
        "bme",
        "bms",
        "bma",
        "bph",
        "bee",
        "bec",
        "bcs",
        "bch",
    ],
    "B.Arch": ["bar"],
    "M.Tech": ["mce", "mme", "mms", "mma", "mph", "mee", "mec", "mcs", "mch"],
}
const CACHE = new Map<string, string>();

const RESPONSE = {
    "ERROR": {
        "INVALID_ROLL_NO": "Invalid Roll No",
        "BATCH_NOT_SUPPORTED": "Batch not supported",
        "NO_SIMILAR_BRANCH": "No Similar branch",
        "NO_PROGRAMME": "No Programme",
        "NO_BRANCH": "No Branch",
        "NO_URL": "No URL",
        "NO_HEADERS": "No Headers",
        "OTHER": "Something went wrong",
    },
    "SUCCESS": {
        "RESULT_FETCHED": "Result fetched successfully!",
    },
    "OTHER": {
        "WELCOME": "Welcome to the server!",
        "HEALTHY": "Healthy",
        "SOMETHING_WRONG": "Something went wrong!",
        "OTHER": "Other",
    }
}


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
): Promise<string | null> => {
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
            return Promise.resolve(null)
        }
        return Promise.resolve(response.data.toString())
    } catch (error) {
        console.error("Error fetching data:", error);
        return Promise.resolve(null)
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
        semesters: [],
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
                semester: 0,
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
            student.semesters[index].semester = (`0${index + 1}`).slice(
                -2
            ) as unknown as number;
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

    console.log("Result parsed");
    return Promise.resolve(student);

};



export async function scrapeResult(rollNo: string): Promise<{
    message: string;
    data: rawResultType | null;
    error?: string | null;
}> {
    const data = await getInfo(rollNo);

    console.log("Roll No: %s, Data: %o", rollNo, data);
    try {
        console.log("evaluating");
        const result = await fetchData(data.url, rollNo, data.headers);
        if (result === null) {
            return Promise.resolve({
                message: "Invalid Roll No",
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
        return Promise.resolve({
            message: "Result fetched successfully!",
            data: student,
            error: null,
        });
    } catch (err) {
        return Promise.resolve({
            message: "Something went wrong",
            data: null,
            error: err?.toString()
        });
    }

}
const headerMap: Record<
    number,
    {
        url: string;
        Referer: string;
        CSRFToken: string;
        RequestVerificationToken: string;
    }
> = {
    20: {
        url: "http://results.nith.ac.in/scheme20/studentresult/result.asp",
        Referer: "http://results.nith.ac.in/scheme20/studentresult/index.asp",
        CSRFToken: "{782F96DF-5115-4492-8CB2-06104ECFF0CA}",
        RequestVerificationToken: "094D0BF7-EE18-E102-8CBF-23C329B32E1C",
    },
    21: {
        url: "http://results.nith.ac.in/scheme21/studentresult/result.asp",
        Referer: "http://results.nith.ac.in/scheme21/studentresult/index.asp",
        CSRFToken: "{D5D50B24-2DDE-4C35-9F41-10426C59EEA7}",
        RequestVerificationToken: "7BA3D112-507E-5379-EE25-9539F0DE9076",
    },
    22: {
        url: "http://results.nith.ac.in/scheme22/studentresult/result.asp",
        Referer: "http://results.nith.ac.in/scheme22/studentresult/index.asp",
        CSRFToken: "{AF6DB03B-F6EC-475E-B331-6C9DE3846923}",
        RequestVerificationToken: "DA92D62F-BF6E-B268-4E04-F419F5EA6233",
    },
    23: {
        url: "http://results.nith.ac.in/scheme23/studentresult/result.asp",
        Referer: "http://results.nith.ac.in/scheme23/studentresult/index.asp",
        CSRFToken: "{F1E16363-FEDA-48AF-88E9-8A186425C213}",
        RequestVerificationToken: "4FFEE8F3-14C9-27C4-B370-598406BF99C1",
    },
};
async function getInfo(rollNo: string) {
    // split the roll no into 3 parts starting two characters then 3 characters and then 3 characters
    const matches = [
        rollNo.toLowerCase().substring(0, 2), // 20
        rollNo.toLowerCase().substring(2, 5), // dec,bec,bar
        rollNo.toLowerCase().substring(5, 8), // 001
    ];
    //  check if we have header for the batch
    if (!headerMap[Number.parseInt(matches[0])]) {
        if (Number.parseInt(matches[0]) < 20 && !PROGRAMME_KEYS["Dual Degree"].includes(matches[1])) {
            return Promise.reject({
                type: "ERROR",
                message: RESPONSE.ERROR.BATCH_NOT_SUPPORTED
            });
        }
        if (Number.parseInt(matches[0]) >= 20 && (
            PROGRAMME_KEYS["B.Tech"].includes(matches[1]) ||
            PROGRAMME_KEYS["B.Arch"].includes(matches[1]) ||
            PROGRAMME_KEYS["Dual Degree"].includes(matches[1]))) {
            // New batches
            if (CACHE.has(matches[0] + matches[1])) {
                const data = CACHE.get(matches[0] + matches[1]);
                headerMap[Number.parseInt(matches[0])] = JSON.parse(data || "");
            } else if (!headerMap[Number.parseInt(matches[0])]) {
                headerMap[Number.parseInt(matches[0])] = {
                    url: `http://results.nith.ac.in/scheme${matches[0]}/studentresult/result.asp`,
                    Referer: `http://results.nith.ac.in/scheme${matches[0]}/studentresult/index.asp`,
                    CSRFToken: `{${Math.random().toString(36).substring(2, 36)}}`,
                    RequestVerificationToken: `${Math.random().toString(36).substring(2, 36)}`,
                };
                const response = await axios.get(headerMap[Number.parseInt(matches[0])].url);
                const document = HTMLParser.parse(response.data.toString());
                headerMap[Number.parseInt(matches[0])].CSRFToken = document.querySelector(
                    'input[name="CSRFToken"]'
                )?.getAttribute("value") || "";
                headerMap[Number.parseInt(matches[0])].RequestVerificationToken = document.querySelector(
                    'input[name="RequestVerificationToken"]'
                )?.getAttribute("value") || "";
                CACHE.set(matches[0] + matches[1], JSON.stringify(headerMap[Number.parseInt(matches[0])]));
            }
        }
    }
    return {
        batch: Number.parseInt(`20${matches[0]}`),
        branch: determineDepartment(rollNo),
        url: headerMap[Number.parseInt(matches[0])].url,
        headers: {
            Referer: headerMap[Number.parseInt(matches[0])].Referer,
            CSRFToken: headerMap[Number.parseInt(matches[0])].CSRFToken,
            RequestVerificationToken:
                headerMap[Number.parseInt(matches[0])].RequestVerificationToken,
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
export function determineProgramme(RollNo: string) {
    const lowerRollNo = RollNo.toLowerCase();

    switch (true) {
        case lowerRollNo.includes("dcs") || lowerRollNo.includes("dec"):
            return "Dual Degree";
        case lowerRollNo.includes("bar"):
            return "B.Arch";
        default:
            return "B.Tech";
    }
}
