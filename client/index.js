// socket.on('connect', () => {
//   console.log('Connected to server');
// });

/* eslint-disable no-unused-vars */
import io from 'socket.io-client';
import inquirer from 'inquirer';

import DataHandlers from './DataHandlers.js';

const REQ_TIMEOUT = 5000;

// resetTextFG = '\x1b[39m';
// process.stdout.write(`\x1b[${line};${col}H`); // Set cursor position

// Clear the screen and move the curser to the beginning of the page
process.stdout.write('\x1b[2J\x1b[0;0f');

const socket = io('http://localhost:3000');
let sessionKey = ''; // Variable to store session key after login
let username = '';
let isAuthenticated = false;

socket.on('new message', (message) => {
  const from = message.sender.name;
  const content = message.content;
  let str = '\n\x1b[36mNew message from ';
  str += `\x1b[33m${from}`;
  str += '\x1b[36m: ';
  str += `\x1b[32m${content}\x1b[39m`;
  console.log(str);
});

// Function to handle signup
async function handleSignUp() {
  const answers = await inquirer.prompt([
    { type: 'input', name: 'name', message: 'Enter your username:' },
    { type: 'input', name: 'email', message: 'Enter your email:' },
    { type: 'password', name: 'password', message: 'Enter your password:', mask: 'x' },
  ]);

  socket.timeout(REQ_TIMEOUT).emit('signUp', answers, (err, response) => {
    if (err) {
      console.error('Signup Error:', err.message || err.toString(), '\n');
      return initialPrompt();
    }
    if (response.status === 'error') {
      console.error('Signup Error:', response.message, '\n');
      return initialPrompt();
    } else {
      console.log('Signup successful:', response);
      username = answers.name; // Set the global username variable
      console.log('Now please login:');
      handleLogin();
    }
  });
}

async function tryLoginAgain() {
  const answers = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'Choose an action:',
    choices: [
      'Try Again',
      'Go Back to Main Menu'
    ]}
  ]);

  if (answers.action === 'Go Back to Main Menu') {
    initialPrompt();
    return false;
  } else if (answers.action === 'Try Again') {
    return true;
  }
}

// Function to handle login
async function handleLogin() {
  let loginSuccessful = false;

  while (!loginSuccessful) {
    const answers = await inquirer.prompt([
      /* To do: remove the defaults */
      { type: 'input', name: 'email', message: 'Enter your email:', /* default: 'user1@example.com' */ },
      { type: 'password', name: 'password', message: 'Enter your password:', mask: 'x', /* default: 'pass1' */ },
    ]);

    loginSuccessful = await new Promise((resolve) => {
      socket.emit('login', answers, response => {
        if (response.status === 'error') {
          console.error('Login Error:', response.message);
          resolve(false);
        } else {
          console.log(`Login successful: sessionKey is ${response.key}`, );
          isAuthenticated = true; // Set authentication flag to true upon successful login
          username = response.name; // Set username
          sessionKey = response.key; // Store session 
          socket.auth = { sessionKey };
          socket.userId = response.id;
          resolve(true);
        }
      });
    });
    if (loginSuccessful) {
      return promptUserAction();
    } else if (!await tryLoginAgain()) {
      return;
    }
  }
}

// Function to list users
async function listUsers() {
  const users = await DataHandlers.getUsers(socket, {});
  if (!users) return false;

  console.log('List of users:');
  users.forEach(user => {
    console.log(`${user.id}: ${user.name}`);
  });
  promptUserAction();
}

async function sendNewMessagePrompt() {
  return (await inquirer.prompt([{
    type: 'confirm',
    name: 'newMessage',
    message: 'Do you want to send another message?',
    default: false
  }])).newMessage;
}

// Function to handle sending messages
async function sendMessage(data) {
  const { message } = await inquirer.prompt([{ type: 'input', name: 'message', message: 'Enter your message:' }]);
  const messageContent = message.trim();

  if (messageContent.length === 0) {
    console.log('Message cannot be empty.');
    const sendNewMessage = await sendNewMessagePrompt();
    if (sendNewMessage) {
      return sendMessage(data); // Send another message
    } else {
      return false; // Return to main action menu
    }
  }

  data.content = messageContent; 

  return new Promise((resolve) => {
    socket.timeout(REQ_TIMEOUT).emit('sendMessage', data, async (err, response) => {
      if (err || response.status === 'error') {
        const errMsg = err ? err.message || err.toString() : response.message;
        console.error(`Message sending error: ${errMsg}\n`);
      } else {
        console.log('Message sent successfully.');
      }

      // Ask if the user wants to send another message or return to main action menu
      const sendNewMessage = await sendNewMessagePrompt();
      if (sendNewMessage) {
        resolve(sendMessage(data)); // Send another message
      } else {
        resolve(false); // Return to main action menu
      }
    });
  });
}

async function listMessages(data) {
  const messages = await DataHandlers.getMessages(socket, data);
  if (!messages) return false;

  console.log('Messages in conversation:');
  messages.forEach(message => {
    const sender = (message.sender && message.sender.name) || username; 
    console.log(`${sender}: ${message.content}`);
  });

  const { sendNewMessage } = await inquirer.prompt([{
    type: 'confirm',
    name: 'sendNewMessage',
    message: 'Do you want to send a message?',
    default: false
  }]);

  if (sendNewMessage) {
    await sendMessage(data);
  } else {
    return promptUserAction();
  }
}

// Function to handle listing conversations
async function listConversations() {
  const conversations = await DataHandlers.getConversations(socket);
  if (!conversations) return false;

  const conversationChoices = conversations.map(conversation => {
    const name = conversation.user1.id === socket.userId ? conversation.user2.name : conversation.user1.name;
    return {
      name: name,
      value: conversation.id, // Use conversation ID as value
    };
  });

  const { conversationId } = await inquirer.prompt([{
    type: 'rawlist',
    name: 'conversationId',
    message: 'Select a conversation:',
    choices: conversationChoices,
  }]);
  // Then fetch and display messages for the selected conversationId
  await listMessages({ conversationId });
  // Prompt user for further actions like sending a message
  promptUserAction();
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
    const { receiverId } = await inquirer.prompt([{ // eslint-disable-line no-case-declarations
      type: 'input',
      name: 'receiverId',
      message: 'Enter the id of the user you want to chat with:'
    }]);
    // Assuming username is the ID of the user to chat with
    sendMessage({ receiverId });
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
