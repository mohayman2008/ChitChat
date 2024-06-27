import { Op, Model, DataTypes } from 'sequelize';

import dbStorage from '../db';
import { type } from 'os';

const User = require('./user');


class Conversation extends Model {}

Conversation.init({
  id: { type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true },
  user1: {
    type: DataTypes.INTEGER,
    allowNull: false },
    user2 : {
        type: DataTypes.INTEGER,
        allowNull:false
    },
},


{ 
    sequelize: dbStorage.db,
    modelName: 'Conversation',
    tableName: 'Conversations' 
});
