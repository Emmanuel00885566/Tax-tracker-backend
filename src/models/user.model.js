import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcrypt";

const User = sequelize.define(
"User",
{
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("individual", "business", "admin"), allowNull: false, defaultValue: "individual" },
    tin: { type: DataTypes.INTEGER, allowNull: true },
    annualIncomeRange: { type: DataTypes.ENUM("₦0 - ₦99,999", "₦100,000 - ₦499,999", "₦500,000 - ₦999,999", "₦1,000,000 - ₦4,999,999", "₦5,000,000 - ₦10,000,000")},
    tax_reminder: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: true},
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    otpCode: { type: DataTypes.STRING, allowNull: true },
    otpExpiresAt: { type: DataTypes.DATE, allowNull: true},
},
{ /*tableName: "Users",*/ timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            user.username = user.username.toLowerCase();
            user.email = user.email.toLowerCase();
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed("username")) {
                user.username = user.username.toLowerCase();
            }
            if (user.changed("email")) {
                user.email = user.email.toLowerCase();
            }
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
    },
 });

User.prototype.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default User;