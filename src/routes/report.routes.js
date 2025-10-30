import express from 'express';
import { download } from '../controllers/report.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/download', verifyToken, download);

export default router;