import PDFDocument from 'pdfkit';
import { Transform as Json2CsvTransform } from '@json2csv/node';
import { Readable } from 'stream';
import { formatCurrency } from '../utils/report.utils.js';

export async function buildSummaryMock() {
  const income = 250000;
  const expenses = 65000;
  const deductible = 20000;
  const taxableIncome = Math.max(income - deductible, 0);
  const taxPayable = taxableIncome * 0.1;
  return { income, expenses, deductible, taxableIncome, taxPayable };
}

export async function streamPDF(res, meta, summary) {
  const doc = new PDFDocument({ size: 'A4', margin: 36 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${meta.filename}.pdf"`);
  doc.pipe(res);
  doc.fontSize(16).text('Tax Tracker Report', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(11).text(`Period: ${meta.from} to ${meta.to}`);
  doc.text(`Generated: ${new Date().toLocaleString()}`);
  doc.moveDown();
  doc.fontSize(12).text(`Total Income: ${formatCurrency(summary.income)}`);
  doc.text(`Total Expenses: ${formatCurrency(summary.expenses)}`);
  doc.text(`Deductible Expenses: ${formatCurrency(summary.deductible)}`);
  doc.text(`Taxable Income: ${formatCurrency(summary.taxableIncome)}`);
  doc.text(`Tax Payable: ${formatCurrency(summary.taxPayable)}`);
  doc.end();
}

export async function streamCSV(res, meta, rows = []) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${meta.filename}.csv"`);

  const fields = [
    { label: 'Date', value: r => r.date },
    { label: 'Type', value: r => r.type },
    { label: 'Category', value: r => r.category },
    { label: 'Amount', value: r => r.amount },
    { label: 'Deductible', value: r => (r.is_deductible ? 'yes' : 'no') },
    { label: 'Note', value: r => r.note }
  ];

  const header = fields.map(f => f.label).join(',');
  const lines = rows.map(row =>
    fields.map(f => {
      let v = f.value(row);
      v = v == null ? '' : String(v);
      v = v.replace(/"/g, '""');
      return `"${v}"`;
    }).join(',')
  );
  const csv = [header, ...lines].join('\n');

  res.send(csv);
}