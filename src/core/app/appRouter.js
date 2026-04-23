import express from 'express';
import authRoutes from '../../entities/auth/auth.routes.js';
import userRoutes from '../../entities/user/user.routes.js';
import homeRoutes from '../../entities/home/home.routes.js';
import aboutRoutes from '../../entities/about/about.routes.js';



const router = express.Router();


router.use('/v1/auth', authRoutes);
router.use('/v1/user', userRoutes);
router.use('/v1/home', homeRoutes)
router.use('/v1/about', aboutRoutes)
  

export default router;
