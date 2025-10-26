import express from "express";
import { computeTaxController, getTaxRecordsController } from "../controllers/taxController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/compute/:userId", authMiddleware, computeTaxController);
router.get("/records/:userId", authMiddleware, getTaxRecordsController);

export default router;
