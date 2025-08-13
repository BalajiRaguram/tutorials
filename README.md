# WebSocket Chat Application

A real-time chat application built with WebSocket technology using Node.js and vanilla JavaScript.

## Features

- **Real-time messaging**: Instant message delivery using WebSocket
- **User identification**: Each message shows the sender's username
- **Connection status**: Visual indicator of connection state
- **Auto-reconnection**: Automatically reconnects if connection is lost
- **Responsive design**: Works on both desktop and mobile devices
- **System messages**: Notifications for user join/leave events

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Usage

1. **Start the WebSocket server**:
   ```bash
   npm start
   ```
   or for development with auto-restart:
   ```bash
   npm run dev
   ```

2. **Open the chat client**:
   - Open `index.html` in your web browser
   - Or serve it using a local server (recommended)

3. **Test the chat**:
   - Open multiple browser windows/tabs with the chat
   - Enter different usernames for each window
   - Start chatting!

## Project Structure

```
websocket-chat/
├── server.js          # WebSocket server implementation
├── index.html         # Chat client interface
├── package.json       # Project dependencies and scripts
├── README.md          # This file
└── websocket-chat-example.md  # Detailed explanation guide
```

## How It Works

### WebSocket Protocol
- **Full-duplex communication**: Both client and server can send messages simultaneously
- **Persistent connection**: Connection stays open until explicitly closed
- **Low latency**: Messages are delivered instantly
- **Efficient**: No need for constant HTTP requests

### Server (server.js)
- Creates a WebSocket server on port 3000
- Manages connected clients using a Set
- Broadcasts messages to all connected clients
- Handles connection/disconnection events
- Sends system messages for user events

### Client (index.html)
- Establishes WebSocket connection to server
- Prompts user for username on connection
- Displays messages in real-time
- Handles connection status and auto-reconnection
- Provides a clean, responsive UI

## Message Format

Messages are sent as JSON objects:

```javascript
// Chat message
{
  "type": "chat",
  "user": "username",
  "message": "Hello world!",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// System message
{
  "type": "system",
  "message": "Welcome to the chat!",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Customization

### Changing the Port
Edit the `PORT` variable in `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

### Styling
Modify the CSS in `index.html` to customize the appearance.

### Adding Features
- **Private messages**: Modify server to handle targeted messages
- **File sharing**: Add file upload/download functionality
- **Typing indicators**: Send typing status to other users
- **Message persistence**: Store messages in a database

## Troubleshooting

### Connection Issues
- Ensure the server is running on port 3000
- Check if the port is not blocked by firewall
- Verify the WebSocket URL in the client code

### Browser Compatibility
- Modern browsers support WebSocket natively
- For older browsers, consider using a WebSocket polyfill

## Security Considerations

For production use, consider implementing:
- **HTTPS/WSS**: Secure WebSocket connections
- **Authentication**: User login system
- **Input validation**: Sanitize all user inputs
- **Rate limiting**: Prevent spam messages
- **Message encryption**: End-to-end encryption

## License

MIT License - feel free to use this code for your own projects!
