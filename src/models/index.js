import sequelize from "../config/db.js";
import User from "./user.model.js";
import BusinessProfile from "./business.profile.js";

User.hasOne(BusinessProfile, {
  foreignKey: "userId",
  as: "businessProfile",
});

BusinessProfile.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

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

export { sequelize, User, BusinessProfile };
