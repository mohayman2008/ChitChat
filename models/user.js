import { Op, Model, DataTypes } from 'sequelize';

const { or } = Op;

// import dbStorage from '../db';
import dbStorage from '../config/db.js';
// import models from './models';

export const UserStatus = Object.freeze({
  ACTIVE: 'active',
  NOT_ACTIVE: 'not_active',
});

export default class User extends Model {
  async getConversations() {
    let query = 'SELECT conversations.* FROM users ';
    // let query = 'SELECT * FROM users ';
    query += 'JOIN conversations ';
    query += 'ON users.id = conversations.user1_id ';
    query += 'OR users.id = conversations.user2_id ';
    query += `WHERE users.id = '${this.id}'`;
    const [queryResult, result] = await dbStorage.db.query(query);
    return result.rows;
  }
}
User.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: {
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
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(UserStatus),
      defaultValue: UserStatus.NOT_ACTIVE,
    },
    ipVersion: {
      field: 'ip_version',
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
      field: 'authenticated_at',
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

// export class UserConversations extends Model {}
// UserConversations.init(
//   {
//     userId: {
//       field: 'user_id',
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: User,
//         key: 'id',
//       },
//     },
//     conversationId: {
//       field: 'conversation_id',
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: Conversation,
//         key: 'id',
//       },
//       defaultScope: {
//         where: {
//           [or]: [
//             { user1Id: 'userId' },
//             { user2Id: 'userId' },
//           ],
//         }
//       },
//     },
//   },
//   {
//     sequelize: dbStorage.db,
//     tableName: 'users_conversations',
//     timestamps: false,
//   },
// );

// Conversation.belongsToMany(User, {
//   through: UserConversations,
//   foreignKey: 'conversationId', // foreign key in the join table referring to Conversation's id
//   otherKey: 'userId', // foreign key in the join table referring to User's id
//   onUpdate: 'CASCADE',
//   onDelete: 'CASCADE',
// });

// User.belongsToMany(Conversation, {
//   through: UserConversations,
//   foreignKey: 'userId',
//   otherKey: 'conversationId',
//   onUpdate: 'CASCADE',
//   onDelete: 'CASCADE',
// });

/* User.belongsToMany(Conversation, {
  through: UserConversations,
  foreignKey: 'userId', // foreign key in the join table referring to User's id
  otherKey: 'conversationId' // foreign key in the join table referring to Conversation's id
}); */

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
