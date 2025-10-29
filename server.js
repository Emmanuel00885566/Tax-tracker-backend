import express from "express";
import dotenv from "dotenv";
import taxRoutes from "./src/routes/tax.routes.js";
import { sequelize } from "./src/models/index.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to TaxBuddy API 🚀",
    status: "success",
  });
});

app.use("/api/tax", taxRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Models synchronized with database.");

    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
