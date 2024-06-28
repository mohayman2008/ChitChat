import { Op, Model, DataTypes } from 'sequelize';

import dbStorage from '../db';

const User = require('./user');

class Message extends Model {}

Message.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  sentDateTime: { type: DataTypes.DATE, allowNull: false },
  senderId: {
    type: DataTypes.INTEGER,
    references: { 
        model: 'User',
        key: 'id' },
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.INTEGER,
    references: { model: 'User', key: 'id' },
    allowNull: false,
  },
}, 
{ 
    sequelize: dbStorage.db,
    modelName: 'Message',
    tableName: 'Messages' 
});

// Define associations, a a one-to-many association
// between the User model and the Message model.
User.hasMany(Message, { foreignKey: 'senderId', as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'ReceivedMessages' });

//senderId, receiverId : This sets up the senderId column in the Message model as the foreign key that
   //links back to the id column in the User model. It indicates that the User model acts as the source
   //of this association.
   
//SentMessages,ReceivedMessages : Provides an alias (SentMessages) that Sequelize uses to refer to this association.

module.exports = { User, Message};