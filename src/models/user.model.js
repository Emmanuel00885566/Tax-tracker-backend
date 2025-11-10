import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcrypt";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    fullname: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    account_type: {
      type: DataTypes.ENUM("individual", "business", "admin"),
      allowNull: false,
      defaultValue: "individual",
    },

    tin: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    annualIncomeRange: {
      type: DataTypes.STRING,
      allowNull: true, 
      validate: {
        len: [1, 50],
      },
    },

    tax_reminder: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    otpCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    otpExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        user.email = user.email.toLowerCase();
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("email")) user.email = user.email.toLowerCase();
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

User.prototype.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default User;
