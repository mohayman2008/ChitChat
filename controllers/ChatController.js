import { Op } from 'sequelize';
import { validate as isUUID } from 'uuid';
const { and, or } = Op;

import { User, Conversation, Message } from '../models/models.js';
import AuthController from '../controllers/AuthController.js';
const { verifyKey } = AuthController;

class ChatController {
  static async sendMessageToConversation(convId, senderId, content) {
    const conversation = await Conversation.findByPk(convId, {
      where: {
        [or]: [{ user1Id: senderId }, { user1Id: senderId }],
      }
    });
    if (!conversation) {
      return { status: 'error', message: 'Invalid conversationId' };
    }
    let receiverId;
    if (conversation.user1Id === senderId) {
      receiverId = conversation.user2Id;
    } else {
      receiverId = conversation.user1Id;
    }

    const message = await Message.findByPk(
      (await conversation.createMessage({ content, senderId, receiverId,})).id, 
      {
        attributes: { exclude: ['senderId', 'receiverId', 'deleted_at'] },
        include: [
          {
            model: User,
            required: false,
            as: 'receiver',
            attributes: ['id', 'name'],
          }
        ],
      }
    );

    console.log(message.toJSON());

    return {
      response: message.toJSON(),
      messageId: message.id,
      receiverId,
    };
  }

  static async sendMessageToUser(senderId, receiverId, content) {
    if (receiverId === senderId) {
      return { status: 'error', message: 'Receiver can\'t be the sender' };
    }
    const conversation = await Conversation.findOrCreate({
      where: {
        [or]: [
          { [and]: [{ user1Id: senderId }, { user1Id: receiverId }] },
          { [and]: [{ user1Id: receiverId }, { user1Id: senderId }] },
        ],
      },
      defaults: {
        user1Id: senderId,
        user2Id: receiverId,
      }
    });
    if (!conversation) {
      return { status: 'error', message: 'Conversation couldn\'t be found or created' };
    }
    const message = await conversation.createMessage({
      content,
      senderId,
      receiverId,
    }, {
      attributes: { exclude: ['senderId', 'receiverId', 'deleted_at'] },
      include: [
        {
          model: User,
          required: false,
          as: 'receiver',
          attributes: ['id', 'name'],
        }
      ],
    });

    return {
      response: message.toJSON(),
      messageId: message.id,
      receiverId,
    };
  }

  static async sendMessage(sockets, data, cb) {
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
    const content = data.content;
    if (!content || content.trim().length ===0) {
      return cb({
        status: 'error',
        message: 'Missing message content or empty message body',
      });
    }

    let result;
    if (data.conversationId) {
      if (!isUUID(data.conversationId)) {
        return cb({
          status: 'error',
          message: 'invalid conversationId',
        });
      }
      result = await this.sendMessageToConversation(data.conversationId, user.id, content);
      cb(result.response || result);
    } else if (data.receiverId) {
      if (!isUUID(data.receiverId)) {
        return cb({
          status: 'error',
          message: 'invalid receiverId',
        });
      }
      result = await this.sendMessageToUser(user.id, data.receiverId, content);
      cb(result.response || result);
    } else {
      return cb({
        status: 'error',
        message: 'invalid request: Either conversationId or receiverId should be provided',
      });
    }

    const message = await Message.findByPk(result.messageId, {
      attributes: { exclude: ['senderId', 'receiverId', 'deleted_at'] },
      include: [
        {
          model: User,
          required: false,
          as: 'sender',
          attributes: ['id', 'name'],
        }
      ],
    });

    const receiverId = result.receiverId;
    for (const socket of sockets.values()) {
      if (socket.userId === receiverId) {
        socket.emit('new message', message.toJSON());
      }
    }
  }
}
export default ChatController;
