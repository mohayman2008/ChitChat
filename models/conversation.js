import { Model, DataTypes } from 'sequelize';

import dbStorage from '../config/db.js';
import { updateById, deleteById } from './modelsHelperMethods';
import x from './models'; // eslint-disable no-unused-vars
const User = dbStorage.db.models.User;

class Conversation extends Model {
  static async createByUsers(users) {
    if (!Array.isArray(users) || users.length !== 2) {
      throw new Error('Invalid input: The method accepts an array of exactlty two <userId>s');
    }
    try {
      const [user1Id, user2Id] = users;
      return Conversation.create({
        user1Id: user1Id,
        user2Id: user2Id,
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  static updateById = updateById;
  static deleteById = deleteById;
}

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
}, {
  sequelize: dbStorage.db,
  tableName: 'conversations',
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

Conversation.belongsTo(User, {
  as: 'user1',
  foreignKey: 'user1Id',
  targetKey: 'id',
  onUpdate: 'NO ACTION',
});

Conversation.belongsTo(User, {
  as: 'user2',
  foreignKey: 'user2Id',
  targetKey: 'id',
  onUpdate: 'NO ACTION',
});

export default Conversation;
