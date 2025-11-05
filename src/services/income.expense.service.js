import IncomeExpense from "../models/income.expense.model.js";
import { Op } from "sequelize";

// Create a new income or expense record
export async function createIncomeExpense(userId, data) {
  return await IncomeExpense.create({ user_id: userId, ...data });
}

// Get all income/expense records with optional filters
export async function getIncomeExpenses(userId, filters = {}) {
  const where = { user_id: userId };

  if (filters.type) where.type = filters.type;
  if (filters.category) where.category = filters.category;
  if (filters.startDate && filters.endDate) {
    where.date = { [Op.between]: [filters.startDate, filters.endDate] };
  }

  return await IncomeExpense.findAll({
    where,
    order: [["date", "DESC"]],
    limit: filters.limit,
    offset: filters.offset
  });
}

// Get a single record by ID
export async function getIncomeExpenseById(userId, id) {
  const record = await IncomeExpense.findOne({ where: { id, user_id: userId } });
  if (!record) throw new Error("Record not found");
  return record;
}

// Update a record
export async function updateIncomeExpense(userId, id, updates) {
  const record = await IncomeExpense.findOne({ where: { id, user_id: userId } });
  if (!record) throw new Error("Record not found");

  await record.update(updates);
  return record;
}

// Delete a record
export async function deleteIncomeExpense(userId, id) {
  const record = await IncomeExpense.findOne({ where: { id, user_id: userId } });
  if (!record) throw new Error("Record not found");

  await record.destroy();
  return true;
}

// Compute a summary for dashboard (profit before tax, totals, etc.)
export async function getIncomeExpenseSummary(userId, { startDate, endDate } = {}) {
  const where = { user_id: userId };

  if (startDate && endDate) {
    where.date = { [Op.between]: [startDate, endDate] };
  }

  const records = await IncomeExpense.findAll({ where });

  let totalRevenue = 0;
  let totalDeductibleExpenses = 0;
  let totalNonDeductibleExpenses = 0;

  for (const rec of records) {
    if (rec.type === "income") {
      totalRevenue += rec.amount;
    } else if (rec.type === "expense") {
      if (rec.is_deductible) totalDeductibleExpenses += rec.amount;
      else totalNonDeductibleExpenses += rec.amount;
    }
  }

  const profitBeforeTax = totalRevenue - (totalDeductibleExpenses + totalNonDeductibleExpenses);

  return {
    totalRevenue,
    totalDeductibleExpenses,
    totalNonDeductibleExpenses,
    profitBeforeTax
  };
}
