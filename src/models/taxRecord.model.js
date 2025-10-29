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
      type: DataTypes.ENUM("CIT", "PIT"),
      allowNull: false,
    },
    taxable_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    tax_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    tax_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "paid", "overdue"),
      defaultValue: "pending",
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
