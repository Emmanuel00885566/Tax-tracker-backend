import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  addTransactionController,
  getTransactionsController,
  getTransactionByIdController,
  updateTransactionController,
  deleteTransactionController,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/:userId", verifyToken, addTransactionController);
router.get("/:userId", verifyToken, getTransactionsController);
router.get("/:userId/:id", verifyToken, getTransactionByIdController);
router.put("/:userId/:id", verifyToken, updateTransactionController);
router.delete("/:userId/:id", verifyToken, deleteTransactionController);

export default router;
