import { Op } from 'sequelize';
const Conversation = require('../models/conversation');

class ConversationService {
  async createConversation(user1Id, user2Id) {
    try {
      const conversation = await Conversation.create({
        user1Id: user1Id,
        user2Id: user2Id,
        timestamp: new Date(), // Timestamp for when the conversation is created
      });
      console.log('Conversation created:', conversation.toJSON());
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  async getAllConversations() {
    try {
      const conversations = await Conversation.findAll();
      return conversations;
    } catch (error) {
      console.error('Error retrieving conversations:', error);
      throw error;
    }
  }

  async getConversationsByUserId(userId) {
    try {
      const conversations = await Conversation.findAll({
        where: {
          [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
        },
      });
      return conversations;
    } catch (error) {
      console.error(`Error retrieving conversations for user ${userId}:`, error);
      throw error;
    }
  }

  async getConversationById(id) {
    try {
      const conversation = await Conversation.findByPk(id);
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      return conversation;
    } catch (error) {
      console.error(`Error retrieving conversation with id ${id}:`, error);
      throw error;
    }
  }

  async updateConversationById(id, newData) {
    try {
      const conversation = await Conversation.findByPk(id);
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      await conversation.update(newData);
      console.log('Conversation updated:', conversation.toJSON());
      return conversation;
    } catch (error) {
      console.error(`Error updating conversation with id ${id}:`, error);
      throw error;
    }
  }

  async deleteConversationById(id) {
    try {
      const conversation = await Conversation.findByPk(id);
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      await conversation.destroy();
      console.log('Conversation deleted successfully');
    } catch (error) {
      console.error(`Error deleting conversation with id ${id}:`, error);
      throw error;
    }
  }
}

export default new ConversationService();
