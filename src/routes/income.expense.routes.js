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

// Create a new income or expense record
router.post("/:userId", verifyToken, createIncomeExpenseController);

// Get all income/expense records
router.get("/:userId", verifyToken, getIncomeExpensesController);

// Get one record by ID
router.get("/:userId/:id", verifyToken, getIncomeExpenseByIdController);

// Update a record
router.put("/:userId/:id", verifyToken, updateIncomeExpenseController);

// Delete a record
router.delete("/:userId/:id", verifyToken, deleteIncomeExpenseController);

// Summary route
router.get("/:userId/summary", verifyToken, getIncomeExpenseSummaryController);

export default router;
