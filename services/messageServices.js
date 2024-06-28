import Message from '../models/message.js';

class MessageService {
    async createMessage({ conversationId, content, userId }) {
      try {
        const message = await Message.create({ conversationId, content, userId });
        return message;
      } catch (error) {
        throw new Error(`Error creating message: ${error.message}`);
      }
    }

  async getAllMessages() {
    try {
      const messages = await Message.findAll();
      return messages;
    } catch (error) {
      console.error('Error retrieving messages:', error);
      throw error;
    }
  }

  async getMessagesByConversation(conversationId) {
    try {
      const messages = await Message.findAll({
        where: {
          conversationId: conversationId,
        },
      });
      return messages;
    } catch (error) {
      console.error(`Error retrieving messages for conversation ${conversationId}:`, error);
      throw error;
    }
  }

  async getMessageById(id) {
    try {
      const message = await Message.findByPk(id);
      if (!message) {
        throw new Error('Message not found');
      }
      return message;
    } catch (error) {
      console.error(`Error retrieving message with id ${id}:`, error);
      throw error;
    }
  }

  async updateMessageById(id, newData) {
    try {
      const message = await Message.findByPk(id);
      if (!message) {
        throw new Error('Message not found');
      }
      await message.update(newData);
      console.log('Message updated:', message.toJSON());
      return message;
    } catch (error) {
      console.error(`Error updating message with id ${id}:`, error);
      throw error;
    }
  }

  async deleteMessageById(id) {
    try {
      const message = await Message.findByPk(id);
      if (!message) {
        throw new Error('Message not found');
      }
      await message.destroy();
      console.log('Message deleted successfully');
    } catch (error) {
      console.error(`Error deleting message with id ${id}:`, error);
      throw error;
    }
  }
}

export default new MessageService();
