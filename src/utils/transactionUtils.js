
export const isDeductible = (transaction) => {
  if (!transaction || transaction.type !== 'expense') return false;
  return transaction.is_deductible === true;
};


export const getTotalIncome = (transactions) => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
};


export const getTotalExpenses = (transactions) => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};


export const getTotalDeductible = (transactions) => {
  return transactions
    .filter(isDeductible)
    .reduce((sum, t) => sum + t.amount, 0);
};
