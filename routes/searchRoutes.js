import express from 'express';
import {
    searchProducts,
} from '../controllers/searchController.js';

const router = express.Router();

router.post('/searchProducts', searchProducts);

export default router;
