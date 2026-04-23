import express from 'express';
import { multerUpload } from '../../core/middlewares/multer.js';
import { createAbout, deleteAbout, getAllAbouts, getSingleAbout, toggleAboutStatus, updateAbout } from './about.controller.js';

const router = express.Router();

const uploadMiddleware = multerUpload([{ name: 'profileImage', maxCount: 1 }]);


router.post('/createAboutContent', uploadMiddleware, createAbout);
router.put('/updateAboutContent/:id', uploadMiddleware, updateAbout);
router.get('/getallaboutContent', getAllAbouts);
router.get('/getsingleAbout/:id', getSingleAbout);
router.delete('/deleteAbout/:id', deleteAbout);
router.put('/updateIsActiveAbout/:id', toggleAboutStatus);





export default router;
