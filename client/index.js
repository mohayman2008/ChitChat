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

const socket = io('http://localhost:3000');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let username = '';
let isAuthenticated = false;


//functions


// Function to handle signup
function handleSignUp() {
  if (isAuthenticated) {
    console.log('You are already signed in.');
    return;
  }
  rl.question('Enter your email: ', email => {
    rl.question('Enter your password: ', password => {
      socket.emit('signUp', { name: username, email, password }, response => {
        if (response.status === 'error') {
          console.error('Signup Error:', response.message);
        } else {
          console.log('Signup successful:', response);
          isAuthenticated = true; // Set authentication flag to true upon successful signup
        }
      });
    });
  });
}


// Function to handle authentication
function handleAuthenticate() {
  if (isAuthenticated) {
    console.log('You are already signed in.');
    return;
  }
  rl.question('Enter your email: ', email => {
    rl.question('Enter your password: ', password => {
      socket.emit('authenticate', { email, password }, response => {
        if (response.status === 'error') {
          console.error('Authentication Error:', response.message);
        } else {
          console.log('Authentication successful:', response);
          isAuthenticated = true; // Set authentication flag to true upon successful authentication
        }
      });
    });
  });
}


// end of functions

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
  const command = input.trim();
  if (command === '/signup') {
    handleSignUp();
  } else if (command === '/login') {
    handleAuthenticate();
  } else {
    socket.emit('msg', { message: command });
  }
});
