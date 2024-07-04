# ChitChat Application

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
   - [Register](#register)
   - [Login](#login)
   - [List Users](#list-users)
   - [List Conversations](#list-conversations)
   - [Start Chatting](#start-chatting)
5. [Technologies Used](#technologies-used)
6. [Project Structure](#project-structure)
7. [Contributing](#contributing)
8. [License](#license)

## Introduction

ChitChat is a terminal-based chat application that allows users to communicate with each other in real-time. It is built using [Node.js](https://nodejs.org/), [Sequelize ORM](https://sequelize.org/), and [Socket.IO](https://socket.io/). Users can register, log in, view other users, see their conversation history, and send messages.

## Features

- User registration and authentication
- Real-time messaging
- List of registered users
- View conversation history
- Command-line interface using [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)

## Installation

To run ChitChat locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohayman2008/ChitChat.git
   cd ChitChat

2. **Install dependencies:**
    ```bash
    npm install
3. **Set up the database:**
    ```
    bash
    *go to config/db.js and modify the following*
    DB_HOST=localhost
    DB_PORT=5432
    DB_DATABASE= **your_database**
    DB_USER= **your_username**
    DB_PWD= **your_password**
    ```

4.  **Start the serve:**
    ```bash
    node server/server.js

5. **Start the client**
    ```bash
    node client/index.js

## Usage

## Register
*To register a new user, follow the prompts after starting the client:*
```
  ? Welcome! Choose an option: Register
  ? Enter your username: <your_username>
  ? Enter your email: <your_email>
  ? Enter your password: <your_password>
```

## Login
**To log in, follow the prompts:**
```
? Welcome! Choose an option: Login
? Enter your email: <your_email>
? Enter your password: <your_password>
```
**If the login fails, you can try again or go back to the main menu.**

## List Users
*After logging in, you can list all registered users:*

? Choose an action: List Users

## List Conversations
*View your conversation history with other users:*

? Choose an action: List Conversations

## Start Chatting
*Initiate a chat with another user:*
```
? Choose an action: Start Chatting
? Enter username to chat with: <username>
? Enter your message: <your_message>
```

## Technologies Used
```
Node.js: Server-side JavaScript runtime
Sequelize: ORM for PostgreSQL
Socket.IO: Real-time bidirectional event-based communication
Inquirer.js: Command-line interface for user prompts
PostgreSQL: Relational database
```

## Project Structure
```
ChitChat/
├── client/
│   └── index.js
├── config/
│   └── db.js
├── server/
|    └── server.js
├──controllers/
│   │   ├── AuthController.js
│   │   └── QueryController.js
│   ├── models/
│   │   ├── conversation.js
│   │   ├── message.js
|   |   ├── modelsHelperMethods.js
|   |   ├── models.js
│   │   └── user.js
├── .env
├── package.json
└── README.md
```

## Contributing
*Contributions are welcome! Please fork the repository and create a pull request with your changes*

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
