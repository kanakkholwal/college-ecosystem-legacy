import { DEPARTMENT_CODES } from "src/constants/departments";

export const CATEGORY_TYPES = [
  "academics",
  "departmental",
  "technology",
  "design",
  "activities",
  "others",
] as const;
export const SUB_CATEGORY_TYPES: readonly string[] = DEPARTMENT_CODES;

export const CATEGORY_IMAGES: Record<string, string> = {
  academics: "/assets/images/community.academics.png",
  departmental: "/assets/images/community.departmental.png",
  technology: "/assets/images/community.technology.png",
  design: "/assets/images/community.design.png",
  activities: "/assets/images/community.activities.png",
  others: "/assets/images/community.others.png",
};
