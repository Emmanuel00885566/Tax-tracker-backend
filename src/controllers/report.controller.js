import { streamPDF, streamCSV, buildSummaryData } from '../services/report.service.js';

export async function download(req, res) {
  try {
    const { format = 'pdf', type = 'summary', from, to } = req.query;
    const userId = req.user.id;
    const summary = await buildSummaryData(userId, from, to);

    const meta = {
      filename: `report_${type}_${Date.now()}`,
      from,
      to
    };

    if (format === 'csv') return streamCSV(res, meta, summary);
    return streamPDF(res, meta, summary);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to generate report' });
  }
}