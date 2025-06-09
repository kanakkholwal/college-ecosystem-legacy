import { z } from "zod";
import { orgConfig } from "~/project.config";
import { formatNumberOrdinal } from "~/utils/number";

export const ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  CR: "cr",
  FACULTY: "faculty",
  HOD: "hod",
  ASSISTANT: "assistant",
  MMCA: "mmca",
  WARDEN: "warden",
  ASSISTANT_WARDEN: "assistant_warden",
  CHIEF_WARDEN: "chief_warden",
  LIBRARIAN: "librarian",
  STAFF: "staff",
  GUARD: "guard",
} as const;

export const ROLES_LIST: readonly string[] = Object.values(ROLES);

export const ROLES_MAP = Object.fromEntries(
  Object.entries(ROLES).map(([key, value]) => [value, key])
);

export const GENDER = {
  MALE: "male",
  FEMALE: "female",
  NOT_SPECIFIED: "not_specified",
};

export const emailSchema = z
  .string()
  .email()
  .refine((val) => val.endsWith(`@${orgConfig.domain}`), {
    message: `Email must end with @${orgConfig.domain}`,
  });
export const rollNoSchema = z
  .string()
  .regex(/^\d{2}[a-z]{3}\d{3}$/i)
  .refine(
    (rollNo) => {
      const numericPart = Number.parseInt(rollNo.slice(-3));
      return numericPart >= 1 && numericPart <= 999;
    },
    {
      message: "Invalid roll number",
    }
  );
export const isValidRollNumber = (rollNo: string): boolean => {
  return rollNoSchema.safeParse(rollNo).success;
}
export const Programmes = {
  "dual_degree": {
    name: "Dual Degree",
    scheme: "dualdegree",
    identifiers: ["dcs", "dec"],
    duration: 5,
  },
  "btech": {
    name: "B.Tech",
    scheme: "scheme",
    identifiers: ["bce", "bme", "bms", "bma", "bph", "bee", "bec", "bcs", "bch"],
    duration: 4,
  },
  "barch": {
    name: "B.Arch",
    scheme: "scheme",
    identifiers: ["bar"],
    duration: 5,
  },
  "mtech": {
    name: "M.Tech",
    scheme: "mtech",
    identifiers: ["mce", "mme", "mms", "mma", "mph", "mee", "mec", "mcs", "mch"],
    duration: 2,
  },
}
export const getProgrammeByIdentifier = (identifier: string, defaultBTech: boolean): typeof Programmes[keyof typeof Programmes] => {
  for (const programme of Object.values(Programmes)) {
    if (programme.identifiers.includes(identifier)) {
      if (defaultBTech && programme.scheme === Programmes["dual_degree"].scheme) {
        return Programmes["btech"]; // Return B.Tech if defaultBTech is true
      }
      return programme.name ? programme : Programmes["btech"]; // Default to B.Tech if no name is found
    }
  }
  return Programmes["btech"];
}
export const getAcademicYear = (rollNo: z.infer<typeof rollNoSchema>) => {
  const year = Number.parseInt(rollNo.slice(0, 2));
  const programme = getProgrammeByIdentifier(rollNo.toLowerCase().substring(2, 5), false);
  const currentYearFirstTwoDigits = new Date().getFullYear().toString().slice(0, 2); // Get first two digits of current year
  const batchYear = year + programme.duration;
  const currentYear = new Date().getFullYear() % 100; // Get last two digits of current year
  return {
    start: currentYearFirstTwoDigits + year,
    end: currentYearFirstTwoDigits + batchYear,
    label: `${currentYearFirstTwoDigits + year}-${batchYear}`,
    year: (batchYear - currentYear + 1) > 0 ? formatNumberOrdinal(batchYear - currentYear + 1) : "Pass out",
  }

};