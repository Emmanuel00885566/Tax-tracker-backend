import express from "express";
import {
  computeTaxController,
  getTaxRecordsController,
  markTaxAsPaidController,
  getTaxSummaryController
} from "../controllers/tax.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/compute/:userId", verifyToken, computeTaxController);
router.get("/records/:userId", verifyToken, getTaxRecordsController);
router.patch("/mark-paid/:userId/:taxId", verifyToken, markTaxAsPaidController);
router.get("/summary/:userId", verifyToken, getTaxSummaryController);

export default router;
