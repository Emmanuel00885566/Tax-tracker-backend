import Transaction from "../models/transaction.model.js";
import TaxRecord from "../models/tax.record.model.js";
import User from "../models/user.model.js";
import { computePIT, computeCIT } from "../utils/tax.utils.js";
import { getTotalsByCategory, computePBT } from "../utils/transaction.utils.js";
import { Op } from "sequelize";

export async function fetchTransactionsForPeriod(userId, { startDate, endDate } = {}) {
  const where = { user_id: userId };

  if (startDate && endDate) where.date = { [Op.between]: [startDate, endDate] };
  else if (startDate) where.date = { [Op.gte]: startDate };
  else if (endDate) where.date = { [Op.lte]: endDate };

  return await Transaction.findAll({ where, order: [["date", "ASC"]] });
}

export async function fetchTaxRecords(userId, filters = {}) {
  const where = { user_id: userId };
  if (filters.taxType) where.tax_type = filters.taxType;
  if (filters.status) where.paid_status = filters.status;

  return await TaxRecord.findAll({
    where,
    order: [["created_at", "DESC"]],
    limit: filters.limit || 50,
    offset: filters.offset || 0,
  });
}

export async function getTransactionsSummary(userId, { startDate, endDate } = {}) {
  const transactions = await fetchTransactionsForPeriod(userId, { startDate, endDate });

  let totalIncome = 0;
  let totalDeductibleExpenses = 0;
  let totalNonDeductibleExpenses = 0;

  transactions.forEach(tx => {
    const amt = Number(tx.amount);
    if (tx.type === "income") totalIncome += amt;
    else if (tx.type === "expense") {
      if (tx.is_deductible) totalDeductibleExpenses += amt;
      else totalNonDeductibleExpenses += amt;
    }
  });

  return {
    totalIncome: Number(totalIncome.toFixed(2)),
    totalDeductibleExpenses: Number(totalDeductibleExpenses.toFixed(2)),
    totalNonDeductibleExpenses: Number(totalNonDeductibleExpenses.toFixed(2)),
    transactionsCount: transactions.length
  };
}

export async function computeTaxForUser(userId, options = {}) {
  const { taxType = "PIT", startDate, endDate, turnover = 0, overrideBrackets, overrideCITRules } = options;

  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const transactions = await fetchTransactionsForPeriod(userId, { startDate, endDate });
  const totalsByCategory = getTotalsByCategory(transactions);
  const pbtResult = computePBT(totalsByCategory);
  const { totalIncome, totalDeductibleExpenses } = await getTransactionsSummary(userId, { startDate, endDate });

  let taxableIncome = 0;
  let taxComputationResult = null;

  if (taxType === "CIT") {
    taxableIncome = Number(pbtResult.pbt > 0 ? pbtResult.pbt : 0);
    taxComputationResult = computeCIT(taxableIncome, turnover || 0, { rules: overrideCITRules });
  } else if (taxType === "PIT") {
    taxableIncome = Number(totalIncome - totalDeductibleExpenses > 0 ? totalIncome - totalDeductibleExpenses : 0);
    taxComputationResult = computePIT(taxableIncome, { brackets: overrideBrackets });
  } else {
    throw new Error("Invalid tax type. Use PIT or CIT");
  }

  const created = await TaxRecord.create({
    user_id: userId,
    tax_type: taxType,
    taxable_income: taxableIncome,
    tax_amount: taxComputationResult.taxAmount || taxComputationResult.tax_amount || 0,
    period_start: startDate || null,
    period_end: endDate || null,
    paid_status: "unpaid",
    paid_amount: 0,
    paid_on: null,
    meta: {
      totalsByCategory,
      pbt: pbtResult,
      totalIncome,
      totalDeductibleExpenses
    }
  });

  return {
    user_id: userId,
    tax_type: taxType,
    totalsByCategory,
    pbt: pbtResult,
    totalIncome,
    totalDeductibleExpenses,
    taxableIncome,
    tax: taxComputationResult,
    taxRecord: created
  };
}

export async function markTaxAsPaid(userId, taxId, amount, paidOn) {
  const record = await TaxRecord.findOne({ where: { id: taxId, user_id: userId } });
  if (!record) throw new Error("Tax record not found");

  record.paid_status = "paid";
  record.paid_amount = amount || record.tax_amount;
  record.paid_on = paidOn || new Date();

  await record.save();
  return record;
}

export async function getTaxSummary(userId) {
  const records = await fetchTaxRecords(userId);
  const totalRecords = records.length;
  const paid = records.filter(r => r.paid_status === "paid").length;
  const unpaid = totalRecords - paid;
  const paidAmount = records.reduce((sum, r) => sum + Number(r.paid_amount || 0), 0);

  return { totalRecords, paid, unpaid, paidAmount, records };
}
