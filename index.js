import sequelize from './config/db.js';
import { DataTypes } from 'sequelize';

const importModel = async (path) => (await import(path)).default;

async function main() {
  try {
    
    await sequelize.authenticate();
    console.log('Connected to MySQL!');

    const User = (await importModel('./models/User.js'))(sequelize, DataTypes);
    const Transaction = (await importModel('./models/Transaction.js'))(sequelize, DataTypes);
    const TaxRecord = (await importModel('./models/TaxRecord.js'))(sequelize, DataTypes);
    const Reminder = (await importModel('./models/Reminder.js'))(sequelize, DataTypes);

    
    User.hasMany(Transaction, { foreignKey: 'userId' });
    Transaction.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(TaxRecord, { foreignKey: 'userId' });
    TaxRecord.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(Reminder, { foreignKey: 'userId' });
    Reminder.belongsTo(User, { foreignKey: 'userId' });


    await sequelize.sync({ force: true }); 
    console.log('Tables created: Users, Transactions, TaxRecords, Reminders');

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();