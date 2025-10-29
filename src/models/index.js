import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";
import User from "./user.model.js";
import Transaction from "./transaction.model.js";
import TaxRecord from "./taxRecord.model.js";
import NotificationModel from "./notification.model.js";

const Notification = NotificationModel(sequelize, DataTypes);

User.hasMany(Transaction, {
  foreignKey: "user_id",
  as: "transactions",
  onDelete: "CASCADE",
});
Transaction.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(TaxRecord, {
  foreignKey: "user_id",
  as: "taxRecords",
  onDelete: "CASCADE",
});
TaxRecord.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

sequelize
  .sync() 
  .then(() => console.log("✅ Tables dropped and re-created successfully"))
  .catch((err) => console.error("❌ Error syncing models:", err.message));

export { sequelize, User, Transaction, TaxRecord, Notification };
