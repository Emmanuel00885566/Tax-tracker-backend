import express from "express";
import dotenv from "dotenv";
<<<<<<< HEAD
import { connectDB } from "./src/config/db.js";
import taxRoutes from "./src/routes/tax.routes.js";
=======
import taxRoutes from "./src/routes/tax.routes.js";
import { sequelize } from "./src/models/index.js";
>>>>>>> f5559883edf04ade6a7eb30f410e0b66df986659

dotenv.config();

const app = express();
app.use(express.json());

<<<<<<< HEAD
app.use("/tax", taxRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Tax Tracker API");
});

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
=======
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
>>>>>>> f5559883edf04ade6a7eb30f410e0b66df986659
