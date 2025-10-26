import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./userModel.js";

const TaxRecord = sequelize.define(
  "TaxRecord",
  {
    record_id: {
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
    },
    taxable_income: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    tax_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
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

TaxRecord.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(TaxRecord, { foreignKey: "user_id" });

export default TaxRecord;
