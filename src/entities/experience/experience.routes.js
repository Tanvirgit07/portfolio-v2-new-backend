import express from 'express';
import { createExperience, deleteExperience, getAllExperience, getSingleExperience, updateExperience } from './experience.controller.js';

const router = express.Router();

router.post('/createExpe', createExperience);
router.put('/updateExpe/:id', updateExperience);
router.get('/getallexp', getAllExperience);
router.get('/getsingleexp/:id', getSingleExperience);
router.delete('/deleteexp/:id', deleteExperience);




export default router;
