import express from 'express';
import {
    addCategory, getCategory, updateCategory, deleteCategory
} from '../controllers/categoryController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/addCategory', protect, admin, addCategory);
router.get('/getCategory', protect, admin, getCategory);
router.put('/updateCategory/:id', protect, admin, updateCategory);
router.delete('/deleteCategory/:id', protect, admin, deleteCategory);

export default router;
