import express from 'express';
import { createHome, deleteHero, getAllHero, getsingleHero, toggleHeroStatus, updateHome } from './home.controller.js';
import { multerUpload } from '../../core/middlewares/multer.js';

const router = express.Router();

const uploadMiddleware = multerUpload([
  { name: 'heroImage', maxCount: 1 },
  { name: 'heroIcon', maxCount: 1 }
]);

router.post('/createHomeContent', uploadMiddleware, createHome);
router.post('/updateHomeContent/:id', uploadMiddleware, updateHome);
router.get('/getallHomeContent', getAllHero);
router.get('/getSingleHomeContent/:id', getsingleHero);
router.delete('/deleteHomeContent/:id', deleteHero);
router.put('/toggleheroupdate/:id', toggleHeroStatus)


export default router;
