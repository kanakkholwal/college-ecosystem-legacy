import { Router } from 'express';
import { getDepartments, getDepartmentsList } from '~/controllers/http-department';
import { getFacultyByEmailHandler, getFacultyListByDepartmentHandler } from '~/controllers/http-faculty_list';
import { addUpdateResult, getResult, getResultByRollNoFromSite } from '~/controllers/http-result';

const router = Router();


/** UTILS ENDPOINTS */

// Endpoint to get all the faculties from the database
router.get('/departments/faculty/:email', getFacultyByEmailHandler);
router.get('/departments/:departmentCode', getFacultyListByDepartmentHandler);

// Endpoint to get all the departments from the database
router.get('/departments', getDepartments);
router.get('/departments/list', getDepartmentsList);


/** RESULT ENDPOINTS */

// Endpoint to get result by rollNo scraped from the website
router.post('/result/:rollNo', getResultByRollNoFromSite);

// Endpoint to get result by rollNo from the database
router.get('/result/:rollNo/get', getResult);
router.post('/result/:rollNo/add', addUpdateResult);
router.post('/result/:rollNo/update', addUpdateResult);



export default router;
