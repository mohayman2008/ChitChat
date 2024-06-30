// Example script to demonstrate usage

import dbStorage from './config/db.js';
import x from './models/models.js';
import User from './models/user.js';
import Conversation from './models/conversation.js';
import Message from './models/message.js';
import UserService from './services/userServices.js';
import MessageService from './services/messageServices.js';
import ConversationService from './services/conversationServices';

const LOGGING_ENABLED = true;

// Function to initialize models and associations
async function init() {
  dbStorage.loggingEnable(LOGGING_ENABLED);
  try {
    // await dbStorage.db.sync({ force: true }); // Sync models with database (force:true for development only)
    await dbStorage.db.sync({ alter: true });
    console.log('Database synchronized');
    
    // Create users
    // const user1 = await UserService.createUser(
    //   'user1',
    //   'user1@example.com',
    //   'password1',
    //   '192.168.0.1', // Example IP address
    //   8080, // Example port
    //   'user1_key', // Example key
    //   new Date(), // Example authTime
    // );

    // const user2 = await UserService.createUser(
    //   'user2',
    //   'user2@example.com',
    //   'password2',
    //   '192.168.0.2', // Example IP address
    //   8081, // Example port
    //   'user2_key', // Example key
    //   new Date(), // Example authTime
    // );
    // console.log('Users created:', user1.toJSON(), user2.toJSON());
    
    // Create a conversation between user1 and user2
    // const conversation = await Conversation.create({ user1Id: user1.id, user2Id: user2.id });
    // console.log('Conversation created:', conversation.toJSON());
    
    // Add messages to the conversation
    // const message1 = await MessageService.createMessage({
    //   conversationId: conversation.id,
    //   content: 'this is a content',
    //   senderId: user1.id,
    //   receiverId: user2.id,
    // });

    // const message2 = await MessageService.createMessage({
    //   conversationId: conversation.id,
    //   content: 'this is reply to content',
    //   senderId: user2.id,
    //   receiverId: user1.id,
    // });
    // console.log('Messages exchanged:', message1.toJSON(), message2.toJSON());

    const user1 = await User.findByPk('0077ba34-e018-474c-a917-48c96873adf2');
    const user2 = await User.findByPk('817aebdf-2728-4503-9d2f-183df2024aad');
    console.log('Users retrieved:', user1.toJSON(), user2.toJSON(), '\n');

    const conversation = await Conversation.findByPk('03839c43-c5f1-4dc4-a71e-f2eb02ddd519');
    console.log('Conversation retrieved:', conversation.toJSON(), '\n');

    const message1 = await Message.findByPk('dc20c867-9939-4015-87ef-d005dd8e003c');
    const message2 = await Message.findByPk('0d10e3f0-91a0-48f4-869a-ead3596441a2');
    console.log('Messages exchanged:', message1.toJSON(), message2.toJSON(), '\n');

    const user1Conversations = await user1.getConversations();
    console.log('user1 conversations =\n', user1Conversations.map(conv => conv.toJSON()), '\n');

    const user2Conversations = await user2.getConversations();
    console.log('user2 conversations =\n', user2Conversations.map(conv => conv.toJSON()), '\n');

    const messagesInConversation = await Message.findAll({ where: { conversationId: conversation.id } });
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
