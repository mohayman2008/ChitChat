import { compare as compareHash } from 'bcrypt';

import { User, UserStatus } from '../models/models.js';

export default class AuthController {

  static async signUp(data, cb) {
    for (const key of ['name', 'email', 'password']) {
      if (!data[key]) {
        return cb({ status: 'error', message: `Field ${key} is mandatory` });
      }
    }
    const { name, email, password, picURL } = data;
    /* To do:
      - validate the password strength
      - store the photo
    */
    if (await User.findOne({ where: { name } })) {
      return cb({ status: 'error', message: 'username already exists' });
    }
    if (await User.findOne({ where: { email } })) {
      return cb({ status: 'error', message: 'email already exists' });
    }

    const creationData = {
      name,
      email,
      password,
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

  static checkSession(socket) {
    socket.user && socket.user.update({ lastLogin: new Date()});
    if (socket.key) { return socket.user; }
    else {
      socket.emit('unauthorized', { message: 'Unauthorized access' });
      return null;
    }
  }

  static async authenticate(socket, data, cb) {
    let user = AuthController.checkSession(socket);
    if (user) {
      return cb({ status: 'error', message: 'Already authenticated, sign out first' });
    }
    socket.authorized = false;
    socket.key = null;
    socket.user = null;
    
    for (const key of ['email', 'password']) {
      // missing value error handling
      if (!data[key]) {
        return cb({ status: 'error', message: `${key} is mandatory` });
      }
    }
    const { email, password } = data;

    //error handling for email
    user = await User.findOne({ where: { email } });
    if (!user) {
      return cb({ status: 'error', message: 'Email not found' });
    }

    // error handling for password
    if (!await compareHash(password, user.password)) {
      return cb({ status: 'error', message: 'Invalid password' });
    }

    // Todo: improve the strength of the key
    const session = await user.getSession() || await user.createSession();

    socket.authorized = true;
    socket.session = session;
    socket.key = session.key;
    socket.user = user;

    user.update({
      lastLogin: new Date(),
      status: UserStatus.ACTIVE,
    });
    return cb({
      status: 'OK',
      id: user.id,
      name: user.name,
      email: user.email,
      last_login: user.lastLogin,
      key: session.key,
    });
  }

  static async signOut() {}
}

/* 
const SECRET_KEY = 'your_secret_key'; // Use a secure secret key in production
const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
*/
