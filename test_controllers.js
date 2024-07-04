/* eslint-disable no-unused-vars */
import dbStorage from './config/db.js';
import QueryController from './controllers/QueryController.js';

// dbStorage.loggingEnable(true);
const object = {
  key: 'd81e66cc-52dc-43d1-9b59-30073798d9e9', // user1 key
  // key: '07f7ae3b-29de-453a-a061-c4d872ceac69', // user2 key
  conversationId: '8c13f164-dd7a-4e4f-9903-92cefe1b7400',
};
console.log('getUsers:');
await QueryController.getUsers(object, console.log);
console.log('getConversations:');
await QueryController.getConversations(object, console.log);
console.log('getMessages:');
await QueryController.getMessages(object, console.log);
