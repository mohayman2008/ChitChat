import { createServer } from 'http';
import { Server } from 'socket.io';
import { User} from '../models/models.js';
import dbStorage from '../config/db.js';

import AuthController from '../controllers/AuthController.js';
import QueryController from '../controllers/QueryController.js';
const { signUp, authenticate } = AuthController;
const { getUsers, getConversations, getMessages } = QueryController;

// Create an HTTP server
const httpServer = createServer();

// Create a Socket.IO server
const io = new Server(httpServer, {
  // Options can go here
});

// Event listener for new connections
io.on('connection', socket => {
  console.log(`User connected: ${socket.id}`);

  // client event emitter should pass a callback as the last arg,
  //  that call back will be called with the response
  socket.on('signUp', async (data, cb) => {
    const response = await signUp(data);
    cb(response);
  });

  socket.on('login', async (data, callback) => {
    try {
      const result = await AuthController.authenticate(data);
      callback(result);
    } catch (error) {
      console.error('Error during login:', error);
      callback({ status: 'error', message: 'An error occurred during login.' });
    }
  });


  // client event emitter should pass a callback as the last arg,
  //  that call back will be called with the response
  socket.on('authenticate', async (data, cb) => {
    const response = await authenticate(data);
    cb(response);
  });

  socket.on('getUsers', getUsers);
  socket.on('getConversations', getConversations);
  socket.on('getMessages', getMessages);

  // Event listener for setting username
  socket.on('setUsername', username => {
    socket.username = username;
    io.emit('userSet', { id: socket.id, username: socket.username });
  });

  // Event listener for incoming messages
  socket.on('msg', data => {
    io.emit('newmsg', { id: socket.id, username: socket.username, message: data.message });
  });


// Event handler for getting list of registered users
socket.on('getUsers', async (callback) => {
  try {
    // Fetch all users from the database, specifying attributes to retrieve
    const users = await User.findAll({
      attributes: ['id', 'name', 'status']
    });

    // Send success response with the list of users to the client
    callback({ status: 'OK', users });
  } catch (error) {
    // Handle errors and send error response to the client
    console.error('Error fetching users:', error);
    callback({ status: 'error', message: 'Failed to fetch users.' });
  }
});


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