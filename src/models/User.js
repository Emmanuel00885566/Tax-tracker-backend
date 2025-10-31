import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcrypt";

const User = sequelize.define(
"User",
{
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true }, //can be split if there's stil time (first, middle, last)
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("individual", "business", "admin"), allowNull: false, defaultValue: "individual" },
    tin: { type: DataTypes.INTEGER, unique:true },
     annualIncomeRange: {
    type: DataTypes.ENUM(
      '₦0 - ₦100,000',
      '₦100,001 - ₦500,000',
      '₦500,001 - ₦1,000,000',
      '₦1,000,001 - ₦5,000,000',
      'Above ₦5,000,000'
    ),
    allowNull: false,
  },
    tax_reminder: { type: DataTypes.BOOLEAN, defaultValue: true},
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
                user.username = user.usernme.toLowerCase();
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

// how do I make sure that business details stays with business people
// check for that sync:true stuff so that it can effect changes