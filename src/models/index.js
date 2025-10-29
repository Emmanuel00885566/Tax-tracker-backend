import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

import UserModel from './user.model.js';
import TransactionModel from './transaction.model.js';
import TaxRecordModel from './taxRecord.model.js';
import NotificationModel from './notification.model.js';

const User = UserModel(sequelize, DataTypes);
const Transaction = TransactionModel(sequelize, DataTypes);
const TaxRecord = TaxRecordModel(sequelize, DataTypes);
const Notification = NotificationModel(sequelize, DataTypes);

User.hasMany(Transaction, { foreignKey: 'userId', onDelete: 'CASCADE' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(TaxRecord, { foreignKey: 'userId', onDelete: 'CASCADE' });
TaxRecord.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId' });

export const syncDB = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Database synced successfully!');
  } catch (err) {
    console.error('❌ Error syncing DB:', err.message);
  }
};

export { User, Transaction, TaxRecord, Notification };
export default sequelize;
