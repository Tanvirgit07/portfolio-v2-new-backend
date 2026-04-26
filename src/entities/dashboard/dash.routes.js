import express from 'express';
import { getDashboardStats, getRecentKnowledge, getRecentProjects } from './dash.controller.js';
const router = express.Router();

router.get('/overview', getDashboardStats);
router.get('/recent-Knowledge', getRecentKnowledge);
router.get('/recent-project', getRecentProjects);



export default router;
