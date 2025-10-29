export default (sequelize, DataTypes) => {
  const TaxRecord = sequelize.define(
    'TaxRecord',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      total_income: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      total_deductible_expenses: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      tax_payable: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      tax_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'paid', 'overdue'),
        defaultValue: 'pending',
      },
    },
    {
      tableName: 'TaxRecords',
      timestamps: true,
    }
  );

  return TaxRecord;
};
