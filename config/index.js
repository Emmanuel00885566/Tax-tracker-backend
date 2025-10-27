import dotenv from "dotenv";
dotenv.config();

export default {
PORT: Number(process.env.PORT || 5000),
DB_HOST: process.env.DB_HOST || "localhost",
DB_USER: process.env.DB_USER || "group3",
DB_PASS: process.env.DB_PASS || "group3-123#",
DB_NAME: process.env.DB_NAME || "tax_tracker_db",
DB_DIALECT: process.env.DB_DIALECT || "mysql",
JWT_SECRET: process.env.JWT_SECRET || "my_first_and_last_token",
};