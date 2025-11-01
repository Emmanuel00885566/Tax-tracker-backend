// import { computeTaxForUser, fetchTaxRecords } from "../services/tax.service.js";

// export async function computeTaxController(req, res) {
//   try {
//     const { userId } = req.params;
//     const {
//       taxType = "PIT",
//       startDate,
//       endDate,
//       turnover,
//       overrideBrackets,
//       overrideCITRules
//     } = req.body || {};

//     const result = await computeTaxForUser(userId, {
//       taxType,
//       startDate,
//       endDate,
//       turnover,
//       overrideBrackets,
//       overrideCITRules
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Tax computed and tax record saved",
//       data: result
//     });
//   } catch (err) {
//     console.error("computeTaxController error:", err.message);
//     return res.status(400).json({ success: false, error: err.message });
//   }
// }

// export async function getTaxRecordsController(req, res) {
//   try {
//     const { userId } = req.params;
//     const { limit = 50, offset = 0, taxType } = req.query;

//     const records = await fetchTaxRecords(userId, { limit: Number(limit), offset: Number(offset), taxType });

//     return res.json({ success: true, data: records });
//   } catch (err) {
//     console.error("getTaxRecordsController error:", err.message);
//     return res.status(400).json({ success: false, error: err.message });
//   }
// }
