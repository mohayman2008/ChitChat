import { Sequelize, Op, Model, DataTypes } from 'sequelize';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_DATABASE = process.env.DB_DATABASE || 'chitchat_dev';
const DB_USER = process.env.DB_USER || 'chitchat';
const DB_PWD = process.env.DB_PWD || 'chitchat';

const DB_URL = `postgres://${DB_USER}:${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`

class DBStorage {
  constructor () {
    this.db = new Sequelize(DB_URL);
    this.define = this.db.define;
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
}

const dbStorage = new DBStorage();
console.log(Object.keys(dbStorage.db));
async function main() {
  console.log(await dbStorage.checkAlive());
  console.log(Object.keys(dbStorage.db));
}
main();
export default dbStorage;
