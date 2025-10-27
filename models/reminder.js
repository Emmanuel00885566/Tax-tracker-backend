export default (sequelize, DataTypes) => {
  const Reminder = sequelize.define(
    'Reminder',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      message: { type: DataTypes.STRING, allowNull: false },
      due_date: { type: DataTypes.DATE, allowNull: false },
      is_sent: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { tableName: 'Reminders', timestamps: true }
  );
  return Reminder;
};