import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.get("/", (req, res) => {
    res.send(" Welcome to the Tax Tracker app")
});

app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Route does not exist"});
});

const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});