import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import sequelize from "./src/config/db.js";

// Routes
import taxRoutes from "./src/routes/tax.routes.js";
import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

// Security Middlewares
app.use(helmet());
app.use(cors());

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to TaxBuddy API 🚀",
    status: "success",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tax", taxRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true }); // Sync all models
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
