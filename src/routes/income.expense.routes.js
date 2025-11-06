import express from "express";
import {
  createIncomeExpenseController,
  getIncomeExpensesController,
  getIncomeExpenseByIdController,
  updateIncomeExpenseController,
  deleteIncomeExpenseController,
  getIncomeExpenseSummaryController
} from "../controllers/income.expense.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/user/:userId", verifyToken, createIncomeExpenseController);
router.get("/user/:userId", verifyToken, getIncomeExpensesController);
router.get("/user/:userId/summary", verifyToken, getIncomeExpenseSummaryController);
router.get("/:id", verifyToken, getIncomeExpenseByIdController);
router.put("/:id", verifyToken, updateIncomeExpenseController);
router.delete("/:id", verifyToken, deleteIncomeExpenseController);

export default router;
