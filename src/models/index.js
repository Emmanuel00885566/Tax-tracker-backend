// src/models/index.js
import { sequelize } from "../config/db.js";
import User from "./user.model.js";
import Transaction from "./transaction.model.js";
import TaxRecord from "./taxRecord.model.js";

// ✅ Define associations
User.hasMany(Transaction, {
  foreignKey: "userId",
  as: "transactions",
  onDelete: "CASCADE",
});
Transaction.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(TaxRecord, {
  foreignKey: "userId",
  as: "taxRecords",
  onDelete: "CASCADE",
});
TaxRecord.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// ✅ Export models and sequelize instance
export { sequelize, User, Transaction, TaxRecord };
