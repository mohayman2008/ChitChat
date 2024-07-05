// socket.on('connect', () => {
//   console.log('Connected to server');
// });

/* eslint-disable no-unused-vars */
import io from 'socket.io-client';
import inquirer from 'inquirer';

// Clear the screen and move the curser to the beginning of the page
process.stdout.write('\x1b[2J\x1b[0;0f');

const socket = io('http://localhost:3000');
let sessionKey = ''; // Variable to store session key after login
let username = '';
let isAuthenticated = false;

// Function to handle signup
async function handleSignUp() {
  const answers = await inquirer.prompt([
    { type: 'input', name: 'name', message: 'Enter your username:' },
    { type: 'input', name: 'email', message: 'Enter your email:' },
    { type: 'password', name: 'password', message: 'Enter your password:', mask: 'x' },
  ]);

  socket.timeout(5000).emit('signUp', answers, (err, response) => {
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
      { type: 'input', name: 'email', message: 'Enter your email:' },
      { type: 'password', name: 'password', message: 'Enter your password:', mask: 'x' },
    ]);

    loginSuccessful = await new Promise((resolve, reject) => {
      socket.emit('login', answers, response => {
        if (response.status === 'error') {
          console.error('Login Error:', response.message);
          resolve(false);
        } else {
          console.log(`Login successful: sessionKey is ${response.key}`, );
          isAuthenticated = true; // Set authentication flag to true upon successful login
          username = response.name; // Set username
          sessionKey = response.key; // Store session key
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
function listUsers() {
  const data = { key: sessionKey }; // Use sessionKey for authentication
  socket.emit('getUsers', data, response => {
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
  inquirer
    .prompt([{ type: 'input', name: 'message', message: 'Enter your message:' }])
    .then(answer => {
      const messageContent = answer.message.trim();
      if (messageContent.length === 0) {
        console.log('Message cannot be empty.');
        promptUserAction();
        return;
      }

      socket.emit('sendMessage', { receiverId: userId, content: messageContent, key: sessionKey }, response => {
        if (response.status === 'error') {
          console.error('Message sending error:', response.message);
        } else {
          console.log('Message sent successfully.');
          // Ask if the user wants to send another message or return to main action menu
          inquirer
            .prompt([{ type: 'confirm', name: 'sendAnother', message: 'Do you want to send another message?', default: false }])
            .then(answer => {
              if (answer.sendAnother) {
                sendMessage(userId); // Send another message
              } else {
                promptUserAction(); // Return to main action menu
              }
            });
        }
      });
    });
}



// Function to handle listing conversations
function listConversations() {
  socket.emit('getConversations', { key: sessionKey }, response => {
    if (response.status === 'error') {
      console.error('Error fetching conversations:', response.message);
    } else {
      const conversationChoices = response.conversations.map(conversation => ({
        name: `${conversation.user.name}`,
        value: conversation.id, // Use conversation ID as value
      }));

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'conversationId',
            message: 'Select a conversation:',
            choices: conversationChoices,
          },
        ])
        .then(answer => {
          const conversationId = answer.conversationId;
          // Now fetch and display messages for the selected conversationId
          socket.emit('getMessages', { key: sessionKey, conversationId }, response => {
            if (response.status === 'OK') {
              console.log('Messages in conversation:');
              response.messages.forEach(message => {
                console.log(`${message.sender.name}: ${message.content}`);
              });
              // Prompt user for further actions like sending a message
              promptUserAction();
            } else {
              console.error('Error fetching messages:', response.message);
            }
          });
        });
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
    const { username } = await inquirer.prompt([{ // eslint-disable-line no-case-declarations
      type: 'input',
      name: 'username',
      message: 'Enter username to chat with:'
    }]);
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
