import sequelize from "../config/db.js";
import User from "./user.model.js";
// import other models later, e.g. Income, Expense, TaxRecord, etc.

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
  }
};

connectDB();

export { sequelize, User };
