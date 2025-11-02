import {
  computeTaxForUser,
  fetchTaxRecords,
  markTaxAsPaid,
  getTaxSummary
} from "../services/tax.service.js";

/**
 * Compute Tax Controller
 */
export async function computeTaxController(req, res) {
  try {
    const { userId } = req.params;
    const { taxType, startDate, endDate, turnover, overrideBrackets, overrideCITRules, month } = req.body || {};

    const result = await computeTaxForUser(userId, {
      taxType,
      startDate,
      endDate,
      turnover,
      overrideBrackets,
      overrideCITRules
    });

    const formatted = {
      month: month || null,
      totalIncome: result.totalIncome,
      taxPayable: result.tax.taxAmount,
      effectiveTaxRate: ((result.tax.taxAmount / result.taxableIncome) * 100).toFixed(2) + "%",
      taxBands: result.tax,
      taxRecordId: result.taxRecord.id
    };

    return res.status(201).json({ success: true, message: "Tax computed and record saved", data: formatted });
  } catch (err) {
    console.error("computeTaxController error:", err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
}

/**
 * Fetch Tax Records Controller
 */
export async function getTaxRecordsController(req, res) {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0, taxType } = req.query;

    const records = await fetchTaxRecords(userId, { limit: Number(limit), offset: Number(offset), taxType });

    return res.json({ success: true, data: records });
  } catch (err) {
    console.error("getTaxRecordsController error:", err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
}

/**
 * Mark Tax as Paid Controller
 */
export async function markTaxAsPaidController(req, res) {
  try {
    const { userId, taxId } = req.params;
    const { amount, paidOn } = req.body;

    const record = await markTaxAsPaid(userId, taxId, amount, paidOn);
    return res.json({ success: true, message: "Marked as paid successfully", data: record });
  } catch (err) {
    console.error("markTaxAsPaidController error:", err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
}

/**
 * Tax Summary Controller
 */
export async function getTaxSummaryController(req, res) {
  try {
    const { userId } = req.params;
    const summary = await getTaxSummary(userId);
    return res.json({ success: true, data: summary });
  } catch (err) {
    console.error("getTaxSummaryController error:", err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
}
