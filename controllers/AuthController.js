import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { User, UserStatus, Conversation, Message } from '../models/models',

export default class AuthController {
  
  static async signUp(data) {
    for (const key of ['name', 'email', 'password']) {
      if (!data[key]) {
        return { error: `Field ${key} is mandatory` };
      }
    }
    const { name, email, password, picURL } = data;
    /* To do:
      - validate name
      - validate email
      - validate password
      - store the photo
    */
    data.password = hashSync(password, genSaltSync(10));
    const user = await User.create(data).toJSON({});
    return {
      status: 'OK',
      id: user.id,
      name: user.name,
      email: user.email,
      picURL: user.pic,
    }
  }

  static async verifyKey(key) {
    return User.findOne({
      where: { key: key },
    });
  }

  static async authenticate(data) {
    for (const key of ['email', 'password']) {
      if (!data[key]) {
        return { error: `${key} is mandatory` };
      }
    }
    const { email, password } = data;

    const user = await User.findOne({ where: { email: email } });
    if (!user || !compareSync(password, user.password))
      return { error: `The entered email and password combination is invalid` };

    user.key = uuidv4();
    user.lastLogin = new Date();
    user.status = UserStatus.ACTIVE;
    await user.save();
    return {
      status: 'OK',
      id: user.id,
      key: user.key,
    };
  }
}
