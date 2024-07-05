import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { v4 as uuidv4, validate as isUUID } from 'uuid';

import { User, UserStatus, Session } from '../models/models.js';
// import { sockets } from '../server/server.js';

export default class AuthController {

  static async signUp(data, cb) {
    for (const key of ['name', 'email', 'password']) {
      if (!data[key]) {
        return cb({ error: `Field ${key} is mandatory` });
      }
    }
    const { name, email, password, picURL } = data;
    /* To do:
      - validate name
      - validate email
      - validate password
      - store the photo
    */
    const creationData = {
      name,
      email,
      password: hashSync(password, genSaltSync(10)),
      picture: picURL,
    };
    const user = await User.create(creationData);
    return cb({
      status: 'OK',
      id: user.id,
      name: user.name,
      email: user.email,
      picURL: user.picture,
    });
  }

  static async verifyKey(key) {
    if (!isUUID(key)) return null;

    const session = await Session.findByPk(key, { include: ['user'] });

    if (!session) return null;

    session.user.update({ lastLogin: new Date()}); // Don't add await so as not to affect the performance
    return session.user;
  }

  static async authenticate(data, cb) {
    
    for (const key of ['email', 'password']) {
      // missing value error handling
      if (!data[key]) {
        return cb({ status: 'error', message: `${key} is mandatory` });
      }
    }
    const { email, password } = data;

    //error handling for email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return cb({ status: 'error', message: 'Email not found' });
    }

    // error handling for password
    if (!compareSync(password, user.password)) {
      return cb({ status: 'error', message: 'Invalid password' });
    }

    // Todo: improve the strength of the key
    const session = await user.getSession() || await user.createSession();
    user.update({
      lastLogin: new Date(),
      status: UserStatus.ACTIVE,
    });
    return cb({
      status: 'OK',
      id: user.id,
      key: session.key,
      user,
    });
  }

  static async signOut() {}
}

/* 
const SECRET_KEY = 'your_secret_key'; // Use a secure secret key in production
const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
*/