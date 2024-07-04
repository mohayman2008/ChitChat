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

// Tests
const testData = {
  key: 'd81e66cc-52dc-43d1-9b59-30073798d9e9', // user1 key
  // key: '07f7ae3b-29de-453a-a061-c4d872ceac69', // user2 key
  conversationId: '8c13f164-dd7a-4e4f-9903-92cefe1b7400',
};

function testHandler(err, data) {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Data:\n', data);
  }
}

socket.timeout(10000).emit('getUsers', testData, testHandler);
socket.timeout(10000).emit('getConversations', testData, testHandler);
socket.timeout(10000).emit('getMessages', testData, testHandler);
// End of tests

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
