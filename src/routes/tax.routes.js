import express from "express";
import {
  computeTaxController,
  getTaxRecordsController,
} from "../controllers/tax.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Compute tax for a specific user
router.post("/compute/:userId", verifyToken, computeTaxController);

// Fetch tax records for a specific user
router.get("/records/:userId", verifyToken, getTaxRecordsController);

export default router;
