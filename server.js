import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import taxRoutes from "./src/routes/tax.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/tax", taxRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Tax Tracker API");
});

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});