/**
 * Returns totals grouped by category for a list of transactions
 * Example return:
 * {
 *   revenue: 100000,
 *   cogs: 20000,
 *   depreciation: 5000,
 *   interest: 1000,
 *   capital_allowance: 2000,
 *   other_expense: 3000,
 *   // ...
 * }
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
 * PBT = revenue - (cogs + other_expense + depreciation + amortization + interest + capital_allowance)
 *
 * Accepts either:
 *  - (transactions[]) -> will compute totals by category and derive PBT
 *  - or (totalsByCategory object)
 */
export function computePBT(input) {
  const totals = Array.isArray(input) ? getTotalsByCategory(input) : (input || {});
  const revenue = Number(totals.revenue || 0);
  const cogs = Number(totals.cogs || 0);
  const otherExpenses = Number(totals.other_expense || 0);
  const depreciation = Number(totals.depreciation || 0);
  const amortization = Number(totals.amortization || 0);
  const interest = Number(totals.interest || 0);
  const capitalAllowance = Number(totals.capital_allowance || 0);

  const pbt = revenue - (cogs + otherExpenses + depreciation + amortization + interest + capitalAllowance);
  return {
    revenue,
    cogs,
    otherExpenses,
    depreciation,
    amortization,
    interest,
    capitalAllowance,
    pbt: Number(pbt.toFixed(2))
  };
}
