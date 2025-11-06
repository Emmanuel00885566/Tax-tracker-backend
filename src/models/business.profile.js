import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js"; 

const BusinessProfile = sequelize.define("BusinessProfile", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  businessName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  businessType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users", 
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

export default BusinessProfile;
