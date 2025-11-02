import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";

const TaxRecord = sequelize.define(
  "TaxRecord",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
      type: DataTypes.ENUM("PIT", "CIT"),
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

    meta: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    paid_status: {
      type: DataTypes.ENUM("unpaid", "paid"),
      allowNull: false,
      defaultValue: "unpaid",
    },
    paid_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    paid_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0.0,
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
