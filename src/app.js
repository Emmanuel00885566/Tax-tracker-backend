import express from "express";
import config from "./config/index.js";
import {connectDB} from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
// Make use of logger if necessary later on

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

await connectDB();

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});