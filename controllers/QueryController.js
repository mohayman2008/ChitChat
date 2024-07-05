
import { Op } from 'sequelize';
import { validate as isUUID } from 'uuid';
const { or, ne } = Op;

import AuthController from '../controllers/AuthController.js';
import { User, Conversation } from '../models/models.js';
const { verifyKey } = AuthController;

export default class QueryController {

  static async getUsers(data, cb) {
    if (!data || !data.key) {
      return cb({
        status: 'error',
        message: 'key-token is missing',
      });
    }

    const user = await verifyKey(data.key);
    if (!user) {
      return cb({
        status: 'error',
        message: 'Authentication failed',
      });
    }

    try {
      const result = await User.findAll({
        attributes: ['id', 'name', 'picture', 'status'],
      });

      cb({
        status: 'OK',
        users: result.map(user => user.toJSON()),
      });
    } catch (error) {
      cb({
        status: 'error',
        message: 'Error fetching users',
      });
    }
  }

  static async getConversations(data, cb) {
    if (!data || !data.key) {
      return cb({
        status: 'error',
        message: 'key-token is missing',
      });
    }

    const user = await verifyKey(data.key);
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
      const conversations = await Conversation.findAll({
        where: {
          [or]: [
            { user1Id: user.id },
            { user2Id: user.id },
          ],
          deleted_at: null,
        },
        offset,
        limit,
        include: [
          {
            model: User,
            as: 'user1',
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'user2',
            attributes: ['id', 'name'],
          }
        ],
      });

      const result = conversations.map(conversation => {
        const otherUser = conversation.user1Id === user.id ? conversation.user2 : conversation.user1;
        return {
          id: conversation.id,
          user: otherUser.toJSON(),
        };
      });

      cb({
        status: 'OK',
        conversations: result,
      });
    } catch (error) {
      cb({
        status: 'error',
        message: 'Error fetching conversations',
      });
    }
  }

  static async getMessages(data, cb) {
    if (!data || !data.key) {
      return cb({
        status: 'error',
        message: 'key-token is missing',
      });
    }

    const user = await verifyKey(data.key);
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
        include: [
          {
            model: User,
            as: 'user1',
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'user2',
            attributes: ['id', 'name'],
          }
        ],
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
            as: 'sender',
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'receiver',
            attributes: ['id', 'name'],
          }
        ],
      });

      cb({
        status: 'OK',
        messages: messages.map(message => message.toJSON()),
      });
    } catch (error) {
      cb({
        status: 'error',
        message: 'Error fetching messages',
      });
    }
  }
}
