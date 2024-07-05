import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

// import { User } from '../models/models.js';
import dbStorage from '../config/db.js';
import sessionStore from './sessionStore.js';
import AuthController from '../controllers/AuthController.js';
import QueryController from '../controllers/QueryController.js';
import ChatController from '../controllers/ChatController.js';

// Test Code
// console.log(uuidv4());
sessionStore.saveSession('78849577-dee8-4bf8-8d14-c6b663213303', {
  userId: '6a7ed183-bda3-4bce-8762-7d8caaf728a4',
  userKey: 'd81e66cc-52dc-43d1-9b59-30073798d9e9',
});
sessionStore.saveSession('ede26cd5-a63f-47f3-9468-f7df17ce8738', {
  userId: 'd80d582c-0d58-413d-8d44-c51f3b2011fb',
  userKey: '07f7ae3b-29de-453a-a061-c4d872ceac69',
});
// End test code

dbStorage.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
});

// Create an HTTP server
const httpServer = createServer();

// Create a Socket.IO server
const io = new Server(httpServer, {
  // Options can go here
});
io.use((socket, next) => {
  const sessionId = socket.handshake.auth.sessionId;
  if (sessionId) {
    const session = sessionStore.findSession(sessionId);
    if (!session) {
      socket.authorized = false;
      return next();
    }
    socket.authorized = true;
    socket.sessionId = sessionId;
    socket.userId = session.userId;
    socket.userKey = session.userKey;
  }
  next();
});

// Event listener for new connections
io.on('connection', socket => {
  console.log(`User connected: ${socket.sessionId}`);

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