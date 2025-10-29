import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Initialize Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql", // ✅ Explicitly set to MySQL for clarity
    logging: false,   // Set to console.log if debugging queries
  }
);

// Utility function to test connection
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // ✅ Exit process if DB fails to connect
  }
};

// ✅ Named + default export for flexibility
export { sequelize };
export default sequelize;
