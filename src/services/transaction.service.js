import Transaction from "../models/transaction.model.js";
import { Op } from "sequelize";

export async function addTransactionService(userId, data) {
  try {
    const newTransaction = await Transaction.create({
      user_id: userId,
      type: data.type, 
      amount: data.amount,
      description: data.description,
      category: data.category,
      is_deductible: data.is_deductible || false,
      date: data.date || new Date(),
    });

    return newTransaction;
  } catch (error) {
    throw new Error(`Error adding transaction: ${error.message}`);
  }
}

export async function getTransactionsService(userId, query = {}) {
  try {
    const { startDate, endDate } = query;
    const whereClause = { user_id: userId };

    if (startDate && endDate) {
      whereClause.date = { [Op.between]: [startDate, endDate] };
    }

    const transactions = await Transaction.findAll({
      where: whereClause,
      order: [["date", "DESC"]],
    });

    return transactions;
  } catch (error) {
    throw new Error(`Error fetching transactions: ${error.message}`);
  }
}
 
export async function getTransactionByIdService(userId, transactionId) {
  try {
    const transaction = await Transaction.findOne({
      where: { id: transactionId, user_id: userId },
    });

    if (!transaction) throw new Error("Transaction not found");
    return transaction;
  } catch (error) {
    throw new Error(`Error fetching transaction: ${error.message}`);
  }
}

export async function updateTransactionService(userId, transactionId, updates) {
  try {
    const transaction = await Transaction.findOne({
      where: { id: transactionId, user_id: userId },
    });

    if (!transaction) throw new Error("Transaction not found");

    await transaction.update({
      type: updates.type || transaction.type,
      amount: updates.amount || transaction.amount,
      description: updates.description || transaction.description,
      category: updates.category || transaction.category,
      is_deductible:
        updates.is_deductible !== undefined
          ? updates.is_deductible
          : transaction.is_deductible,
      date: updates.date || transaction.date,
    });

    return transaction;
  } catch (error) {
    throw new Error(`Error updating transaction: ${error.message}`);
  }
}

export async function deleteTransactionService(userId, transactionId) {
  try {
    const transaction = await Transaction.findOne({
      where: { id: transactionId, user_id: userId },
    });

    if (!transaction) throw new Error("Transaction not found");

    await transaction.destroy();
    return { message: "Transaction deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting transaction: ${error.message}`);
  }
}
