export const DEPARTMENTS_LIST = [
  {
    name: "Computer Science and Engineering",
    code: "cse",
    short: "CSE",
  },
  {
    name: "Electronics and Communication Engineering",
    code: "ece",
    short: "ECE",
  },
  {
    name: "Electrical Engineering",
    code: "ee",
    short: "EE",
  },
  {
    name: "Mechanical Engineering",
    code: "me",
    short: "ME",
  },
  {
    name: "Civil Engineering",
    code: "ce",
    short: "CE",
  },
  {
    name: "Chemical Engineering",
    code: "che",
    short: "CHE",
  },
  {
    name: "Materials Science and Engineering",
    code: "mse",
    short: "MSE",
  },
  {
    name: "Mathematics and Computing",
    code: "mnc",
    short: "MNC",
  },
  {
    name: "Engineering Physics",
    code: "phy",
    short: "PHY",
  },
  {
    name: "Architecture",
    code: "arc",
    short: "ARC",
  },
];

export const DEPARTMENTS: readonly string[] = DEPARTMENTS_LIST.map(
  (dept) => dept.name
);
export const DEPARTMENT_CODES: readonly string[] = DEPARTMENTS_LIST.map(
  (dept) => dept.code
);

export const getDepartmentName = (code: string) => {
  const department = DEPARTMENTS_LIST.find((dept) => dept.code === code);
  return department ? department.name : "";
};

export const getDepartmentCode = (name: string) => {
  const department = DEPARTMENTS_LIST.find((dept) => dept.name === name);
  return department ? department.code : "";
};
