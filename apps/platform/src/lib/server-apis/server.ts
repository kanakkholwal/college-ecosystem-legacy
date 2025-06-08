import { mailFetch, serverFetch } from "~/lib/server-fetch";
import type { APITypes, ApiResponse, FunctionaryType } from "./types";

/*
 **  Result APIs
 */

const results = {
  importFreshers: async (
    payload: APITypes["results"]["importFreshers"]["payload"]
  ) => {
    return await serverFetch<
      ApiResponse<APITypes["results"]["importFreshers"]["response"]>
    >("/api/results/import-freshers", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  assignRank: async () => {
    return await serverFetch<ApiResponse<Record<string, string>>>(
      "/api/results/assign-ranks",
      {
        method: "POST",
      }
    );
  },
  assignBranchChange: async () => {
    return await serverFetch<ApiResponse<Record<string, string>>>(
      "/api/results/assign-branch-change",
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
    >("/api/results/:rollNo", {
      method: "POST",
      params: { rollNo: payload },
    });
  },
  getResultByRollNo: async (
    payload: APITypes["results"]["getResultByRollNo"]["payload"]
  ) => {
    return await serverFetch<
      ApiResponse<APITypes["results"]["getResultByRollNo"]["response"]>
    >("/api/results/:rollNo/get", {
      method: "GET",
      params: { rollNo: payload },
    });
  },
  deleteResultByRollNo: async (
    payload: APITypes["results"]["deleteResultByRollNo"]["payload"]
  ) => {
    return await serverFetch<
      ApiResponse<APITypes["results"]["deleteResultByRollNo"]["response"]>
    >("/api/results/:rollNo/delete", {
      method: "DELETE",
      params: { rollNo: payload },
    });
  },
  addResultByRollNo: async (
    payload: APITypes["results"]["addResultByRollNo"]["payload"]
  ) => {
    return await serverFetch<
      ApiResponse<APITypes["results"]["addResultByRollNo"]["response"]>
    >("/api/results/:rollNo/add", {
      method: "POST",
      params: { rollNo: payload },
    });
  },
  updateResultByRollNo: async (
    payload: APITypes["results"]["updateResultByRollNo"]["payload"]
  ) => {
    return await serverFetch<
      ApiResponse<APITypes["results"]["updateResultByRollNo"]["response"]>
    >("/api/results/:rollNo/update", {
      method: "POST",
      params: { rollNo: payload[0] },
      body: JSON.stringify(payload[1]),
    });
  },
  getAbnormalResults: async (
  ) => {
    return await serverFetch<
      ApiResponse<APITypes["results"]["getAbnormalResults"]["response"]>
    >("/api/results/abnormals", {
      method: "GET",
    });
  },
  bulkUpdateResults: async (
    payload: APITypes["results"]["bulkUpdateResults"]["payload"]
  ) => {
    return await serverFetch<
      ApiResponse<APITypes["results"]["bulkUpdateResults"]["response"]>
    >("/api/results/bulk/update", {
      method: "POST",
      body: JSON.stringify({
        rollNos: payload,
      }),
    });
  },
  bulkDeleteResults: async (
    payload: APITypes["results"]["bulkDeleteResults"]["payload"]
  ) => {
    return await serverFetch<
      ApiResponse<APITypes["results"]["bulkDeleteResults"]["response"]>
    >("/api/results/bulk/delete", {
      method: "POST",
      body: JSON.stringify({
        rollNos: payload,
      }),
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
    >("/api/hostels", {
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
      "/api/faculties/search/:email",
      {
        method: "GET",
        params: { email },
      }
    );
  },
  refresh: async () => {
    return await serverFetch<ApiResponse<Record<string, string>>>(
      "/api/faculties/refresh",
      {
        method: "GET",
      }
    );
  },
  getByDepartment: async (departmentCode: string) => {
    return await serverFetch<ApiResponse<FunctionaryType[]>>(
      "/api/faculties/:departmentCode",
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
    return await serverFetch<ApiResponse<FunctionaryType[]>>(
      "/api/departments",
      {
        method: "GET",
      }
    );
  },
  getList: async () => {
    return await serverFetch<ApiResponse<FunctionaryType[]>>(
      "/api/departments/list",
      {
        method: "GET",
      }
    );
  },
} as const;
/*
 **  Mail API
 */
const mail = {
  sendResultUpdate:
    async (payload: APITypes["mail"]["sendResultUpdate"]["payload"]) => {
      return await mailFetch<
        ApiResponse<APITypes["mail"]["sendResultUpdate"]["response"]>
      >("/api/send", {
        method: "POST",
        body: payload,
      });
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
  mail
} as const;

export default serverApis;
