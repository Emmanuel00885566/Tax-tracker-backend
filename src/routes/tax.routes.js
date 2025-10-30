import express from "express";
<<<<<<< HEAD
import {
  computeTaxController,
  getTaxRecordsController,
} from "../controllers/tax.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/compute/:userId", verifyToken, computeTaxController);
router.get("/records/:userId", verifyToken, getTaxRecordsController);

export default router;
=======
import { computeTaxController, getTaxRecordsController } from "../controllers/tax.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/compute/:userId", authMiddleware, computeTaxController);
router.get("/records/:userId", authMiddleware, getTaxRecordsController);

export default router;
>>>>>>> f5559883edf04ade6a7eb30f410e0b66df986659
