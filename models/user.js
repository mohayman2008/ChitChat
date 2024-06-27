import { Op, Model, DataTypes } from 'sequelize';

import dbStorage from '../db';

export const UserStatus = {
  ACTIVE: 'active',
  NOT_ACTIVE: 'not_active'
}

dbStorage.define("User",
  'User',
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
    // status: {
    //   type: "enum",
    //   enum: UserStatus,
    //   default: UserStatus.NOT_ACTIVE
    // },
    ipVersion: {
      type: DataTypes.INTEGER,
    },
    ip: {
      type: DataTypes.STRING(48),
    },
    port: {
      type: DataTypes.INTEGER,
    },
    key: {
      type: DataTypes.STRING(48),
    },
    authTime: {
      type: DataTypes.DATE,
    },
  },
  { tableName: 'users' },
);
