import { Model, DataTypes } from 'sequelize';

import dbStorage from '../config/db.js';
import { updateById, deleteById } from './modelsHelperMethods.js';
import { User } from './models.js';

export default class Session extends Model {
  static updateById = updateById;
  static deleteById = deleteById;
}

Session.init(
  {
    key: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    userId: {
      field: 'user_id',
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
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
    authTime: {
      field: 'authenticated_at',
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: dbStorage.db,
    tableName: 'sessions',
    createdAt: false,
    updatedAt: 'updated_at',
  },
);

Session.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasOne(Session, {
  as: 'session',
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
