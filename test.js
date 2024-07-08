// Example script to demonstrate usage
/* eslint-disable no-unused-vars */
import { v4 as uuidv4 } from 'uuid';
import dbStorage from './config/db.js';
import { User, UserStatus, Conversation, Message } from './models/models.js';

const LOGGING_ENABLED = false;
const [USER1_Id, USER2_Id] = ['6a7ed183-bda3-4bce-8762-7d8caaf728a4', 'd80d582c-0d58-413d-8d44-c51f3b2011fb'];
const CONV_ID = '8c13f164-dd7a-4e4f-9903-92cefe1b7400';
const [MESSAGE1_Id, MESSAGE2_Id] = ['f5c0a01e-e03c-47b1-84eb-cbe5605fa0a0', '221a42c0-93a2-479c-9f8e-972942df999f'];

// Message.destroy({where: {id: 'bff78293-d365-4119-8edd-6e583f49d1c9'}, force: true});

let syncOptions = { alter: true };
// Function to initialize models and associations
async function init() {
  dbStorage.loggingEnable(LOGGING_ENABLED);
  try {
    // syncOptions = { force: true }; // (force:true for development only)
    await dbStorage.db.sync(syncOptions);
    console.log('Database synchronized');
    
    // Create users
    /* const user1 = await User.create({
      name: 'user1',
      email: 'user1@example.com',
      password: 'pass1',
      ipVersion: 4,
      ip: '192.168.0.1', // Example IP address
      port: 8080, // Example port
      key: 'd81e66cc-52dc-43d1-9b59-30073798d9e9',
    });

    const user2 = await User.create({
      name: 'user2',
      email: 'user2@example.com',
      password: 'pass2',
      ipVersion: 4,
      ip: '192.168.0.2', // Example IP address
      port: 800, // Example port
      key: '07f7ae3b-29de-453a-a061-c4d872ceac69',
      authTime: new Date(), // Example authTime
    });
    console.log('Users created:', user1.toJSON(), user2.toJSON()); */
    
    // Create a conversation between user1 and user2
    /* const conversation = await Conversation.create({ user1Id: user1.id, user2Id: user2.id });
    console.log('Conversation created:', conversation.toJSON()); */
    
    // Add messages to the conversation
    /* const message1 = await Message.create({
      conversationId: conversation.id,
      content: 'this is a content',
      senderId: user1.id,
      receiverId: user2.id,
    });

    const message2 = await Message.create({
      conversationId: conversation.id,
      content: 'this is reply to content',
      senderId: user2.id,
      receiverId: user1.id,
    });
    console.log('Messages exchanged:', message1.toJSON(), message2.toJSON()); */

    // await (await User.findOne({ where: { name: 'userX' } })).destroy({ force: true });
    const userX = await User.create({
      name: 'userX',
      email: 'userX@example.com',
      password: 'XxXPaSsxXx',
    });
    console.log('userX created:', userX.toJSON());

    const userXUpdated = await User.updateById(userX.id, { key: 'The very secret key' });
    console.log('userX updated:', userXUpdated.toJSON());
    console.log('userX deleted:', await User.deleteById(userX.id, true));
 
    const user1 = await User.findByPk(USER1_Id);
    const user2 = await User.findByPk(USER2_Id);
    // await user1.update({ password: 'pass1' });
    // await user2.update({ password: 'pass2' });
    console.log('Users retrieved:', user1.toJSON(), '\n', user2.toJSON(), '\n');

    const conversation = await Conversation.findByPk(CONV_ID, {include: Message });
    console.log('Conversation retrieved:', conversation.toJSON(), '\n');

    const message1 = await Message.findByPk(MESSAGE1_Id);
    const message2 = await Message.findByPk(MESSAGE2_Id);
    console.log('Messages exchanged:', message1.toJSON(), message2.toJSON(), '\n');

    const user1Conversations = await user1.getConversations();
    console.log('user1 conversations =\n', user1Conversations.map(conv => conv.toJSON()), '\n');

    const user2Conversations = await user2.getConversations();
    console.log('user2 conversations =\n', user2Conversations.map(conv => conv.toJSON()), '\n');

    const messagesInConversation = await Message.findAll({ where: { conversationId: conversation.id }, include: [Conversation] });
    console.log('Messages in conversation:', messagesInConversation.map(msg => msg.toJSON()));
  } catch (error) {
    console.error('Error occurred:', error, '\n');
    console.error('Error stack:', error.stack, '\n');
  } finally {
    dbStorage.db.close();
  }
}
// Initialize the application
init();
