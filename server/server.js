import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import { Session, User } from '../models/models.js';
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
  const key = socket.handshake.auth.key;
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
  }
  next();
});

// Event listener for new connections
io.on('connection', socket => {
  console.log(`User connected: ${socket.key}`);

  if (socket.authorized) {
    socket.emit('session', {
      sessionId: socket.sessionId,
      key: socket.userKey,
    });
  } else {
    socket.emit('unauthorized', {
      message: 'Unauthorized access',
    });
  }

  // client event emitter should pass a callback as the last arg,
  //  that call back will be called with the response
  socket.on('signUp', AuthController.signUp); /* fix isssues */
  socket.on('login', AuthController.authenticate);
  socket.on('disconnect', AuthController.signOut); /* //////////////////// */

  socket.on('getUsers', QueryController.getUsers);
  socket.on('getConversations', QueryController.getConversations);
  socket.on('getMessages', QueryController.getMessages);

  socket.on('sendMessage', (data, cb) => {
    ChatController.sendMessage(io.sockets.sockets, data, cb);
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