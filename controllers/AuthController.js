import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { User, UserStatus } from '../models/models.js';

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
    const creationData = {
      name,
      email,
      password: hashSync(password, genSaltSync(10)),
      picture: picURL,
    };
    const user = await User.create(creationData).toJSON({});
    return {
      status: 'OK',
      id: user.id,
      name: user.name,
      email: user.email,
      picURL: user.picture,
    };
  }

  static async verifyKey(key) {
    return User.findOne({
      where: { key: key },
    });
  }

  static async authenticate(data) {
    for (const key of ['email', 'password']) {
      if (!data[key]) {
        //error handling for key
        return { status: 'error', message: `${key} is mandatory` };
      }
    }
    const { email, password } = data;

    //error handling for email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { status: 'error', message: 'Email not found' };
    }

    // error handling for password
    if (!compareSync(password, user.password)) {
      return { status: 'error', message: 'Invalid password' };
    }
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


/**
 * 
const SECRET_KEY = 'your_secret_key'; // Use a secure secret key in production

async function authenticateUser(email, password) {
  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('Invalid email or password');
      return null;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid email or password');
      return null;
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

    console.log('Login successful');
    console.log('Your token:', token);
    return token;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Example usage
(async () => {
  await sequelize.sync(); // Ensure database is synced
  
  // Replace with actual input from user
  const email = 'user@1.com';
  const password = '12345';

  const token = await authenticateUser(email, password);
  if (token) {
    // Use the token as needed here
  }
})();
     */