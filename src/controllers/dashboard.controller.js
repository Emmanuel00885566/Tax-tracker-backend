import IncomeExpense from "../models/income.expense.model.js";
import Transaction from "../models/transaction.model.js";
import TaxRecord from "../models/tax.record.model.js";
import User from "../models/user.model.js";
import BusinessProfile from "../models/business.profile.js";
import { Op } from "sequelize";

export async function getDashboardSummary(req, res) {
  try {
    const { userId } = req.params;

    // Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get current year date range
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);

    // Fetch user
    const user = await User.findByPk(userId, {
      attributes: ['id', 'fullname', 'email', 'account_type', 'tin', 'annualIncomeRange', 'tax_reminder'],
      include: [{
        model: BusinessProfile,
        as: 'businessProfile',
        attributes: ['businessName', 'businessType'],
        required: false,
      }],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch all income/expenses
    const [incomeExpenses, transactions, taxRecords] = await Promise.all([
      IncomeExpense.findAll({ where: { user_id: userId } }),
      Transaction.findAll({ where: { user_id: userId } }),
      TaxRecord.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        limit: 5,
      }),
    ]);

    // Combine income/expenses and transactions
    const allRecords = [...incomeExpenses, ...transactions];

    // Calculate totals
    let totalIncome = 0;
    let totalExpenses = 0;
    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    let yearlyIncome = 0;
    let yearlyExpenses = 0;

    allRecords.forEach(record => {
      const amount = Number(record.amount || 0);
      const date = new Date(record.date);
      const isIncome = record.type === 'income';
      const isExpense = record.type === 'expense';

      // All time
      if (isIncome) totalIncome += amount;
      if (isExpense) totalExpenses += amount;

      // This month
      if (date >= startOfMonth && date <= endOfMonth) {
        if (isIncome) monthlyIncome += amount;
        if (isExpense) monthlyExpenses += amount;
      }

      // This year
      if (date >= startOfYear && date <= endOfYear) {
        if (isIncome) yearlyIncome += amount;
        if (isExpense) yearlyExpenses += amount;
      }
    });

    // Tax calculations
    const taxableIncome = totalIncome - totalExpenses;
    const monthlyTaxableIncome = monthlyIncome - monthlyExpenses;

    // Latest tax record
    const latestTaxRecord = taxRecords[0] || null;

    // Unpaid tax amount
    const unpaidTax = taxRecords
      .filter(r => r.paid_status === 'unpaid')
      .reduce((sum, r) => sum + Number(r.tax_amount || 0), 0);

    // Recent transactions (last 5)
    const recentTransactions = allRecords
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(r => ({
        id: r.id,
        type: r.type,
        amount: Number(r.amount),
        description: r.description,
        category: r.category,
        date: r.date,
        is_deductible: r.is_deductible,
      }));

    // Format response
    const summary = {
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        account_type: user.account_type,
        tin: user.tin,
        annualIncomeRange: user.annualIncomeRange,
        tax_reminder: user.tax_reminder,
        businessName: user.businessProfile?.businessName || null,
        businessType: user.businessProfile?.businessType || null,
      },
      overview: {
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpenses: Number(totalExpenses.toFixed(2)),
        taxableIncome: Number(taxableIncome.toFixed(2)),
        netBalance: Number((totalIncome - totalExpenses).toFixed(2)),
      },
      monthly: {
        income: Number(monthlyIncome.toFixed(2)),
        expenses: Number(monthlyExpenses.toFixed(2)),
        taxableIncome: Number(monthlyTaxableIncome.toFixed(2)),
        month: now.toLocaleString('en-NG', { month: 'long', year: 'numeric' }),
      },
      yearly: {
        income: Number(yearlyIncome.toFixed(2)),
        expenses: Number(yearlyExpenses.toFixed(2)),
        year: now.getFullYear(),
      },
      tax: {
        unpaidAmount: Number(unpaidTax.toFixed(2)),
        totalRecords: taxRecords.length,
        unpaidRecords: taxRecords.filter(r => r.paid_status === 'unpaid').length,
        paidRecords: taxRecords.filter(r => r.paid_status === 'paid').length,
        latestRecord: latestTaxRecord ? {
          id: latestTaxRecord.id,
          taxType: latestTaxRecord.tax_type,
          taxableIncome: `₦${Number(latestTaxRecord.taxable_income).toLocaleString()}`,
          taxAmount: `₦${Number(latestTaxRecord.tax_amount).toLocaleString()}`,
          period: `${latestTaxRecord.period_start} - ${latestTaxRecord.period_end}`,
          paidStatus: latestTaxRecord.paid_status,
        } : null,
      },
      recentTransactions,
      transactionCount: allRecords.length,
    };

    return res.json({ success: true, data: summary });

  } catch (error) {
    console.error('Dashboard summary error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard summary',
      error: error.message,
    });
  }
}