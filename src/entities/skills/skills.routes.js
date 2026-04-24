import express from 'express';
import { deleteSkill, getAllSkill, getSingleSkill, skilliamge, updateSkill } from './skills.controller.js';
import { multerUpload } from '../../core/middlewares/multer.js';

const router = express.Router();

const uploadMiddleware = multerUpload([
  { name: 'skillImage', maxCount: 1 },
]);

router.post('/createSkill', uploadMiddleware, skilliamge);
router.put('/updateSkill/:id', uploadMiddleware, updateSkill);
router.get('/getallSkill', getAllSkill);
router.get('/getsingleSkill/:id', getSingleSkill);
router.delete('/deleteSkill/:id', deleteSkill);






export default router;
