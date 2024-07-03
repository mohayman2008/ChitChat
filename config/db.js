import { Sequelize } from 'sequelize';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_DATABASE = process.env.DB_DATABASE || 'chitchat_dev';
const DB_USER = process.env.DB_USER || 'chitchat';
const DB_PWD = process.env.DB_PWD || 'chitchat';

const DB_URL = `postgres://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

class DBStorage {
  constructor () {
    this.db = new Sequelize(DB_URL, { logging: false });
  }
  
  async checkAlive() {
    try {
      await this.db.authenticate();
      return true;
    } catch (err) {
      console.error(err.message || err.toString());
      return false;
    }
  }

  loggingEnable(enable=true, cb=console.log) {
    if (!enable) this.db.options.logging = false;
    else this.db.options.logging = cb;
  }

  async sync(alter=false) {
    return this.db.sync({ alter });
  }
}

const dbStorage = new DBStorage();
dbStorage.checkAlive();
export default dbStorage;
