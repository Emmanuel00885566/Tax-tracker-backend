import { parseRange } from '../utils/report.utils.js';
import { buildSummaryMock, streamPDF, streamCSV } from '../services/report.service.js';

export async function download(req, res) {
  try {
    const { format = 'pdf', type = 'summary', from, to } = req.query;
    const { start, end } = parseRange(from, to);

    const meta = {
      from: from || new Date(start).toISOString().slice(0,10),
      to: to || new Date(end).toISOString().slice(0,10),
      filename: `report_${type}_${Date.now()}`
    };

    if (type === 'summary') {
      const summary = await buildSummaryMock();
      return format === 'csv'
        ? streamCSV(res, meta, [
            { date: meta.from, type: 'summary', category: '-', amount: summary.income, is_deductible: false, note: 'income total' },
            { date: meta.from, type: 'summary', category: '-', amount: -summary.expenses, is_deductible: false, note: 'expense total' }
          ])
        : streamPDF(res, meta, summary);
    }

    if (type === 'transactions' && format === 'csv') {
      const rows = [
        { date: meta.from, type: 'income', category: 'Salary', amount: 250000, is_deductible: false, note: 'sample' },
        { date: meta.to, type: 'expense', category: 'Transport', amount: 6500, is_deductible: true, note: 'sample' }
      ];
      return streamCSV(res, meta, rows);
    }

    return res.status(400).json({ message: 'Unsupported request' });
  } catch (e) {
    res.status(400).json({ message: e.message || 'Bad request' });
  }
}