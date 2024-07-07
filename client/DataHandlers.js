import ResponseHandlers from './ResponseHandlers.js';

const REQ_TIMEOUT = 5000;

export default class DataHandlers{ 

  static async getData(socket, eventName, data, responseHandler) {
    return new Promise((resolve) => {
      this.resolve = resolve;
      socket.timeout(REQ_TIMEOUT).emit(
        eventName,
        data,
        responseHandler.bind(this),
      );
    });
  }

  static async getUsers(socket, data={}) {
    return DataHandlers.getData(socket, 'getUsers', data, ResponseHandlers.getUsers);
  }

  static async getConversations(socket, data={}) {
    return DataHandlers.getData(socket, 'getConversations', data, ResponseHandlers.getConversations);
  }

  static async getMessages(socket, data) {
    return DataHandlers.getData(socket, 'getMessages', data, ResponseHandlers.getMessages);
  }
}
