import {
  computeTaxForUser,
  fetchTaxRecords,
  markTaxAsPaid,
  getTaxSummary
} from "../services/tax.service.js";

//Compute Tax Controller
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

// Fetch Tax Records Controller
export async function getTaxRecordsController(req, res) {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0, taxType, status, month, year } = req.query;

    const filters = { limit: Number(limit), offset: Number(offset) };
    if (taxType) filters.taxType = taxType;
    if (status) filters.status = status;

    if (month || year) {
      const startDate = year
        ? `${year}-${month ? month.padStart(2, "0") : "01"}-01`
        : null;
      const endDate = month && year
        ? new Date(year, Number(month), 0).toISOString().split("T")[0]
        : null;
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    const records = await fetchTaxRecords(userId, filters);

    const formattedRecords = records.map(r => ({
      id: r.id,
      taxType: r.tax_type,
      taxableIncome: `₦${Number(r.taxable_income).toLocaleString()}`,
      taxAmount: `₦${Number(r.tax_amount).toLocaleString()}`,
      period: r.period_start && r.period_end
        ? `${r.period_start} - ${r.period_end}`
        : "N/A",
      paidStatus: r.paid_status,
      paidAmount: `₦${Number(r.paid_amount || 0).toLocaleString()}`,
      paidOn: r.paid_on ? new Date(r.paid_on).toLocaleDateString() : "Not Paid",
      createdAt: new Date(r.created_at).toLocaleDateString(),
    }));

    return res.json({
      success: true,
      message: "Tax records fetched successfully",
      count: formattedRecords.length,
      data: formattedRecords,
    });
  } catch (err) {
    console.error("getTaxRecordsController error:", err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
}

// Mark Tax as Paid Controller
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

// Tax Summary Controller
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
