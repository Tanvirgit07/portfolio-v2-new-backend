import express from 'express';
import { multerUpload } from '../../core/middlewares/multer.js';
import { createKnowledge, deleteKnowledge, getAllKnowledge, getSingleKnowledge, updateKnowledge } from './knoledge.controller.js';
const router = express.Router();

// ইমেজের জন্য ৫টি এবং ভিডিওর জন্য ১টি লিমিট
const uploadMiddleware = multerUpload([
  { name: 'images', maxCount: 5 },
  { name: 'video', maxCount: 1 }
]);

router.post('/create-knowledge', uploadMiddleware, createKnowledge);
router.put('/update-knowledge/:id', uploadMiddleware, updateKnowledge);
router.get('/all-knowledge', getAllKnowledge);
router.get('/single-knowledge/:id', getSingleKnowledge);
router.delete('/delete-knowledge/:id', deleteKnowledge);

export default router;