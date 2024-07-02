import { createServer } from 'http';
import { Server } from 'socket.io';

import { signUp, authenticate, verifyKey } from '../controllers/AuthController';

// Create an HTTP server
const httpServer = createServer();

// Create a Socket.IO server
const io = new Server(httpServer, {
    // Options can go here
});

// Event listener for new connections
io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`);

    socket.on('signUp', signUp);

    socket.on('authenticate', authenticate);

    // Event listener for setting username
    socket.on('setUsername', username => {
        socket.username = username;
        io.emit('userSet', { id: socket.id, username: socket.username });
    });

    // Event listener for incoming messages
    socket.on('msg', data => {
        io.emit('newmsg', { id: socket.id, username: socket.username, message: data.message });
    });

    // Event listener for disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start the HTTP server
const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
