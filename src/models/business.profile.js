import { DataTypes } from "sequelize";
import sequelize   from "../config/db.js";

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
});

export default BusinessProfile;

// Do I deal with the list of business types?