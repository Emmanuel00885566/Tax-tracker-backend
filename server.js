import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import sequelize, { connectDB } from "./src/config/db.js";
import taxRoutes from "./src/routes/tax.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import transactionRoutes from "./src/routes/transaction.routes.js";
import incomeExpenseRoutes from "./src/routes/income.expense.routes.js";
import reminderRoutes from "./src/routes/reminder.routes.js";
import "./src/jobs/reminder.cron.js";
import reportRoutes from "./src/routes/report.routes.js";

import "./src/models/user.model.js";
import "./src/models/transaction.model.js";
import "./src/models/income.expense.model.js";
import "./src/models/reminder.model.js";
import "./src/models/index.js";
import "./src/models/business.profile.js";
import "./src/models/tax.record.model.js";
import "./src/models/notification.model.js";

dotenv.config();
const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: [
    "https://isejosh.github.io",
    "https://taxbuddy-two.vercel.app", 
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.get("/", (req, res) => {
  res.json({
    message: "Welcome to TaxBuddy API",
    status: "success",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/income-expense", incomeExpenseRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/report", reportRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {

    await connectDB();

    await sequelize.sync({ alter: false });

    console.log("Models synchronized with PostgreSQL.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
