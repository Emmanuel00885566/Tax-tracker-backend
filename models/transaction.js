export default (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    'Transaction',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.ENUM('income', 'expense'), allowNull: false },
      is_deductible: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { tableName: 'Transactions', timestamps: true }
  );
  return Transaction;
};