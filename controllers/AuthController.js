import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { v4 as uuidv4, validate as isUUID } from 'uuid';

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
    const user = await User.create(creationData);
    return {
      status: 'OK',
      id: user.id,
      name: user.name,
      email: user.email,
      picURL: user.picture,
    };
  }

  static async verifyKey(key) {
    if (!isUUID(key)) {
      return null;
    }
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

    // Todo: improve the strength of the key
    await user.update({
      key: uuidv4(),
      lastLogin: new Date(),
      status: UserStatus.ACTIVE,
    });
    return {
      status: 'OK',
      id: user.id,
      key: user.key,
    };
  }

  //send messsage model
  static async sendMessage(socket, { username, message }) {
    try {
      // Find the recipient user by username
      const recipient = await User.findOne({ where: { name: username } });
      if (!recipient) {
        // If recipient not found, emit error message to sender
        socket.emit('sendMessage', { status: 'error', message: 'Recipient not found' });
        return;
      }
  
      // Find or create a conversation between sender and recipient
      let conversation = await Conversation.findOne({
        where: {
          [Op.or]: [
            { user1Id: socket.userId, user2Id: recipient.id },
            { user1Id: recipient.id, user2Id: socket.userId },
          ],
        },
      });
  
      if (!conversation) {
        // If conversation doesn't exist, create a new one
        conversation = await Conversation.create({
          user1Id: socket.userId,
          user2Id: recipient.id,
        });
      }
  
      // Save message to database
      const newMessage = await Message.create({
        conversationId: conversation.id,
        senderId: socket.userId,
        receiverId: recipient.id,
        content: message,
      });
  
      // Emit success response to sender
      socket.emit('sendMessage', { status: 'success', message: 'Message sent successfully' });
  
      // Check recipient's online status and emit message if online
      const recipientSocket = onlineUsers[recipient.id];
      if (recipientSocket) {
        recipientSocket.emit('receiveMessage', {
          fromUserId: socket.userId,
          message,
          sentAt: newMessage.createdAt,
        });
      }
    } catch (error) {
      // Handle errors and emit error message to sender
      console.error('Error sending message:', error.message);
      socket.emit('sendMessage', { status: 'error', message: 'Error sending message' });
    }
  }
  

//list convo method


static async listConversations(socket) {
  try {
    // Fetch recent conversations involving the authenticated user
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [{ user1Id: socket.userId }, { user2Id: socket.userId }],
      },
      order: [['updatedAt', 'DESC']], // Order by updatedAt in descending order
      limit: 10, // Limit to 10 conversations per pagination
      include: [
        { model: User, as: 'user1', attributes: ['id', 'name', 'status'] }, // Include user1 details
        { model: User, as: 'user2', attributes: ['id', 'name', 'status'] }, // Include user2 details
      ],
    });

    // Emit conversations to the client
    socket.emit('listConversations', { status: 'success', conversations });
  } catch (error) {
    // Handle errors and emit error message to the client
    console.error('Error fetching conversations:', error.message);
    socket.emit('listConversations', { status: 'error', message: 'Error fetching conversations' });
  }
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