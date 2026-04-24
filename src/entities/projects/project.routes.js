import express from 'express';
import { multerUpload } from '../../core/middlewares/multer.js';
import { createProject, deleteProject, getAllProject, getSingleProject, updateProject } from './project.controller.js';

const router = express.Router();

const uploadMiddleware = multerUpload([
  { name: 'images', maxCount: 5 },
  { name: 'video', maxCount: 1 }
]);

router.post('/createProject', uploadMiddleware, createProject);
router.post('/updateProject/:id', uploadMiddleware, updateProject);
router.get('/getallproject', getAllProject);
router.get('/getsingleproject/:id', getSingleProject);
router.delete('/deleteproject/:id', deleteProject);






export default router;
