import express from 'express';
import {
    addProduct, 
    getProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/addProduct', protect, admin, addProduct);
router.get('/getProduct', protect, admin, getProduct);
router.put('/updateProduct/:id', protect, admin, updateProduct);
router.delete('/deleteProduct/:id', protect, admin, deleteProduct);

export default router;
