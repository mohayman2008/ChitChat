
export default class ResponseHandlers{ 

  static async getData(err, response, dataName='data') {
    if (err || response.status === 'error') {
      const errMsg = err ? err.message || err.toString() : response.message;
      console.error(`Error fetching ${dataName}: ${errMsg}\n`);
      this.resolve(false);
    } else if (response.status !== 'OK') {
      this.resolve(false);
    } else {
      this.resolve(response.results);
    }
  }

  static async getUsers(err, response) {
    ResponseHandlers.getData.call(this, err, response, 'users');
  }

  static async getConversations(err, response) {
    ResponseHandlers.getData.call(this, err, response, 'conversations');
  }

  static async getMessages(err, response) {
    ResponseHandlers.getData.call(this, err, response, 'messages');
  }
}