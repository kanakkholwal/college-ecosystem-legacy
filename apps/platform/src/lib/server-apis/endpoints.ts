import type { ApiConfigMap } from "./base-api";
import type { ApiResponse, APITypes } from "./types";
/*
 **  Result APIs
 */
//  ApiConfigMap<APITypes["results"], ApiResponse<any>> 
const results:ApiConfigMap = {
  importFreshers:{
    url: "/api/results/import-freshers",
    method: "POST",
    transformBody: (payload: APITypes["results"]["importFreshers"]["payload"]) => payload,
    transformResponse: (res: unknown) => res as ApiResponse<APITypes["results"]["importFreshers"]["response"]>,
  },
  assignRank: {
    url: "/api/results/assign-ranks",
    method: "POST",
    transformResponse: (res: unknown) => res as ApiResponse<APITypes["results"]["assignRank"]["response"]>,
  },
  assignBranchChange: {
    url: "/api/results/assign-branch-change",
    method: "POST",
    transformResponse: (res: unknown) => res as ApiResponse<APITypes["results"]["assignBranchChange"]["response"]>,
  },
  getResultByRollNoFromSite: {
    url: "/api/results/:rollNo",
    method: "POST",
    transformParams: (payload: APITypes["results"]["getResultByRollNoFromSite"]["payload"]) => ({
      rollNo: payload,
    }),
    transformResponse: (res: unknown) => res as ApiResponse<APITypes["results"]["getResultByRollNoFromSite"]["response"]>,
  },
  getResultByRollNo: {
    url: "/api/results/:rollNo/get",
    method: "GET",
    transformParams: (payload: APITypes["results"]["getResultByRollNo"]["payload"]) => ({
      rollNo: payload,
    }),
    transformResponse: (res: unknown) => res as APITypes["results"]["getResultByRollNo"]["response"],
  },
  deleteResultByRollNo: {
    url: "/api/results/:rollNo/delete",
    method: "DELETE",
    transformParams: (payload: APITypes["results"]["deleteResultByRollNo"]["payload"]) => ({
      rollNo: payload,
    }),
    transformResponse: (res: unknown) => res as ApiResponse<APITypes["results"]["deleteResultByRollNo"]["response"]>,
  },
  addResultByRollNo: {
    url: "/api/results/:rollNo/add",
    method: "POST",
    transformParams: (payload: APITypes["results"]["addResultByRollNo"]["payload"]) => ({
      rollNo: payload,
    }),
    transformResponse: (res: unknown) => res as ApiResponse<APITypes["results"]["addResultByRollNo"]["response"]>,
  },
  updateResultByRollNo: {
    url: "/api/results/:rollNo/update",
    method: "PUT",
    transformParams: (payload: APITypes["results"]["updateResultByRollNo"]["payload"]) => ({
      rollNo: payload[0],
    }),
    transformBody: (payload: APITypes["results"]["updateResultByRollNo"]["payload"]) => payload[1],
    transformResponse: (res: unknown) => res as ApiResponse<APITypes["results"]["updateResultByRollNo"]["response"]>,
  },
  getAbnormalResults: {
    url: "/api/results/abnormal",
    method: "GET",
    transformResponse: (res: unknown) => res as ApiResponse<APITypes["results"]["getAbnormalResults"]["response"]>,
  },
  deleteAbNormalResults: {
    url: "/api/results/abnormal/delete",
    method: "DELETE",
    transformResponse: (res: unknown) => res as ApiResponse<APITypes["results"]["deleteAbNormalResults"]["response"]>,
  },
  bulkUpdateResults:{
    url: "/api/results/bulk-update",
    method: "POST",
    transformBody: (payload: APITypes["results"]["bulkUpdateResults"]["payload"]) => payload,
    transformResponse: (res: unknown) => res as ApiResponse<APITypes["results"]["bulkUpdateResults"]["response"]>,
  },
  bulkDeleteResults:{
    url: "/api/results/bulk-delete",
    method: "POST",
    transformBody: (payload: APITypes["results"]["bulkDeleteResults"]["payload"]) => payload,
    transformResponse: (res: unknown) => res as ApiResponse<APITypes["results"]["bulkDeleteResults"]["response"]>,
  }

} as const;

/*
 **  Hostel APIs
 */

export const hostels:ApiConfigMap = {
  getAll:{
    url: "/api/hostels",
    method: "GET",
    transformResponse: (res: unknown) => res as ApiResponse<APITypes["hostels"]["getAll"]["response"]>,
  }
} as const;

/*
 **  Faculties APIs
 */

export const faculties:ApiConfigMap = {
 searchByEmail:{
  url: "/api/faculties/search/:email",
  method: "GET",
  transformParams: (payload: APITypes["faculties"]["searchByEmail"]["payload"]) => ({
    email: payload,
  }),
  transformResponse: (res: unknown) => res as ApiResponse<APITypes["faculties"]["searchByEmail"]["response"]>,
 },
  refresh: {
    url: "/api/faculties/refresh",
    method: "GET",
    transformResponse: (res: unknown) => res as ApiResponse<APITypes["faculties"]["refresh"]["response"]>,
  },
  getByDepartment: {
    url: "/api/faculties/:departmentCode",
    method: "GET",
    transformParams: (payload: APITypes["faculties"]["getByDepartment"]["payload"]) => ({
      departmentCode: payload,
    }),
    transformResponse: (res: unknown) => res as ApiResponse<APITypes["faculties"]["getByDepartment"]["response"]>,
  }
} as const;


/*
 **  Departments API
 */

export const departments:ApiConfigMap = {
  getAll: {
    url: "/api/departments",
    method: "GET",
    transformResponse: (res: unknown) => res as ApiResponse<APITypes["departments"]["getAll"]["response"]>,
  },
  getList: {
    url: "/api/departments/list",
    method: "GET",
    transformResponse: (res: unknown) => res as ApiResponse<APITypes["departments"]["getList"]["response"]>,
  },

} as const;

/*
 **  Mail API
 */
export const mail:ApiConfigMap  = {
  sendResultUpdate:{
    url: "/api/send",
    method: "POST",
    transformBody: (payload: APITypes["mail"]["sendResultUpdate"]["payload"]) => payload,
    transformResponse: (res: unknown) => res as ApiResponse<APITypes["mail"]["sendResultUpdate"]["response"]>,
  }

} as const;

/*
 **  Exports
 */

const serverApis = {
  results,
  hostels,
  faculties,
  departments,
  mail,
} as const;

export default serverApis;
