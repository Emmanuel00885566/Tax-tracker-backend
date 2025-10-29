import express from "express";
import { computeTaxController, getTaxRecordsController } from "../controllers/tax.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/compute/:userId", authMiddleware, computeTaxController);
router.get("/records/:userId", authMiddleware, getTaxRecordsController);

export default router;
