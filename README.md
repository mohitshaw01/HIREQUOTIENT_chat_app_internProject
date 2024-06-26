# HIREQUOTIENT_chat_app_internProject

## Description
This project is a chat application developed as part of the HIREQUOTIENT intern project. It allows users to communicate with each other in real-time.

## Features
- User authentication: Users can create an account and log in to the chat application.
- Real-time messaging: Users can send and receive messages in real-time.
- User profiles: Users can view and update their profile information.
- Group chats: Users can create and join group chats to communicate with multiple users at once.
- Notifications: Users receive notifications for new messages and chat invitations.

## Documentation

### Setup and Run Instructions
To set up and run the chat application, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/HIREQUOTIENT_chat_app_internProject.git`
2. Navigate to the project directory: `cd HIREQUOTIENT_chat_app_internProject`
3. Install the dependencies: `npm install`
4. Set up the necessary environment configurations (see next section).
5. Start the server: `npm start`
6. Open the chat application in your web browser: `http://localhost:3000`

### API Route Descriptions
The chat application provides the following API routes:

- `/api/auth/register` (POST): Register a new user account.
    - Expected inputs: JSON object with `username` and `password` fields.
    - Output: JSON object with `success` field indicating whether the registration was successful.

- `/api/auth/login` (POST): Log in to the chat application.
    - Expected inputs: JSON object with `username` and `password` fields.
    - Output: JSON object with `success` field indicating whether the login was successful.

- `/api/messages/send` (POST): Send a message to another user or a group chat.
    - Expected inputs: JSON object with `sender`, `recipient`, and `message` fields.
    - Output: JSON object with `success` field indicating whether the message was sent successfully.

- `/api/messages/receive` (GET): Retrieve the messages for the logged-in user.
    - Output: JSON array of message objects.

### Necessary Environment Configurations
The chat application requires the following environment configurations:

- `PORT`: The port number of the database server.
- `JWT_SECRET`: The secret key used for JWT authentication.
- `MONGODB_URI`
-`JWT_SECRET`
-`GooGLE_API_KEY`
Make sure to set these configurations before starting the server.

For more information, refer to the [LICENSE](LICENSE) file.