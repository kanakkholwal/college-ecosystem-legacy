import { Router } from 'express';
import { getDepartments, getDepartmentsList } from '../controllers/http-department';
import { getFacultyByEmailHandler, getFacultyListByDepartmentHandler } from '../controllers/http-faculty_list';
import { addUpdateResult, assignRankToResults, getResult, getResultByRollNoFromSite } from '../controllers/http-result';

const router = Router();


/** UTILS ENDPOINTS */

// Endpoint to get all the departments from the database
router.get('/departments', getDepartments);
router.get('/departments/list', getDepartmentsList);

// Endpoint to get all the faculties from the database
router.get('/faculties/search/:email', getFacultyByEmailHandler);
router.get('/faculties/:departmentCode', getFacultyListByDepartmentHandler);



/** RESULT ENDPOINTS */
// Endpoint to assign ranks to the results in the database
router.post('/results/assign-ranks', assignRankToResults);
// Endpoint to get result by rollNo scraped from the website
router.post('/results/:rollNo', getResultByRollNoFromSite);
// Endpoint to [get,add,update] result by rollNo from the database
router.get('/results/:rollNo/get', getResult);
router.post('/results/:rollNo/add', addUpdateResult);
router.post('/results/:rollNo/update', addUpdateResult);



export default router;
