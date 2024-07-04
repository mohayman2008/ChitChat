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
import inquirer from 'inquirer';

const socket = io('http://localhost:3000');

let username = '';
let isAuthenticated = false;

// Function to handle signup
async function handleSignUp() {
  const answers = await inquirer.prompt([
    { type: 'input', name: 'name', message: 'Enter your username:' },
    { type: 'input', name: 'email', message: 'Enter your email:' },
    { type: 'password', name: 'password', message: 'Enter your password:' }
  ]);

  socket.emit('signUp', answers, response => {
    if (response.status === 'error') {
      console.error('Signup Error:', response.message);
    } else {
      console.log('Signup successful:', response);
      username = answers.name; // Set the global username variable
      console.log('Now please login:');
      handleLogin();
    }
  });
}

// Function to handle login
// Function to handle login
async function handleLogin() {
  let loginSuccessful = false;

  while (!loginSuccessful) {
    const answers = await inquirer.prompt([
      { type: 'input', name: 'email', message: 'Enter your email:' },
      { type: 'password', name: 'password', message: 'Enter your password:' },
      { type: 'list', name: 'action', message: 'Choose an action:', choices: ['Try Again', 'Go Back to Main Menu'] }
    ]);

    if (answers.action === 'Go Back to Main Menu') {
      initialPrompt();
      return;
    }

    socket.emit('login', answers, response => {
      if (response.status === 'error') {
        console.error('Login Error:', response.message);
      } else {
        console.log('Login successful:', response);
        isAuthenticated = true; // Set authentication flag to true upon successful login
        username = response.name; // Set username
        loginSuccessful = true; // Exit the loop
        promptUserAction();
      }
    });

    // Await a short delay to ensure the server response is handled before looping again
    await new Promise(resolve => setTimeout(resolve, 500));
  }
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
async function sendMessage(userId) {
  const { message } = await inquirer.prompt([{ type: 'input', name: 'message', message: 'Enter your message:' }]);
  
  socket.emit('sendMessage', { to: userId, message }, response => {
    if (response.status === 'error') {
      console.error('Message sending error:', response.message);
    } else {
      console.log('Message sent successfully.');
      promptUserAction();
    }
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
async function promptUserAction() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Choose an action:',
      choices: [
        { name: 'List Users', value: '1' },
        { name: 'List Conversations', value: '2' },
        { name: 'Start Chatting', value: '3' },
        { name: 'Exit', value: '4' }
      ]
    }
  ]);

  switch (action) {
    case '1':
      listUsers();
      break;
    case '2':
      listConversations();
      break;
    case '3':
      const { username } = await inquirer.prompt([{ type: 'input', name: 'username', message: 'Enter username to chat with:' }]);
      // Assuming username is the ID of the user to chat with
      sendMessage(username);
      break;
    case '4':
      console.log('Exiting...');
      process.exit(0);
      break;
    default:
      console.log('Invalid option.');
      promptUserAction();
  }
}

// Initial prompt to choose between register and login
async function initialPrompt() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Welcome! Choose an option:',
      choices: [
        { name: 'Register', value: '1' },
        { name: 'Login', value: '2' }
      ]
    }
  ]);

  switch (action) {
    case '1':
      handleSignUp();
      break;
    case '2':
      handleLogin();
      break;
    default:
      console.log('Invalid option.');
      process.exit(0);
  }
}

// Start the initial prompt
initialPrompt();
