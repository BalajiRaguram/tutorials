# WebSocket Chat Application

A real-time chat application built with WebSocket, Node.js, and vanilla JavaScript. Features a modern, responsive UI with automatic reconnection and message queuing.

## Features

- **Real-time messaging** - Messages are instantly delivered to all connected users
- **Beautiful modern UI** - Responsive design with smooth animations and gradient styling
- **Connection status indicator** - Visual feedback showing connection state
- **Automatic reconnection** - Automatically reconnects when connection is lost
- **Message queuing** - Messages are queued when offline and sent when reconnected
- **Username support** - Each user can set their own display name
- **System messages** - Notifications when users join or leave the chat
- **Timestamps** - Each message shows when it was sent
- **Mobile responsive** - Works perfectly on all device sizes

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd websocket-chat
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3000 by default. Open your browser and navigate to:
```
http://localhost:3000
```

## How to Use

1. Open the application in your browser
2. Enter your name in the username field
3. Type a message and press Enter or click the send button
4. Your messages will appear on the right side in purple
5. Other users' messages will appear on the left in white
6. System messages (join/leave notifications) appear in the center

## Project Structure

```
websocket-chat/
├── server.js           # WebSocket server implementation
├── package.json        # Node.js dependencies and scripts
├── public/            # Client-side files
│   ├── index.html     # Chat interface HTML
│   ├── styles.css     # Styling and animations
│   └── app.js         # Client-side WebSocket logic
└── README.md          # This file
```

## How It Works

### Server Side (server.js)

1. **Express Server**: Serves static files from the `public` directory
2. **WebSocket Server**: Handles real-time connections using the `ws` library
3. **Connection Management**: Tracks all connected clients in a Set
4. **Message Broadcasting**: Forwards messages to all connected clients
5. **System Messages**: Notifies users when someone joins or leaves

### Client Side (app.js)

1. **WebSocket Connection**: Establishes connection to the server
2. **Auto-reconnection**: Attempts to reconnect every 3 seconds if disconnected
3. **Message Queue**: Stores messages when offline and sends them when reconnected
4. **UI Updates**: Dynamically adds messages to the chat interface
5. **Connection Status**: Visual indicator showing connection state

## WebSocket Message Format

Messages are sent as JSON with the following structure:

```javascript
{
  "type": "message" | "system",
  "username": "User Name",
  "message": "Message content",
  "timestamp": "2023-11-20T10:30:00.000Z"
}
```

## Customization

### Change Port
Set the `PORT` environment variable:
```bash
PORT=8080 npm start
```

### Styling
Modify `public/styles.css` to customize:
- Colors: Change the gradient colors in CSS variables
- Fonts: Update the font-family in the body selector
- Animations: Adjust animation timings and effects

### Features
You can extend the application by:
- Adding user avatars
- Implementing chat rooms
- Adding file sharing
- Including emoji support
- Adding typing indicators
- Implementing user authentication

## Troubleshooting

### Connection Issues
- Ensure the server is running
- Check that port 3000 is not blocked by firewall
- Verify WebSocket support in your browser

### Message Not Sending
- Make sure you've entered a username
- Check the connection status indicator
- Look for errors in browser console

## Browser Support

This application works in all modern browsers that support WebSocket:
- Chrome 16+
- Firefox 11+
- Safari 7+
- Edge 12+
- Mobile browsers (iOS Safari, Chrome for Android)

## License

MIT License - Feel free to use this project for learning or as a starting point for your own applications.