import {
  addTransactionService,
  getTransactionsService,
  getTransactionByIdService,
  updateTransactionService,
  deleteTransactionService,
} from "../services/transaction.service.js";

/**
 * Add a new transaction
 * POST /api/transactions/:userId
 */
export async function addTransactionController(req, res) {
  try {
    const { userId } = req.params;
    const newTransaction = await addTransactionService(userId, req.body);

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get all transactions for a user
 * GET /api/transactions/:userId
 */
export async function getTransactionsController(req, res) {
  try {
    const { userId } = req.params;
    const transactions = await getTransactionsService(userId, req.query);

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get a single transaction by ID
 * GET /api/transactions/:userId/:id
 */
export async function getTransactionByIdController(req, res) {
  try {
    const { userId, id } = req.params;
    const transaction = await getTransactionByIdService(userId, id);

    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
}

/**
 * Update a transaction
 * PUT /api/transactions/:userId/:id
 */
export async function updateTransactionController(req, res) {
  try {
    const { userId, id } = req.params;
    const updatedTransaction = await updateTransactionService(userId, id, req.body);

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Delete a transaction
 * DELETE /api/transactions/:userId/:id
 */
export async function deleteTransactionController(req, res) {
  try {
    const { userId, id } = req.params;
    const result = await deleteTransactionService(userId, id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
