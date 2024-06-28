import User from '../models/user.js';

class UserService {
  async createUser(userName, email, password,ip, port, key, authTime) {
    try {
      const user = await User.create({
        userName: userName,
        email: email,
        password: password,
        ip: ip,
        port: port,
        key: key,
        authTime: authTime,
        status: 'not_active', // Default status
        ipVersion: 4, // Default IP version
        createdAt: new Date(), // Current timestamp
      });
      console.log('User created:', user.toJSON());
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await User.findAll();
      return users;
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      console.error(`Error retrieving user with id ${id}:`, error);
      throw error;
    }
  }

  async updateUserById(id, newData) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }
      await user.update(newData);
      console.log('User updated:', user.toJSON());
      return user;
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw error;
    }
  }

  async deleteUserById(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }
      await user.destroy();
      console.log('User deleted successfully');
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  }
}

export default new UserService();
