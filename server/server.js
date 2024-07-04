import { createServer } from 'http';
import { Server } from 'socket.io';
import { User} from '../models/models.js';
import dbStorage from '../config/db.js';

import AuthController from '../controllers/AuthController.js';
import QueryController from '../controllers/QueryController.js';
const { signUp, authenticate, signOut } = AuthController;
const { getUsers, getConversations, getMessages } = QueryController;

// export const onlineUsers = [];

dbStorage.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
});

// Create an HTTP server
const httpServer = createServer();

// Create a Socket.IO server
const io = new Server(httpServer, {
  // Options can go here
});
export const sockets = io.sockets.sockets; 

// Event listener for new connections
io.on('connection', socket => {
  console.log(`User connected: ${socket.id}`);

  // client event emitter should pass a callback as the last arg,
  //  that call back will be called with the response
  socket.on('signUp', signUp); /* fix isssues */
  socket.on('login', authenticate);
  socket.on("disconnect", signOut); /* //////////////////// */

  socket.on('getUsers', getUsers);
  socket.on('getConversations', getConversations);
  socket.on('getMessages', getMessages);

  // Send a message to another user
  socket.on('sendMessage', async (data, callback) => {
    try {
      if (!socket.userId) {
        return callback({ status: 'error', message: 'User not authenticated.' });
      }

      // Add sender's userId to data
      data.senderId = socket.userId;

      await AuthController.sendMessage(socket, data);
      callback({ status: 'success', message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending message:', error);
      callback({ status: 'error', message: 'Failed to send message.' });
    }
  });


    // Get conversations for the current user
    socket.on('getConversations', async callback => {
      try {
        if (!socket.userId) {
          return callback({ status: 'error', message: 'User not authenticated.' });
        }
  
        await AuthController.listConversations(socket);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        socket.emit('listConversations', { status: 'error', message: 'Error fetching conversations' });
      }
    });


  // Event listener for disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the HTTP server
const PORT = 3000;
httpServer.listen(PORT, async () => {
  // Check if database connection is alive before starting the server
  const isDbAlive = await dbStorage.checkAlive();
  if (!isDbAlive) {
    console.error('Database connection failed. Server cannot start.');
    return;
  }

  console.log(`Server is running on port ${PORT}`);
});