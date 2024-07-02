import { Model, DataTypes } from 'sequelize';

import dbStorage from '../config/db.js';
import { updateById, deleteById } from './modelsHelperMethods';
// import x from './models'; // eslint-disable no-unused-vars
import  User from './user.js';
import Conversation from './conversation.js';
// const User = dbStorage.db.models.User;
// const Conversation = dbStorage.db.models.Conversation;

class Message extends Model {
  static updateById = updateById;
  static deleteById = deleteById;
}

Message.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  conversationId: {
    field: 'conversation_id',
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Conversation,
      key: 'id'
    }
  },
  senderId: {
    field: 'sender_id',
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  receiverId: {
    field: 'receiver_id',
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  sequelize: dbStorage.db,
  tableName: 'messages',
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

Conversation.hasMany(Message, { foreignKey: 'conversationId' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

export default Message;
