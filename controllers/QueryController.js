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

    const result = await User.findAll(
      {
        attributes: ['id', 'name', 'picture', 'status'],
      });
    return cb({
      status: 'OK',
      result: result.map(obj => obj.toJSON()),
    });
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

    return cb({
      status: 'OK',
      result: (await user.getConversations()).map(obj => obj.toJSON()),
    });
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

    const conversation = await Conversation.findByPk(data.conversationId, {
      where: {
        [or]: [
          { user1Id: user.id },
          { user2Id: user.id },
        ],
        deleted_at: null,
      }
    });
    if (!conversation) {
      return cb({
        status: 'error',
        message: 'invalid conversationId',
      });
    }

    const result = await conversation.getMessages({
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

    return cb({
      status: 'OK',
      result: result.map(obj => obj.toJSON()),
    });
  }
}
