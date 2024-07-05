import { hashSync } from 'bcrypt';
import { Op, Model, DataTypes } from 'sequelize';
const { or } = Op;

import dbStorage from '../config/db.js';
import { updateById, deleteById } from './modelsHelperMethods.js';
import { Conversation } from './models.js';

export const UserStatus = Object.freeze({
  ACTIVE: 'active',
  NOT_ACTIVE: 'not_active',
});

export default class User extends Model {
  static updateById = updateById;
  static deleteById = deleteById;

  async getConversations(offset=0, limit) {
    const queryOptions = {
      where: {
        [or]: [
          { user1Id: this.id },
          { user2Id: this.id },
        ],
        deleted_at: null,
      },
      order: [['updated_at', 'DESC']],
      offset,
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
    };
    if (typeof limit === 'number') queryOptions.limit = limit;
    const result = await Conversation.findAll(queryOptions);
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
      set(pw) {
        this.setDataValue('password', hashSync(pw, 10));
      }
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
