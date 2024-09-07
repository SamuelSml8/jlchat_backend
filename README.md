<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# JL Chat API

## Description

The JL Chat API is a backend application designed as part of a technical test for JL Coders. It provides functionalities for user management, secure authentication, and real-time messaging both individually and in groups. The API is built with NestJS and utilizes MongoDB for message storage, ensuring a robust and scalable architecture. Additionally, it incorporates JWT for secure token handling and supports real-time updates through WebSockets.

## Technologies Used

- **NestJS**: Backend framework
- **Fastify**: Web server for handling requests
- **MongoDB**: NoSQL database for message storage
- **JWT**: JSON Web Tokens for secure authentication
- **WebSockets**: For real-time messaging

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

You can clone the repository using either HTTPS or SSH:

#### HTTP option
```bash
$ git clone https://github.com/SamuelSml8/jlchat_backend.git
```
#### SSH option
```bash
$ git clone git@github.com:SamuelSml8/jlchat_backend.git
```

### 2. Install Dependencies

Navigate to the project directory and install the necessary dependencies:

```bash
$ cd jlchat_backend
$ npm install
```

### 3. Configure Environment Variables
Create a .env file in the root directory of the project by copying the contents from .env.example. Update the values with your local or remote database connection details and JWT settings:

```bash
# REQUIRED ENVIRONMENT VARIABLES
# Create a .env file and copy the content of this file into it.

# APPLICATION PORT
PORT=3000 # The port on which the application will run

# EXECUTION ENVIRONMENT (local | remote)
# Set 'local' for local development environment, 'production' for remote/production environment
ENVIRONMENT= # Example: 'local' or 'remote'

# LOCAL (MONGODB COMPASS)
# Local MongoDB connection details (for development)
DB_CONNECTION=mongodb:// # Connection protocol for local MongoDB
DB_HOST_LOCAL=localhost:27017/ # Local MongoDB host
DB_NAME_LOCAL= # Name of the local MongoDB database

# REMOTE (MONGODB ATLAS)
# Remote MongoDB connection details (for production)
DB_HOST_REMOTE=@ # MongoDB remote cluster host for production (Atlas)
DB_NAME_REMOTE= # Name of the remote MongoDB database (production)
DB_USERNAME= # Username for MongoDB remote connection
DB_PASSWORD= # Password for MongoDB remote connection

# Example of full remote connection string:
# mongodb+srv://{DB_USERNAME}:{DB_PASSWORD}{DB_HOST_REMOTE}/{DB_NAME_REMOTE}?retryWrites=true&w=majority

# AUTH JWT
JWT_SECRET= # Secret key for JWT
JWT_EXPIRES_IN=1d # Expiration time for JWT
```

- You can generate JWT_SECRET secure in your CMD
```bash
$ node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Running the app
Run the application using the following command:
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

- The application will start and be accessible at http://localhost:3000.
- The Swagger documentation will start and be accessible at [http://localhost:3000/api-doc](http://localhost:3000/api-doc).

## API Documentation



The API endpoints are organized into three main areas: **Users**, **Authentication**, and **Chat**.

### **Users**

- **`GET /users/getByEmail/:email`**: Retrieves a user by their email address.
- **`GET /users/findByName/:name`**: Fetches a user by their name.
- **`GET /users/getAllUserFriends/:userId`**: Retrieves all friends of a user.
- **`GET /users/:id`**: Fetches user details by ID.
- **`POST /users/add-friend`**: Adds a friend to the user's friend list.
- **`PUT /users/update/:id`**: Updates user information.
- **`PATCH /users/update-role/:id`**: Updates the role of a user.
- **`DELETE /users/delete/:id`**: Deletes a user by ID.

### **Authentication**

- **`POST /auth/register`**: Registers a new user.
- **`POST /auth/login`**: Authenticates a user and generates a JWT token.
- **`POST /auth/logout`**: Logs a user out and invalidates the token.
- **`GET /auth/validate-token`**: Validates the JWT token.

### **Chat**

- **`GET /chats/user-chats`**: Retrieves a list of chats for the authenticated user.
- **`GET /chats/chat-messages/:chatId`**: Fetches all messages within a specific chat.
- **`POST /chats/create-group`**: Creates a new group chat.
- **`POST /chats/add-friend`**: Adds a friend to a specific chat.

### **Links**
- [Postman Collection](./postman/JL_Chat_API.postman_collection.json)
- [Swagger Documentation](http://localhost:3000/api-doc)

## Stay in touch

- Author - [Samuel Vera Miranda](www.linkedin.com/in/samuelsml)

## License

Nest is [MIT licensed](LICENSE).
