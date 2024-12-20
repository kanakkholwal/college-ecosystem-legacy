interface Department {
  name: string;
  code: string;
  short: string;
  keys: string[];
  page:string;
}

export const DEPARTMENTS_LIST: readonly Department[] = [
  {
    name: "Computer Science and Engineering",
    code: "cse",
    short: "CSE",
    keys:["bcs","dcs","mcs"],
    page:"https://nith.ac.in/computer-science-engineering"
  },
  {
    name: "Electronics and Communication Engineering",
    code: "ece",
    short: "ECE",
    keys:["bec","dec","mec"],
    page:"https://nith.ac.in/electronics-communication-engineering"
  },
  {
    name: "Electrical Engineering",
    code: "ee",
    short: "EE",
    keys:["bee","mee"],
    page:"https://nith.ac.in/electrical-engineering"
  },
  {
    name: "Mechanical Engineering",
    code: "me",
    short: "ME",
    keys:["bme","mme"],
    page:"https://nith.ac.in/mechanical-engineering"
  },
  {
    name: "Civil Engineering",
    code: "ce",
    short: "CE",
    keys:["bce","mce"],
    page:"https://nith.ac.in/Departments/topic/130"
  },
  {
    name: "Chemical Engineering",
    code: "che",
    short: "CHE",
    keys:["bch","mch"],
    page:"https://nith.ac.in/chemistry"
  },
  {
    name: "Materials Science and Engineering",
    code: "mse",
    short: "MSE",
    keys:["bms","mms"],
    page:"https://nith.ac.in/material-science-engineering"
  },
  {
    name: "Mathematics & Scientific Computing",
    code: "mnc",
    short: "MNC",
    keys:["bma","mma"],
    page:"https://nith.ac.in/mathematics-scientific-computing"
  },
  {
    name: "Architecture",
    code: "arc",
    short: "ARC",
    keys:["bar","mar"],
    page:"https://nith.ac.in/Departments/topic/287"
  },
  {
    name: "Engineering Physics",
    code: "phy",
    short: "PHY",
    keys:["bph","mph"],
    page:"https://nith.ac.in/physics-photonics-science"
  },
] as const;

export const DEPARTMENTS: readonly string[] = DEPARTMENTS_LIST.map(
  (dept) => dept.name
);
export const DEPARTMENT_CODES: readonly string[] = DEPARTMENTS_LIST.map(
  (dept) => dept.code
);

export const getDepartmentName = (code: string) => {
  const department = DEPARTMENTS_LIST.find((dept) => dept.code === code);
  return department ? department.name : "other";
};

export const getDepartmentCode = (name: string) => {
  const department = DEPARTMENTS_LIST.find((dept) => dept.name === name);
  return department ? department.code : "other";
};

export const getDepartmentShort = (code: string) => {
  const department = DEPARTMENTS_LIST.find((dept) => dept.code === code);
  return department ? department.short : "";
}

export const getDepartmentByRollNo = (rollNo: string) => {
  if(!isValidRollNumber(rollNo)) {
    return "other";
  }
  const matches = [
    rollNo.toLowerCase().substring(0, 2),
    rollNo.toLowerCase().substring(2, 5),
    rollNo.toLowerCase().substring(5, 8),
  ];
  for (const dept of DEPARTMENTS_LIST) {
    if (dept.keys.includes(matches[1])) {
      return dept.name;
    }
  }
}

export function isValidRollNumber(rollNo: string): boolean {
  const rollNoPattern = /^\d{2}[a-z]{3}\d{3}$/i;

  if (!rollNoPattern.test(rollNo)) {
    return false;
  }

  const numericPart = Number.parseInt(rollNo.slice(-3));
  return numericPart >= 1 && numericPart <= 999;
}
