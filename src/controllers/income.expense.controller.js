import {
  createIncomeExpense,
  getIncomeExpenses,
  getIncomeExpenseById,
  updateIncomeExpense,
  deleteIncomeExpense,
  getIncomeExpenseSummary
} from "../services/income.expense.service.js";

/**
 * Create a new income or expense record
 * POST /api/income-expense/:userId
 */
export async function createIncomeExpenseController(req, res) {
  try {
    const { userId } = req.params;
    const payload = req.body || {};

    if (!payload.type || !["income", "expense"].includes(payload.type)) {
      return res.status(400).json({ success: false, error: "type is required and must be 'income' or 'expense'" });
    }
    if (payload.amount === undefined || isNaN(Number(payload.amount))) {
      return res.status(400).json({ success: false, error: "amount is required and must be a number" });
    }

    const record = await createIncomeExpense(userId, {
      type: payload.type,
      amount: Number(payload.amount),
      description: payload.description || null,
      category: payload.category || null,
      is_deductible: payload.is_deductible === true,
      date: payload.date || new Date().toISOString().slice(0, 10), 
      business_structure: payload.business_structure || null, 
      period_start: payload.period_start || null,
      period_end: payload.period_end || null
    });

    return res.status(201).json({
      success: true,
      message: "Income/Expense record created",
      data: record
    });
  } catch (err) {
    console.error("createIncomeExpenseController error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Get list of income/expense records (with optional filters)
 * GET /api/income-expense/:userId
 * Query params: startDate, endDate, type (income|expense), category, limit, offset
 */
export async function getIncomeExpensesController(req, res) {
  try {
    const { userId } = req.params;
    const { startDate, endDate, type, category, limit = 100, offset = 0 } = req.query;

    const records = await getIncomeExpenses(userId, {
      startDate,
      endDate,
      type,
      category,
      limit: Number(limit),
      offset: Number(offset)
    });

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (err) {
    console.error("getIncomeExpensesController error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Get single income/expense by id
 * GET /api/income-expense/:userId/:id
 */
export async function getIncomeExpenseByIdController(req, res) {
  try {
    const { userId, id } = req.params;
    const record = await getIncomeExpenseById(userId, id);

    return res.status(200).json({
      success: true,
      data: record
    });
  } catch (err) {
    console.error("getIncomeExpenseByIdController error:", err);
    const status = err.message === "Record not found" ? 404 : 500;
    return res.status(status).json({ success: false, error: err.message });
  }
}

/**
 * Update a record
 * PUT /api/income-expense/:userId/:id
 */
export async function updateIncomeExpenseController(req, res) {
  try {
    const { userId, id } = req.params;
    const updates = req.body || {};

    if (updates.amount !== undefined && isNaN(Number(updates.amount))) {
      return res.status(400).json({ success: false, error: "amount must be a number" });
    }

    const updated = await updateIncomeExpense(userId, id, {
      ...updates,
      amount: updates.amount !== undefined ? Number(updates.amount) : undefined,
      is_deductible: updates.is_deductible !== undefined ? !!updates.is_deductible : undefined
    });

    return res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: updated
    });
  } catch (err) {
    console.error("updateIncomeExpenseController error:", err);
    const status = err.message === "Record not found" ? 404 : 500;
    return res.status(status).json({ success: false, error: err.message });
  }
}

/**
 * Delete a record
 * DELETE /api/income-expense/:userId/:id
 */
export async function deleteIncomeExpenseController(req, res) {
  try {
    const { userId, id } = req.params;
    await deleteIncomeExpense(userId, id);

    return res.status(200).json({
      success: true,
      message: "Record deleted successfully"
    });
  } catch (err) {
    console.error("deleteIncomeExpenseController error:", err);
    const status = err.message === "Record not found" ? 404 : 500;
    return res.status(status).json({ success: false, error: err.message });
  }
}

/**
 * Summary endpoint (optional, useful for PBT)
 * GET /api/income-expense/:userId/summary?startDate=...&endDate=...
 *
 * Returns totals: totalRevenue, totalDeductibleExpenses, totalNonDeductibleExpenses, pbt
 */
export async function getIncomeExpenseSummaryController(req, res) {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    const summary = await getIncomeExpenseSummary(userId, { startDate, endDate });

    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (err) {
    console.error("getIncomeExpenseSummaryController error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
