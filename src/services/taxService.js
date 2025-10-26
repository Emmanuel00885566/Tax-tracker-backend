import Transaction from "../models/transactionModel.js";
import TaxRecord from "../models/taxRecordModel.js";
import User from "../models/userModel.js";
import { computePIT, computeCIT } from "../utils/taxUtils.js";
// import sequelize from "../models/index.js";
import { Op } from "sequelize";

export async function getTransactionsSummary(userId, { startDate, endDate } = {}) {
  const where = { user_id: userId };

  if (startDate && endDate) {
    where.date = { [Op.between]: [startDate, endDate] };
  } else if (startDate) {
    where.date = { [Op.gte]: startDate };
  } else if (endDate) {
    where.date = { [Op.lte]: endDate };
  }

  const transactions = await Transaction.findAll({ where });

  let totalIncome = 0;
  let totalDeductibleExpenses = 0;
  let totalNonDeductibleExpenses = 0;

  transactions.forEach(tx => {
    const amt = Number(tx.amount);
    if (tx.type === "income") {
      totalIncome += amt;
    } else if (tx.type === "expense") {
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
  const { taxType = "PIT", startDate, endDate, turnover, overrideBrackets, overrideCITRules } = options;

  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  
  const { totalIncome, totalDeductibleExpenses } = await getTransactionsSummary(userId, { startDate, endDate });

  const taxableIncome = Number((totalIncome - totalDeductibleExpenses) > 0 ? (totalIncome - totalDeductibleExpenses) : 0).toFixed(2);

  let result;
  if (taxType === "PIT") {
    result = computePIT(Number(taxableIncome), { brackets: overrideBrackets });
  } else if (taxType === "CIT") {
    
    result = computeCIT(Number(taxableIncome), turnover || 0, { rules: overrideCITRules });
  } else {
    throw new Error("Invalid tax type. Use PIT or CIT");
  }

  const created = await TaxRecord.create({
    user_id: userId,
    tax_type: taxType,
    taxable_income: Number(result.taxableIncome),
    tax_amount: Number(result.taxAmount || result.tax_amount || result.taxAmount), // fallback
    period_start: startDate || null,
    period_end: endDate || null
  });

  return {
    user_id: userId,
    tax_type: taxType,
    totalIncome,
    totalDeductibleExpenses,
    taxableIncome: Number(taxableIncome),
    tax: result,
    taxRecord: created
  };
}

export async function fetchTaxRecords(userId, { limit = 50, offset = 0, taxType = null } = {}) {
  const where = { user_id: userId };
  if (taxType) where.tax_type = taxType;

  const records = await TaxRecord.findAll({
    where,
    order: [["created_at", "DESC"]],
    limit,
    offset
  });

  return records;
}
