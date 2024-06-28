import { Op, Model, DataTypes } from 'sequelize';

import dbStorage from '../config/db.js';

import  User from './user.js';

class Conversation extends Model {}

Conversation.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user1Id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    user2Id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    sequelize: dbStorage.db,
    modelName: 'Conversation',
    timestamps: false
});

User.belongsToMany(Conversation, {
    through: 'UserConversations',
    foreignKey: 'UserId', // foreign key in the join table referring to User's id
    otherKey: 'ConversationId' // foreign key in the join table referring to Conversation's id
  });
  Conversation.belongsToMany(User, {
    through: 'UserConversations',
    foreignKey: 'ConversationId', // foreign key in the join table referring to Conversation's id
    otherKey: 'UserId' // foreign key in the join table referring to User's id
  });

export default Conversation;