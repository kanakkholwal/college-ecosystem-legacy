import { z } from "zod";
import { serverFetch } from "~/lib/server-fetch";

/*
 **  APIs schemas
 */
// `/results/import-freshers`
const freshersDataSchema = z.array(
  z.object({
    name: z.string(),
    rollNo: z.string(),
    gender: z.enum(["male", "female", "not_specified"]),
  })
);
// `'/results/:rollNo'
const rollNoSchema = z
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

export function isValidRollNumber(rollNo: string): boolean {
  try {
    const response = rollNoSchema.safeParse(rollNo);
    return response.success;
  } catch {
    return false;
  }
}

const rawResultSchema = z.object({
  name: z.string(),
  rollNo: z.string(),
  branch: z.string(),
  batch: z.number(),
  programme: z.string(),
  gender: z.enum(["male","female","not_specified"]).nullable(),
  semesters: z.array(
    z.object({
      sgpi: z.number(),
      cgpi: z.number(),
      courses: z.array(
        z.object({
          name: z.string(),
          code: z.string(),
          cgpi: z.number(),
        })
      ),
      semester: z.number(),
      sgpi_total: z.number(),
      cgpi_total: z.number(),
    })
  ),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
type FunctionaryType = {
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
};

type HostelType = {
  name: string;
  slug: string;
  gender: "male" | "female" | "guest_hostel";
  warden: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  administrators: FunctionaryType[];
};

type FacultyType = {
  _id: string;
  name: string;
  email: string;
  department: string;
};

type Department = {
  name: string;
  code: string;
  short: string;
  roll_keys: string[];
  course_prefix: string;
  page: string;
};

/*
 **  APIs Payload types
 */

type ApiResponse<T> = {
  error: boolean;
  message: string;
  data: T;
};

type APITypes = {
  results: {
    importFreshers: {
      payload: z.infer<typeof freshersDataSchema>;
      response: Record<string, string>;
    };
    assignRank: {
      payload: undefined;
      response: Record<string, string>;
    };
    assignBranchChange: {
      payload: undefined;
      response: Record<string, string>;
    };
    getResultByRollNoFromSite: {
      payload: z.infer<typeof rollNoSchema>;
      response: z.infer<typeof rawResultSchema>;
    };
    getResultByRollNo: {
      payload: z.infer<typeof rollNoSchema>;
      response: z.infer<typeof rawResultSchema> & {
        _id: string;
        gender:"male" |"female" |"not_specified";
      };
    };
    addResultByRollNo: {
      payload: z.infer<typeof rollNoSchema>;
      response: z.infer<typeof rawResultSchema> & {
        _id: string;
        gender:"male" |"female" |"not_specified";
      };
    };
    updateResultByRollNo: {
      payload: z.infer<typeof rollNoSchema>;
      response: z.infer<typeof rawResultSchema> & {
        _id: string;
        gender:"male" |"female" |"not_specified";
      };
    };
  };
  hostels: {
    getAll: {
      payload: undefined;
      response: {
        in_charges: FunctionaryType[];
        hostels: HostelType[];
      };
    };
  };
  faculties: {
    searchByEmail: {
      payload: string;
      response: FacultyType;
    };
    refresh: {
      payload: undefined;
      response: FacultyType[];
    };
    getByDepartment: {
      payload: string;
      response: FacultyType[];
    };
  };
  departments: {
    getAll: {
      payload: undefined;
      response: string[];
    };
    getList: {
      payload: undefined;
      response: Department[];
    };
  };
};

/*
 **  Result APIs
 */

const results = {
  importFreshers: async (
    payload: APITypes["results"]["importFreshers"]["payload"]
  ) => {
    return await serverFetch<
      ApiResponse<APITypes["results"]["importFreshers"]["response"]>
    >("/results/import-freshers", {
      method: "POST",
      body: payload,
    });
  },
  assignRank: async () => {
    return await serverFetch<ApiResponse<Record<string, string>>>(
      "/results/assign-ranks",
      {
        method: "POST",
      }
    );
  },
  assignBranchChange: async () => {
    return await serverFetch<ApiResponse<Record<string, string>>>(
      "/results/assign-branch-change",
      {
        method: "POST",
      }
    );
  },
  getResultByRollNoFromSite: async (
    payload: APITypes["results"]["getResultByRollNoFromSite"]["payload"]
  ) => {
    return await serverFetch<
      ApiResponse<APITypes["results"]["getResultByRollNoFromSite"]["response"]>
    >("/results/:rollNo", {
      method: "POST",
      params: { rollNo: payload },
    });
  },
  getResultByRollNo: async (
    payload: APITypes["results"]["getResultByRollNo"]["payload"]
  ) => {
    return await serverFetch<
      ApiResponse<APITypes["results"]["getResultByRollNo"]["response"]>
    >("/results/:rollNo/get", {
      method: "GET",
      params: { rollNo: payload },
    });
  },
  addResultByRollNo: async (
    payload: APITypes["results"]["addResultByRollNo"]["payload"]
  ) => {
    return await serverFetch<
      ApiResponse<APITypes["results"]["addResultByRollNo"]["response"]>
    >("/results/:rollNo/add", {
      method: "POST",
      params: { rollNo: payload },
    });
  },
  updateResultByRollNo: async (
    payload: APITypes["results"]["updateResultByRollNo"]["payload"]
  ) => {
    return await serverFetch<
      ApiResponse<APITypes["results"]["updateResultByRollNo"]["response"]>
    >("/results/:rollNo/update", {
      method: "POST",
      params: { rollNo: payload },
    });
  },
} as const;

/*
 **  Hostel APIs
 */

const hostels = {
  getAll: async () => {
    return await serverFetch<
      ApiResponse<APITypes["hostels"]["getAll"]["response"]>
    >("/hostels", {
      method: "GET",
    });
  },
} as const;

/*
 **  Faculties APIs
 */

const faculties = {
  searchByEmail: async (email: string) => {
    return await serverFetch<ApiResponse<FunctionaryType>>(
      "/faculties/search/:email",
      {
        method: "GET",
        params: { email },
      }
    );
  },
  refresh: async () => {
    return await serverFetch<ApiResponse<Record<string, string>>>(
      "/faculties/refresh",
      {
        method: "GET",
      }
    );
  },
  getByDepartment: async (departmentCode: string) => {
    return await serverFetch<ApiResponse<FunctionaryType[]>>(
      "/faculties/:departmentCode",
      {
        method: "GET",
        params: { departmentCode },
      }
    );
  },
} as const;

/*
 **  Departments API
 */

const departments = {
  getAll: async () => {
    return await serverFetch<ApiResponse<FunctionaryType[]>>("/departments", {
      method: "GET",
    });
  },
  getList: async () => {
    return await serverFetch<ApiResponse<FunctionaryType[]>>(
      "/departments/list",
      {
        method: "GET",
      }
    );
  },
} as const;

/*
 **  Exports
 */

const serverApis = {
  results,
  hostels,
  faculties,
  departments,
} as const;

export default serverApis;
