import {dbStorage} from './db.js';

dbStorage.db.sync({ force: true }) // Use { force: true } cautiously; it drops and recreates tables
    .then(async () => {
        console.log('Database synchronized');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
