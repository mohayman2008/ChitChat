
import { Op } from 'sequelize';
import { validate as isUUID } from 'uuid';
const { or, ne } = Op;

import AuthController from '../controllers/AuthController.js';
import { User, Conversation } from '../models/models.js';
const { checkSession, verifyKey } = AuthController;

export default class QueryController {

  static async getUsers(socket, data, cb) {
    const user = checkSession(socket);
    if (!user) {
      return cb({
        status: 'error',
        message: 'Authentication failed',
      });
    }

    try {
      const users = await User.findAll({
        where: { id: { [ne]: user.id }},
        attributes: ['id', 'name', 'picture', 'status'],
      });

      cb({
        status: 'OK',
        results: users.map(user => user.toJSON()),
      });
    } catch (error) {
      cb({
        status: 'error',
        message: 'Error fetching users',
      });
    }
  }

  static async getConversations(socket, data, cb) {
    const user = checkSession(socket);
    if (!user) {
      return cb({
        status: 'error',
        message: 'Authentication failed',
      });
    }

    const offset = data.page || 0;
    const limit = data.pageSize || 30;

    if ((typeof offset !== 'number' && offset >= 0) || (typeof limit !== 'number' && limit > 0)) {
      return cb({
        status: 'error',
        message: '<page> and <pageSize> should be valid numbers',
      });
    }

    try {
      const conversations = await user.getConversations(offset, limit);
      cb({
        status: 'OK',
        results: conversations.map(conv => conv.toJSON()),
      });
    } catch (error) {
      cb({
        status: 'error',
        message: 'Error fetching conversations',
      });
    }
  }

  static async getMessages(socket, data, cb) {
    const user = checkSession(socket);
    if (!user) {
      return cb({
        status: 'error',
        message: 'Authentication failed',
      });
    }

    if (!data.conversationId) {
      return cb({
        status: 'error',
        message: 'conversationId is missing',
      });
    }

    if (!isUUID(data.conversationId)) {
      return cb({
        status: 'error',
        message: 'invalid conversationId',
      });
    }

    try {
      const conversation = await Conversation.findByPk(data.conversationId, {
        where: {
          [or]: [
            { user1Id: user.id },
            { user2Id: user.id },
          ],
          deleted_at: null,
        },
      });

      if (!conversation) {
        return cb({
          status: 'error',
          message: 'invalid conversationId',
        });
      }

      const messages = await conversation.getMessages({
        attributes: { exclude: ['senderId', 'receiverId', 'deleted_at'] },
        include: [
          {
            model: User,
            required: false,
            as: 'sender',
            attributes: ['id', 'name'],
            where: { id: { [ne]: user.id} },
          },
          {
            model: User,
            required: false,
            as: 'receiver',
            attributes: ['id', 'name'],
            where: { id: { [ne]: user.id} },
          }
        ],
      });

      cb({
        status: 'OK',
        results: messages.map(message => message.toJSON()),
      });
    } catch (error) {
      cb({
        status: 'error',
        message: 'Error fetching messages',
      });
    }
  }
}
