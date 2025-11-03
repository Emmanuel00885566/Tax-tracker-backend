import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Reminder = sequelize.define("Reminder", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("monthly", "quarterly", "custom"),
    allowNull: false,
    defaultValue: "monthly",
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Upcoming tax reminder",
  },
  next_due_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  is_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  meta: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: "Optional metadata like tax type, amount, or reference ID",
  },
}, {
  tableName: "reminders",
  timestamps: true, 
});

export default Reminder;
