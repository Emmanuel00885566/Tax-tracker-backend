import express from "express";
import dotenv from "dotenv";
import taxRoutes from "./src/routes/taxRoutes.js";
import transactionRoute from "./src/routes/transactionRoute.js";
import { sequelize } from "./src/models/index.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Tax Tracker API");
});

app.use("/api/tax", taxRoutes);
app.use("/api/transactions", transactionRoute);

const PORT = process.env.PORT || 5000;

// Sync database
sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Models synchronized with database.");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ Model sync failed:", err));
