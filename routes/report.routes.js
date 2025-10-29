import { Router } from 'express';
import { download } from '../controllers/report.controller.js';

const router = Router();
router.get('/download', download);
export default router;