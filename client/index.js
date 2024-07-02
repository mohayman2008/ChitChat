// import io from 'socket.io-client';
// import readline from 'readline';

// const socket = io('http://localhost:3000');

// socket.on('connect', () => {
//   console.log('Connected to server');
// });


// socket.on('message', (data)=>{
//     console.log(data)
// });

// socket.on('chat', (data)=>{
//     console.log(data)
// });

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.on('line', (input) => {
//   socket.emit('chat', input);
// });


import io from 'socket.io-client';
import readline from 'readline';

const socket = io('http://localhost:3000'); // Replace with your server URL

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let username = '';

rl.question('Enter your username: ', answer => {
    username = answer.trim();
    socket.emit('setUsername', username);
});

// Event listener for new messages
socket.on('newmsg', data => {
    console.log(`${data.username}: ${data.message}`);
});

// Read input from terminal and send messages to server
rl.on('line', input => {
    socket.emit('msg', { message: input.trim() });
});
