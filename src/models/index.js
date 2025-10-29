import sequelize from "../config/db.js";
import User from "./user.model.js";
import Transaction from "./transaction.model.js";
import TaxRecord from "./taxRecord.model.js";

User.hasMany(Transaction, { foreignKey: "user_id" });
Transaction.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(TaxRecord, { foreignKey: "user_id" });
TaxRecord.belongsTo(User, { foreignKey: "user_id" });

export { sequelize, User, Transaction, TaxRecord };
