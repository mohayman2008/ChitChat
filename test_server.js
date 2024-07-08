/* eslint-disable no-unused-vars */
import io from 'socket.io-client';
import dbStorage from './config/db.js';
import { User, UserStatus, Conversation, Message, Session } from './models/models.js';
import sessionStore from './server/sessionStore.js';

const session1 = (await Session.findOrCreate({
  where: {
    key: '78849577-dee8-4bf8-8d14-c6b663213303',
    userId: '6a7ed183-bda3-4bce-8762-7d8caaf728a4',
  }
}))[0];

const session2 = (await Session.findOrCreate({
  where: {
    key: 'ede26cd5-a63f-47f3-9468-f7df17ce8738',
    userId: 'd80d582c-0d58-413d-8d44-c51f3b2011fb',
  }
}))[0];

// console.log(session1.toJSON());
// console.log(session2.toJSON());

const socket2 = await io('http://localhost:3000', {
  // auth: { sessionId: 'ede26cd5-a63f-47f3-9468-f7df17ce8738' },
  auth: { sessionKey: 'ede26cd5-a63f-47f3-9468-f7df17ce8738' },
});

const socket = await io('http://localhost:3000', {
  // auth: { sessionId: '78849577-dee8-4bf8-8d14-c6b663213303' },
  auth: { sessionKey: '78849577-dee8-4bf8-8d14-c6b663213303' },
});

socket.timeout(5000).emit('sendMessage', {
  key: '78849577-dee8-4bf8-8d14-c6b663213303',
  content: 'hello',
  // conversationId: '8c13f164-dd7a-4e4f-9903-92cefe1b7400',
  receiverId: 'd80d582c-0d58-413d-8d44-c51f3b2011fb',
}, (err, data) => {
  if (err) {
    console.error('Error sending message:', err);
  } else {
    console.log('Message sending response:', data);
  }
});

socket2.on('new message', (data) => {
  console.log('New message received for socket2:', data);
});

Message.destroy({ where: { content: 'hello' }, force: true });
Message.destroy({ where: { content: 'hellp' }, force: true });
Message.destroy({ where: { content: 'New' }, force: true });
Message.destroy({ where: { content: 'My message' }, force: true });
