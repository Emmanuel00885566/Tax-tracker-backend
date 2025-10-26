import sequelize from "../config/db.js";
import User from "./userModel.js";
import Transaction from "./transactionModel.js";
import TaxRecord from "./taxRecordModel.js";

User.hasMany(Transaction, { foreignKey: "user_id" });
Transaction.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(TaxRecord, { foreignKey: "user_id" });
TaxRecord.belongsTo(User, { foreignKey: "user_id" });

export { sequelize, User, Transaction, TaxRecord };
