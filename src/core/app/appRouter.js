import express from 'express';
import authRoutes from '../../entities/auth/auth.routes.js';
import userRoutes from '../../entities/user/user.routes.js';
import homeRoutes from '../../entities/home/home.routes.js';
import aboutRoutes from '../../entities/about/about.routes.js';
import skillsRoutes from '../../entities/skills/skills.routes.js';
import resumeRoutes from '../../entities/resume/resume.routes.js';
import projectRoutes from '../../entities/projects/project.routes.js';
import experienceRoutes from '../../entities/experience/experience.routes.js';


const router = express.Router();

router.use('/v1/auth', authRoutes);
router.use('/v1/user', userRoutes);
router.use('/v1/home', homeRoutes);
router.use('/v1/about', aboutRoutes);
router.use('/v1/skill', skillsRoutes);
router.use('/v1/resume', resumeRoutes);
router.use('/v1/project', projectRoutes);
router.use('/v1/experience', experienceRoutes);



export default router;
