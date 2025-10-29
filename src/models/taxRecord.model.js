import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";

const TaxRecord = sequelize.define(
  "TaxRecord",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    tax_type: {
      type: DataTypes.ENUM("CIT", "PIT"),
      allowNull: false,
      comment: "Specifies whether it is Corporate Income Tax (CIT) or Personal Income Tax (PIT)",
    },
    taxable_income: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: "Total taxable income computed for the user",
    },
    total_deductible_expenses: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: "Sum of deductible expenses related to the tax year",
    },
    tax_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: "Total tax computed based on taxable income and type",
    },
    tax_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "The year this tax record applies to",
    },
    status: {
      type: DataTypes.ENUM("pending", "paid", "overdue"),
      defaultValue: "pending",
    },
    period_start: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    period_end: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "tax_records",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associations
TaxRecord.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(TaxRecord, { foreignKey: "user_id" });

export default TaxRecord;
