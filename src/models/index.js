import User from "./user.model.js";
import BusinessProfile from "./business.profile.js";
import Transaction from "./transaction.model.js";
import IncomeExpense from "./income.expense.model.js";
import TaxRecord from "./tax.record.model.js";
import Reminder from "./reminder.model.js";

User.hasOne(BusinessProfile, {
  foreignKey: "userId",
  as: "businessProfile",
});

BusinessProfile.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// User associations
User.hasMany(Transaction, {
  foreignKey: "user_id",
  as: "transactions",
});

Transaction.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(IncomeExpense, {
  foreignKey: "user_id",
  as: "incomeExpenses",
});

IncomeExpense.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(TaxRecord, {
  foreignKey: "user_id",
  as: "taxRecords",
});

TaxRecord.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(Reminder, {
  foreignKey: "user_id",
  as: "reminders",
});

Reminder.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

export { User, BusinessProfile, Transaction, IncomeExpense, TaxRecord, Reminder };