import PDFDocument from 'pdfkit';
import { Op } from 'sequelize';
import { formatCurrency, parseRange } from '../utils/report.utils.js';
import Transaction from '../models/transaction.model.js';

export async function buildSummaryData(userId, from, to) {
  const { start, end } = parseRange(from, to);

  const transactions = await Transaction.findAll({
    where: {
        user_id: userId,
        date: { [Op.between]: [start, end] }
    },
    raw: true
  });
  if (!transactions || transactions.length === 0) {
    return {
      income: 0,
      expenses: 0,
      deductible: 0,
      taxableIncome: 0,
      taxPayable: 0,
      message: 'No transactions found for the selected period.'
    };
  }

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const deductible = transactions
    .filter(t => t.is_deductible)
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const taxableIncome = Math.max(income - deductible, 0);
  const taxPayable = taxableIncome * 0.1;

  return { income, expenses, deductible, taxableIncome, taxPayable };
}

export async function streamPDF(res, meta, summary) {
  const doc = new PDFDocument({ size: 'A4', margin: 36 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${meta.filename}.pdf"`);
  doc.pipe(res);

  doc.fontSize(16).text('TaxBuddy Report', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(11).text(`Period: ${meta.from || 'N/A'} to ${meta.to || 'N/A'}`);
  doc.text(`Generated: ${new Date().toLocaleString()}`);
  doc.moveDown();

  doc.fontSize(12).text(`Total Income: ${formatCurrency(summary.income)}`);
  doc.text(`Total Expenses: ${formatCurrency(summary.expenses)}`);
  doc.text(`Deductible Expenses: ${formatCurrency(summary.deductible)}`);
  doc.text(`Taxable Income: ${formatCurrency(summary.taxableIncome)}`);
  doc.text(`Tax Payable: ${formatCurrency(summary.taxPayable)}`);

  doc.end();
}

export async function streamCSV(res, meta, summary) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${meta.filename}.csv"`);

  const header = 'Metric,Value\n';
  const rows = [
    `Total Income,${summary.income}`,
    `Total Expenses,${summary.expenses}`,
    `Deductible Expenses,${summary.deductible}`,
    `Taxable Income,${summary.taxableIncome}`,
    `Tax Payable,${summary.taxPayable}`
  ];
  const csv = header + rows.join('\n');

  res.send(csv);
}
