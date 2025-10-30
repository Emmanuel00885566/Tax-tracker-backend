import dotenv from "dotenv";
dotenv.config();

export default {
PORT: Number(process.env.PORT || 5000),
DB_PORT: Number(process.env.DB_PORT || 3306),
DB_HOST: process.env.DB_HOST || "127.0.0.1",
DB_USER: process.env.DB_USER || "root",
DB_PASSWORD: process.env.DB_PASS || "DayO@SQL123#",
DB_NAME: process.env.DB_NAME || "tax_tracker_db",
DB_DIALECT: process.env.DB_DIALECT || "mysql",
JWT_SECRET: process.env.JWT_SECRET || "my_first_and_last_token",
};