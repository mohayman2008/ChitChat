// Example script to demonstrate usage

import dbStorage from './config/db.js';
import User from './models/user.js';
import Conversation from './models/conversation.js';
import Message from './models/message.js';
import MessageService from './services/messageServices.js'
import  UserService from './services/userServices.js'


// Function to initialize models and associations
async function init() {
  try {
    await dbStorage.db.sync({ force: true }); // Sync models with database (force:true for development only)
    console.log('Database synchronized');
    
    // Create users
    const user1 = await UserService.createUser(
        'user1',
        'user1@example.com',
        'password1',
        '192.168.0.1', // Example IP address
        8080, // Example port
        'user1_key', // Example key
        new Date() // Example authTime
      );


      const user2 = await UserService.createUser(
        'user2',
        'user2@example.com',
        'password2',
        '192.168.0.2', // Example IP address
        8081, // Example port
        'user2_key', // Example key
        new Date() // Example authTime
      );
    console.log('Users created:', user1.toJSON(), user2.toJSON());
    
    // Create a conversation between user1 and user2
    const conversation = await Conversation.create({ user1Id: user1.id, user2Id: user2.id });
    console.log('Conversation created:', conversation.toJSON());
    
    // Add messages to the conversation
    const message1 = await MessageService.createMessage({
        conversationId: conversation.id,
        content: "this is a content",
        userId: user1.id
    });

    const message2 = await MessageService.createMessage({
        conversationId: conversation.id,
        content: "this is another text",
        userId: user2.id
    });
    
    console.log('Messages exchanged:', message1.toJSON(), message2.toJSON());
 // Fetch all conversations with users included
 const allConversations = await Conversation.findAll({ include: [User] });
 console.log('All conversations:', allConversations.map(conv => conv.toJSON()));

 const messagesInConversation = await Message.findAll({ where: { conversationId: conversation.id } });
 console.log('Messages in conversation:', messagesInConversation.map(msg => msg.toJSON()));
} catch (error) {
 console.error('Error occurred:', error);
} finally {
 dbStorage.db.close();
}
}
// Initialize the application
init();
