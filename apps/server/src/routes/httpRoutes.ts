import { type RequestHandler, Router } from "express";
import {
  getDepartments,
  getDepartmentsList,
} from "../controllers/http-department";
import {
  getFacultyByEmailHandler,
  getFacultyListByDepartmentHandler,
  refreshFacultyListHandler,
} from "../controllers/http-faculty_list";
import { getFunctionaryListByHostelHandler } from "../controllers/http-hostel";
import {
  addResult,
  assignBranchChangeToResults,
  assignRankToResults,
  deleteResult,
  getAbnormalResults,
  deleteAbNormalResults,
  getResult,
  getResultByRollNoFromSite,
  importFreshers,
  updateResult,
  bulkDeleteResults,
  bulkUpdateResults,
} from "../controllers/http-result";
import { resultScrapingSSEHandler } from "../controllers/sse-scraping";

const router = Router();

/** UTILS ENDPOINTS */

// Endpoint to get all the departments from the database
router.get("/departments", getDepartments);
router.get("/departments/list", getDepartmentsList);

// Endpoint to get all the faculties from the database
router.get("/faculties/search/:email", getFacultyByEmailHandler);
router.get("/faculties/refresh", refreshFacultyListHandler);
router.get("/faculties/:departmentCode", getFacultyListByDepartmentHandler);

// Endpoint to get all the functionaries from the site
router.get(
  "/hostels",
  getFunctionaryListByHostelHandler as unknown as RequestHandler
);

/** RESULT ENDPOINTS */
// Endpoint to import freshers results from the json data
router.post(
  "/results/import-freshers",
  importFreshers as unknown as RequestHandler
);
// Endpoint to assign ranks to the results in the database
router.post(
  "/results/assign-ranks",
  assignRankToResults 
);
router.post(
  "/results/assign-branch-change",
  assignBranchChangeToResults as unknown as RequestHandler
);
// Endpoint to get result by rollNo scraped from the website
router.get("/results/abnormals", getAbnormalResults);
router.delete("/results/abnormals", deleteAbNormalResults);
// Endpoint to [get,add,update,delete] result by rollNo from the database
router.post("/results/bulk/update", bulkUpdateResults);
router.post("/results/bulk/delete", bulkDeleteResults);

router.post("/results/:rollNo", getResultByRollNoFromSite);
// Endpoint to [get,add,update] result by rollNo from the database
router.get("/results/:rollNo/get", getResult);
router.post("/results/:rollNo/add", addResult);
router.put("/results/:rollNo/update", updateResult);
router.delete("/results/:rollNo/delete", deleteResult);


// Endpoint to get result by rollNo scraped from the website
router.get("/results/scrape-sse",resultScrapingSSEHandler as unknown as RequestHandler);

export default router;
