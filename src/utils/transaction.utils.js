/**
 * Returns totals grouped by category for a list of transactions
 */
export function getTotalsByCategory(transactions = []) {
  return transactions.reduce((acc, t) => {
    const cat = (t.category || 'other_expense').toString().toLowerCase();
    const amt = Number(t.amount) || 0;
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += amt;
    return acc;
  }, {});
}

/**
 * Compute Profit Before Tax (PBT) using category totals.
 * PBT = revenue - (all allowable deductions)
 * Based on Nigerian CIT Act (CITA) rules
 */
export function computePBT(input) {
  const totals = Array.isArray(input) ? getTotalsByCategory(input) : (input || {});

  // All income categories recognized as revenue
  const incomeCategories = [
    'revenue', 'income', 'salary', 'freelance', 'business',
    'investment', 'rental', 'consulting', 'sales', 'service',
    'other_income', 'other income',
  ];

  // All deductible expense categories
  const deductibleCategories = [
    'office rent', 'equipment', 'software', 'marketing',
    'transport', 'utilities', 'other',
  ];

  // Sum all income categories as revenue
  const revenue = incomeCategories.reduce((sum, cat) => {
    return sum + Number(totals[cat] || 0);
  }, 0);

  // Specific allowable deductions per CITA
  const cogs = Number(totals.cogs || totals['cost of goods sold'] || 0);
  const otherExpenses = Number(totals.other_expense || totals['other expense'] || 0);
  const depreciation = Number(totals.depreciation || 0);
  const amortization = Number(totals.amortization || 0);
  const interest = Number(totals.interest || 0);
  const capitalAllowance = Number(
    totals.capital_allowance || totals['capital allowance'] || 0
  );

  // Other allowable business expenses
  const otherAllowableExpenses = deductibleCategories.reduce((sum, cat) => {
    return sum + Number(totals[cat] || 0);
  }, 0);

  const totalDeductions = cogs + otherExpenses + depreciation +
    amortization + interest + capitalAllowance + otherAllowableExpenses;

  const pbt = Math.max(revenue - totalDeductions, 0);

  return {
    revenue,
    cogs,
    otherExpenses,
    depreciation,
    amortization,
    interest,
    capitalAllowance,
    pbt: Number(pbt.toFixed(2)),
  };
}