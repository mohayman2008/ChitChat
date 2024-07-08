import { createServer } from 'http';
import { Server } from 'socket.io';

import { Session } from '../models/models.js';
import dbStorage from '../config/db.js';
import AuthController from '../controllers/AuthController.js';
import QueryController from '../controllers/QueryController.js';
import ChatController from '../controllers/ChatController.js';

dbStorage.sync({ force: false, alter: true }).then(() => {
  console.log('Database & tables created!');
});

// Create an HTTP server
const httpServer = createServer();

// Create a Socket.IO server
const io = new Server(httpServer, {
  // Options can go here
});
io.use(async (socket, next) => {
  const key = socket.handshake.auth.sessionKey;
  if (key) {
    const session = await Session.findByPk(key, { include: ['user'] });
    if (!session) {
      socket.authorized = false;
      return next();
    }
    socket.authorized = true;
    socket.session = session;
    socket.key = key;
    socket.user = session.user;
    // console.log('User authenticated:', socket.user.toJSON());
  }
  next();
});

// Event listener for new connections
io.on('connection', socket => {
  console.log(`User connected: ${socket.key|| 'Not authenticated'}`);

  if (socket.authorized) {
    const { id, name, email, lastLogin } = socket.user;
    socket.emit('session', {
      key: socket.key,
      id,
      name,
      email,
      last_login: lastLogin,
    });
  } else {
    socket.emit('unauthorized', {
      message: 'Unauthorized access',
    });
  }

  // client event emitter should pass a callback as the last arg,
  //  that call back will be called with the response
  socket.on('signUp', AuthController.signUp); /* fix isssues */
  socket.on('login', (data, cb) => {
    AuthController.authenticate(socket, data, cb);
  });
  socket.on('disconnect', AuthController.signOut); /* //////////////////// */

  socket.on('getUsers', (data, cb) => {
    QueryController.getUsers(socket, data, cb);
  });

  socket.on('getConversations', (data, cb) => {
    QueryController.getConversations(socket, data, cb);
  });

  socket.on('getMessages', (data, cb) => {
    QueryController.getMessages(socket, data, cb);
  });

  socket.on('sendMessage', (data, cb) => {
    ChatController.sendMessage(socket, data, cb);
  });

  // Event listener for disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.key}`);
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