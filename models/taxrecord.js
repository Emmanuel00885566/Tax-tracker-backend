export default (sequelize, DataTypes) => {
  const TaxRecord = sequelize.define(
    'TaxRecord',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      total_income: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      total_deductible_expenses: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      tax_payable: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      year: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'TaxRecords', timestamps: true }
  );
  return TaxRecord;
};