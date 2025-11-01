// import { DataTypes } from "sequelize";
// import sequelize from "../config/db.js";
// import User from "./user.model.js";

// const Transaction = sequelize.define(
//   "Transaction",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     user_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: User,
//         key: "id",
//       },
//       onDelete: "CASCADE",
//     },
//     type: {
//       type: DataTypes.ENUM("income", "expense"),
//       allowNull: false,
//     },
//     amount: {
//       type: DataTypes.DECIMAL(15, 2),
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     category: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     is_deductible: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },
//     date: {
//       type: DataTypes.DATEONLY,
//       allowNull: false,
//       defaultValue: DataTypes.NOW,
//     },
//   },
//   {
//     tableName: "transactions",
//     timestamps: true,
//     createdAt: "created_at",
//     updatedAt: "updated_at",
//   }
// );

// Transaction.belongsTo(User, { foreignKey: "user_id" });
// User.hasMany(Transaction, { foreignKey: "user_id" });

// export default Transaction;
