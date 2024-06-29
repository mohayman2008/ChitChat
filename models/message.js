import { Model, DataTypes } from 'sequelize';

import dbStorage from '../config/db.js';

import  User from './user.js';
import Conversation from './conversation.js';

class Message extends Model {}

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
  timestamps: false,
});

// User.hasMany(Message, { foreignKey: 'userId' });
// Message.belongsTo(User, { foreignKey: 'userId' });
Conversation.hasMany(Message, { foreignKey: 'conversationId' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

export default Message;
