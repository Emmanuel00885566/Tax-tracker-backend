import Transaction from '../models/transactionModel.js';
import { getTotalIncome, getTotalExpenses, getTotalDeductible } from '../utils/transactionUtils.js';

// Create a transaction
export const addTransaction = async (req, res) => {
  try {
    const { type, amount, description, is_deductible, date } = req.body;
    if (!type || !amount) return res.status(400).json({ error: 'Type and amount required' });

    const transaction = await Transaction.create({
      user_id: req.user.id,
      type,
      amount,
      description,
      is_deductible: !!is_deductible,
      date: date ? new Date(date) : new Date()
    });

    res.status(201).json({ transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all transactions and totals
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({ where: { user_id: req.user.id } });

    const totals = {
      totalIncome: getTotalIncome(transactions),
      totalExpense: getTotalExpenses(transactions),
      totalDeductible: getTotalDeductible(transactions)
    };

    res.json({ transactions, totals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update transaction
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({ where: { id, user_id: req.user.id } });
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

    const { type, amount, description, is_deductible, date } = req.body;
    if (type) transaction.type = type;
    if (amount) transaction.amount = amount;
    if (description) transaction.description = description;
    if (is_deductible !== undefined) transaction.is_deductible = is_deductible;
    if (date) transaction.date = new Date(date);

    await transaction.save();
    res.json({ transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Transaction.destroy({ where: { id, user_id: req.user.id } });
    if (!deleted) return res.status(404).json({ error: 'Transaction not found' });

    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
