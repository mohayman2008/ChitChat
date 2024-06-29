import { Model, DataTypes } from 'sequelize';

import dbStorage from '../config/db.js';
// import User from './user';
const User = dbStorage.db.models.User;

class Conversation extends Model {}
Conversation.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user1Id: {
    field: 'user1_id',
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  user2Id: {
    field: 'user2_id',
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  sequelize: dbStorage.db,
  tableName: 'conversations',
  timestamps: false,
});

export default Conversation;
