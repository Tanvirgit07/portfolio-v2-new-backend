import express from 'express';
import { createFeedback, deleteFeedback, getAllFeedback, getSingleFeedback } from './feedback.controller.js';

const router = express.Router();

router.post('/createfeedback', createFeedback);
router.get('/getAllfeedback', getAllFeedback);
router.get('/getsinglefeedback/:id', getSingleFeedback);
router.delete('/deletefeedback/:id', deleteFeedback);


export default router;
