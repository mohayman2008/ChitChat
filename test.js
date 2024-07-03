// Example script to demonstrate usage
/* eslint-disable no-unused-vars */
import dbStorage from './config/db.js';
import { User, UserStatus, Conversation, Message } from './models/models.js';

const LOGGING_ENABLED = false;
const [USER1_Id, USER2_Id] = ['', ''];
const CONV_ID = '';
const [MESSAGE1_Id, MESSAGE2_Id] = ['', ''];


let syncOptions = { alter: true };
// Function to initialize models and associations
async function init() {
  dbStorage.loggingEnable(LOGGING_ENABLED);
  try {
    syncOptions = { force: true }; // (force:true for development only)
    await dbStorage.db.sync(syncOptions);
    console.log('Database synchronized');
    
    // Create users
    const user1 = await User.create({
      name: 'user1',
      email: 'user1@example.com',
      password: 'password1',
      ipVersion: 4,
      ip: '192.168.0.1', // Example IP address
      port: 8080, // Example port
      key: 'user1_key', // Example key
    });

    const user2 = await User.create({
      name: 'userX',
      email: 'userX@example.com',
      password: 'password2',
      ipVersion: 4,
      ip: '192.168.0.2', // Example IP address
      port: 800, // Example port
      key: 'user2_key', // Example key
      authTime: new Date(), // Example authTime
    });
    console.log('Users created:', user1.toJSON(), user2.toJSON());
    
    // Create a conversation between user1 and user2
    const conversation = await Conversation.create({ user1Id: user1.id, user2Id: user2.id });
    console.log('Conversation created:', conversation.toJSON());
    
    // Add messages to the conversation
    const message1 = await Message.create({
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
    console.log('Messages exchanged:', message1.toJSON(), message2.toJSON());

    const userX = await User.create({
      name: 'user2',
      email: 'user2@example.com',
      password: 'password2',
    });
    console.log(`userX created: ${userX.toJSON()}`);

    const userXUpdated = await User.updateById(userX.id, { key: 'The very secret key' });
    console.log('userX updated:', userXUpdated.toJSON());
    console.log('userX deleted:', await User.deleteById(userX.id));
 
    /* const user1 = await User.findByPk(USER1_Id);
    const user2 = await User.findByPk(USER2_Id);
    console.log('Users retrieved:', user1.toJSON(), '\n', user2.toJSON(), '\n');

    const conversation = await Conversation.findByPk(CONV_ID, {include: Message });
    console.log('Conversation retrieved:', conversation.toJSON(), '\n');

    const message1 = await Message.findByPk(MESSAGE1_Id);
    const message2 = await Message.findByPk(MESSAGE2_Id);
    console.log('Messages exchanged:', message1.toJSON(), message2.toJSON(), '\n'); */

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
