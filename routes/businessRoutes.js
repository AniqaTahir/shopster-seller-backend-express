import express from 'express';
import {
    addBusiness,
    getBusiness,
    updateBusiness,
    deleteBusiness
} from '../controllers/businessController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/addBusiness', protect, admin, addBusiness);
router.get('/getBusiness', protect, admin, getBusiness);
router.put('/updateBusiness/:id', protect, admin, updateBusiness);
router.delete('/deleteBusiness/:id', protect, admin, deleteBusiness);

export default router;
