import { verifyKey } from '../controllers/AuthController.js';
import { User, Conversation, Message } from '../models/models.js';

export default class QueryController {
  
  static async getUsers(data) {
    if (!data || !data.key) {
      return { error: 'key-token is missing' };
    }
    const user = await verifyKey(data.key);
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
