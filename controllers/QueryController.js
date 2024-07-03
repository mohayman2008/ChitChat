import { verifyKey } from '../controllers/AuthController';
import { User, UserStatus, Conversation, Message } from '../models/models'

export default class QueryController {
  
  static async getUsers(data) {
    if (!data[key]) {
      return { error: 'key-token is missing' };
    }
    const user = await verifyKey(data[key]);
    if (!user) {
      return { error: 'Authentication failed' };
    }

    return {
      status: 'OK',
      users: User.findAll(
        {
          attributes: ['id', 'name', 'picture', 'status'],
        })
    };
  }
}
