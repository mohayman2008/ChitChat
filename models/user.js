import { Op, Model, DataTypes } from 'sequelize';
const { or } = Op;

import dbStorage from '../config/db.js';
import { updateById, deleteById } from './modelsHelperMethods';
import x from './models'; // eslint-disable no-unused-vars

export const UserStatus = Object.freeze({
  ACTIVE: 'active',
  NOT_ACTIVE: 'not_active',
});

export default class User extends Model {
  static updateById = updateById;
  static deleteById = deleteById;

  async getConversations() {
    const result = await dbStorage.db.models.Conversation.findAll({
      where: {
        [or]: [
          { user1Id: this.id },
          { user2Id: this.id },
        ],
        deleted_at: null,
      },
      attributes: { exclude: ['user1Id', 'user2Id', 'deleted_at'] },
      include: [
        {
          model: User,
          as: 'user1',
          attributes: ['id', 'name', 'status'],
        },
        {
          model: User,
          as: 'user2',
          attributes: ['id', 'name', 'status'],
        },
      ],
    });
    return result;
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
    picture: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(UserStatus),
      defaultValue: UserStatus.NOT_ACTIVE,
    },
    lastLogin: {
      field: 'last_login',
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
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
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
);
