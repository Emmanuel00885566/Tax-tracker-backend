import express from "express";
import dotenv from "dotenv";
import taxRoutes from "./src/routes/tax.routes.js";
<<<<<<< HEAD
import { sequelize } from "./src/models/index.js";
=======
import { syncDB } from "./src/models/index.js"; 
>>>>>>> remotes/origin/Database-Model

dotenv.config();

const app = express();
<<<<<<< HEAD
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Tax Tracker API");
=======

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to TaxBuddy API 🚀",
    status: "success",
  });
>>>>>>> remotes/origin/Database-Model
});

app.use("/api/tax", taxRoutes);

const PORT = process.env.PORT || 5000;

<<<<<<< HEAD
// Sync database
sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Models synchronized with database.");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ Model sync failed:", err));
=======
const startServer = async () => {
  try {
    await syncDB(false); 
    console.log("✅ Database synced successfully.");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
>>>>>>> remotes/origin/Database-Model
