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

// Function to handle signup
function handleSignUp() {
  rl.question('Enter your username: ', name => {
    rl.question('Enter your email: ', email => {
      rl.question('Enter your password: ', password => {
        socket.emit('signUp', { name, email, password }, response => {
          if (response.status === 'error') {
            console.error('Signup Error:', response.message);
          } else {
            console.log('Signup successful:', response);
            isAuthenticated = true; // Set authentication flag to true upon successful signup
            username = name; // Set the global username variable
            promptUserAction();
          }
        });
      });
    });
  });
}


// Function to handle login
function handleLogin() {
  rl.question('Enter your email: ', email => {
    rl.question('Enter your password: ', password => {
      socket.emit('login', { email, password }, response => {
        if (response.status === 'error') {
          console.error('Login Error:', response.message);
        } else {
          console.log('Login successful:', response);
          isAuthenticated = true; // Set authentication flag to true upon successful login
          username = response.name; // Set username
          promptUserAction();
        }
      });
    });
  });
}

// Function to list users
function listUsers() {
  socket.emit('getUsers', {}, response => {
    if (response.status === 'error') {
      console.error('Error fetching users:', response.message);
    } else {
      console.log('List of users:');
      response.users.forEach(user => {
        console.log(`${user.id}: ${user.name}`);
      });
      promptUserAction();
    }
  });
}

// Function to handle sending messages
function sendMessage(userId) {
  rl.question('Enter your message: ', message => {
    socket.emit('sendMessage', { to: userId, message }, response => {
      if (response.status === 'error') {
        console.error('Message sending error:', response.message);
      } else {
        console.log('Message sent successfully.');
        promptUserAction();
      }
    });
  });
}

// Function to handle listing conversations
function listConversations() {
  socket.emit('getConversations', {}, response => {
    if (response.status === 'error') {
      console.error('Error fetching conversations:', response.message);
    } else {
      console.log('Previous conversations:');
      response.conversations.forEach((conversation, index) => {
        console.log(`${index + 1}. ${conversation.user.name}`);
      });
      promptUserAction();
    }
  });
}

// Function to prompt user action
function promptUserAction() {
  rl.question('Choose an action:\n1. List Users\n2. List Conversations\n3. Start Chatting\n4. Exit\n', answer => {
    switch (answer.trim()) {
      case '1':
        listUsers();
        break;
      case '2':
        listConversations();
        break;
      case '3':
        rl.question('Enter username to chat with: ', username => {
          // Assuming username is the ID of the user to chat with
          sendMessage(username);
        });
        break;
      case '4':
        console.log('Exiting...');
        rl.close();
        process.exit(0);
        break;
      default:
        console.log('Invalid option.');
        promptUserAction();
    }
  });
}

// Initial prompt to choose between register and login
rl.question('Welcome! Choose an option:\n1. Register\n2. Login\n', answer => {
  switch (answer.trim()) {
    case '1':
      handleSignUp();
      break;
    case '2':
      handleLogin();
      break;
    default:
      console.log('Invalid option.');
      rl.close();
      process.exit(0);
  }
});

// Initial prompt to choose between register and login
promptUserAction();