import { Op, Model, DataTypes } from 'sequelize';

import dbStorage from '../db';

export const UserStatus = Object.freeze({
  ACTIVE: 'active',
  NOT_ACTIVE: 'not_active',
});

class User extends Model {}

User.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.STRING(48),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userName: {
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
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    sequelize: dbStorage.db,
    modelName: 'User',
    tableName: 'users' 
  },
);

module.exports = User;