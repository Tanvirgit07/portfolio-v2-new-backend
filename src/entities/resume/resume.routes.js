import express from 'express';
import { addResume, deleteResume, getActiveResume, getAllResume, updateResumeStatus } from './resume.controller.js';
import { multerUpload } from '../../core/middlewares/multer.js';

const router = express.Router();
const uploadMiddleware = multerUpload([
  { name: 'resumeFile', maxCount: 1 },
]);

router.post('/createResume', uploadMiddleware,addResume);
router.get('/getallResume',getAllResume);
router.put('/updateToggle/:id',updateResumeStatus);
router.delete('/deleteResume/:id',deleteResume);
router.get('/activeresume',getActiveResume);





export default router;
