import { Op, Model, DataTypes } from 'sequelize';

import dbStorage from '../db';
// import Conversation from './conversation';

const Conversation = dbStorage.db.define('Conversation');

export const UserStatus = Object.freeze({
  ACTIVE: 'active',
  NOT_ACTIVE: 'not_active',
});

export default class User extends Model {}

User.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUIDV4,
      autoGe
      allowNull: false,
    },
    createdAt: {
      field: 'created_at';
      type: DataTypes.DATE,
      allowNull: false,
    },
    userName: {
      field: 'user_name';
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(UserStatus),
      defaultValue: UserStatus.NOT_ACTIVE,
    },
    ipVersion: {
      field: 'ip_version';
      type: DataTypes.INTEGER,
      defaultValue: 4,
    },
    ip: {
      type: DataTypes.STRING(48),
      defaultValue: null,
    },
    port: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    key: {
      type: DataTypes.STRING(48),
      defaultValue: null,
    },
    authTime: {
      field: 'authenticated_at';
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    sequelize: dbStorage.db,
    tableName: 'users',
    timestamps: false,
  },
);

class UserConversations extends Model {};

UserConversations.init(
  {
    userId: {
      field: 'user_id',
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    conversationId: {
      field: 'conversation_id',
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: Conversation,
        key: 'id',
      },
    },
  }
  {
    sequelize: dbStorage.db,
    tableName: 'users_conversations',
    timestamps: false,
  },
);



User.belongsToMany(Conversation, {
  foreignKey: 'userId',
  otherKey: 'conversationId',
  through: UserConversations,
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});

/* Conversation.belongsToMany(User, {
  foreignKey: 'conversationId',
  otherKey: 'userId',
  as: 'user1',
  through: 'user_conversations',
});

Conversation.belongsToMany(User, {
  foreignKey: 'user2',
  targetKey: 'id',
  as: 'user2',
  through: 'user_conversations',
}); */
