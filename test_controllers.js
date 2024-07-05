/* eslint-disable no-unused-vars */
import dbStorage from './config/db.js';
import AuthController from './controllers/AuthController.js';
import QueryController from './controllers/QueryController.js';

// dbStorage.loggingEnable(true);
const object = {
  key: '78849577-dee8-4bf8-8d14-c6b663213303', // user1 key
  // key: 'ede26cd5-a63f-47f3-9468-f7df17ce8738', // user2 key
  conversationId: '8c13f164-dd7a-4e4f-9903-92cefe1b7400',
};
console.log('getUsers:');
await QueryController.getUsers(object, console.log);
console.log('getConversations:');
await QueryController.getConversations(object, console.log);
console.log('getMessages:');
await QueryController.getMessages(object, console.log);

const loginData = {
  email: 'hell',
  password: 'no',
};
console.log('authenticate:');
await AuthController.authenticate(loginData, console.log);
