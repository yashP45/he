import express from 'express';
import { addProduct } from '../controllers/productController';
import authMiddleware from '../middleware/authmiddleware';

const router = express.Router();

router.post('/products', authMiddleware, addProduct);

export default router;
