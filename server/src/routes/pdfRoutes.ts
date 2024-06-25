import express from 'express';
import { generatePDF } from '../controllers/pdfController';
import authMiddleware from '../middleware/authmiddleware';

const router = express.Router();

router.post('/generate-pdf', authMiddleware, generatePDF);

export default router;
