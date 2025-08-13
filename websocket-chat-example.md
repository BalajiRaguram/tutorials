# Creating a Chat Window Using WebSocket

WebSocket is a communication protocol that provides full-duplex communication channels over a single TCP connection. It's perfect for real-time chat applications because it allows bidirectional communication between client and server.

## How WebSocket Works

1. **Connection**: Client establishes a WebSocket connection to the server
2. **Handshake**: HTTP upgrade request to switch from HTTP to WebSocket protocol
3. **Real-time Communication**: Both client and server can send messages at any time
4. **Persistent Connection**: Connection stays open until explicitly closed

## Server-Side Implementation (Node.js with ws library)

```javascript
const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.add(ws);

    // Send welcome message
    ws.send(JSON.stringify({
        type: 'system',
        message: 'Welcome to the chat!',
        timestamp: new Date().toISOString()
    }));

    // Handle incoming messages
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            
            // Broadcast message to all connected clients
            const broadcastMessage = {
                type: 'chat',
                user: message.user,
                message: message.message,
                timestamp: new Date().toISOString()
            };

            clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(broadcastMessage));
                }
            });
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
        
        // Notify other clients
        const disconnectMessage = {
            type: 'system',
            message: 'A user has left the chat',
            timestamp: new Date().toISOString()
        };

        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(disconnectMessage));
            }
        });
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});
```

## Client-Side Implementation (HTML/JavaScript)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket Chat</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }

        .chat-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .chat-header {
            background: #007bff;
            color: white;
            padding: 15px;
            text-align: center;
        }

        .chat-messages {
            height: 400px;
            overflow-y: auto;
            padding: 15px;
            background: #f8f9fa;
        }

        .message {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 8px;
            max-width: 80%;
        }

        .message.own {
            background: #007bff;
            color: white;
            margin-left: auto;
        }

        .message.other {
            background: white;
            border: 1px solid #ddd;
        }

        .message.system {
            background: #ffc107;
            color: #212529;
            text-align: center;
            font-style: italic;
        }

        .message-header {
            font-size: 12px;
            margin-bottom: 5px;
            opacity: 0.7;
        }

        .chat-input {
            display: flex;
            padding: 15px;
            background: white;
            border-top: 1px solid #ddd;
        }

        .chat-input input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-right: 10px;
        }

        .chat-input button {
            padding: 10px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .chat-input button:hover {
            background: #0056b3;
        }

        .connection-status {
            text-align: center;
            padding: 5px;
            font-size: 12px;
        }

        .connected {
            background: #d4edda;
            color: #155724;
        }

        .disconnected {
            background: #f8d7da;
            color: #721c24;
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="chat-header">
            <h2>WebSocket Chat</h2>
        </div>
        
        <div id="connectionStatus" class="connection-status disconnected">
            Disconnected
        </div>
        
        <div id="chatMessages" class="chat-messages"></div>
        
        <div class="chat-input">
            <input type="text" id="messageInput" placeholder="Type your message..." disabled>
            <button id="sendButton" disabled>Send</button>
        </div>
    </div>

    <script>
        class ChatClient {
            constructor() {
                this.ws = null;
                this.username = null;
                this.isConnected = false;
                
                this.messageInput = document.getElementById('messageInput');
                this.sendButton = document.getElementById('sendButton');
                this.chatMessages = document.getElementById('chatMessages');
                this.connectionStatus = document.getElementById('connectionStatus');
                
                this.initializeEventListeners();
                this.connect();
            }

            initializeEventListeners() {
                // Send message on Enter key
                this.messageInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && this.isConnected) {
                        this.sendMessage();
                    }
                });

                // Send message on button click
                this.sendButton.addEventListener('click', () => {
                    if (this.isConnected) {
                        this.sendMessage();
                    }
                });
            }

            connect() {
                // Get username from user
                this.username = prompt('Enter your username:') || 'Anonymous';
                
                // Connect to WebSocket server
                this.ws = new WebSocket('ws://localhost:3000');
                
                this.ws.onopen = () => {
                    this.isConnected = true;
                    this.updateConnectionStatus(true);
                    this.enableInput();
                    this.addSystemMessage('Connected to chat server');
                };

                this.ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    this.displayMessage(data);
                };

                this.ws.onclose = () => {
                    this.isConnected = false;
                    this.updateConnectionStatus(false);
                    this.disableInput();
                    this.addSystemMessage('Disconnected from chat server');
                    
                    // Try to reconnect after 3 seconds
                    setTimeout(() => {
                        if (!this.isConnected) {
                            this.connect();
                        }
                    }, 3000);
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.addSystemMessage('Connection error occurred');
                };
            }

            sendMessage() {
                const message = this.messageInput.value.trim();
                if (message && this.isConnected) {
                    const messageData = {
                        user: this.username,
                        message: message
                    };
                    
                    this.ws.send(JSON.stringify(messageData));
                    this.messageInput.value = '';
                }
            }

            displayMessage(data) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message';
                
                const timestamp = new Date(data.timestamp).toLocaleTimeString();
                
                if (data.type === 'system') {
                    messageDiv.classList.add('system');
                    messageDiv.textContent = data.message;
                } else {
                    if (data.user === this.username) {
                        messageDiv.classList.add('own');
                    } else {
                        messageDiv.classList.add('other');
                    }
                    
                    messageDiv.innerHTML = `
                        <div class="message-header">${data.user} • ${timestamp}</div>
                        <div>${data.message}</div>
                    `;
                }
                
                this.chatMessages.appendChild(messageDiv);
                this.scrollToBottom();
            }

            addSystemMessage(message) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message system';
                messageDiv.textContent = message;
                this.chatMessages.appendChild(messageDiv);
                this.scrollToBottom();
            }

            scrollToBottom() {
                this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            }

            updateConnectionStatus(connected) {
                this.connectionStatus.textContent = connected ? 'Connected' : 'Disconnected';
                this.connectionStatus.className = `connection-status ${connected ? 'connected' : 'disconnected'}`;
            }

            enableInput() {
                this.messageInput.disabled = false;
                this.sendButton.disabled = false;
                this.messageInput.focus();
            }

            disableInput() {
                this.messageInput.disabled = true;
                this.sendButton.disabled = true;
            }
        }

        // Initialize chat when page loads
        document.addEventListener('DOMContentLoaded', () => {
            new ChatClient();
        });
    </script>
</body>
</html>
```

## Key Features of This Implementation

### Server Features:
- **Connection Management**: Tracks all connected clients
- **Message Broadcasting**: Sends messages to all connected clients
- **Error Handling**: Gracefully handles connection errors
- **System Messages**: Sends notifications for user join/leave events

### Client Features:
- **Real-time Updates**: Messages appear instantly
- **User Identification**: Each message shows the sender's username
- **Connection Status**: Visual indicator of connection state
- **Auto-reconnection**: Automatically tries to reconnect if disconnected
- **Responsive Design**: Works on both desktop and mobile
- **Message History**: Scrollable message history

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm init -y
   npm install ws
   ```

2. **Start the Server**:
   ```bash
   node server.js
   ```

3. **Open the HTML File**: Open `index.html` in multiple browser windows to test the chat

## WebSocket vs HTTP for Chat

| Feature | WebSocket | HTTP (Polling) |
|---------|-----------|----------------|
| **Real-time** | ✅ Instant | ❌ Delayed |
| **Efficiency** | ✅ Low overhead | ❌ High overhead |
| **Bidirectional** | ✅ Yes | ❌ Request/Response only |
| **Connection** | ✅ Persistent | ❌ New request each time |
| **Complexity** | ⚠️ Moderate | ✅ Simple |

## Advanced Features You Can Add

1. **Private Messages**: Send messages to specific users
2. **File Sharing**: Share images or files
3. **Typing Indicators**: Show when someone is typing
4. **Message Encryption**: End-to-end encryption
5. **User Authentication**: Login system
6. **Message Persistence**: Store messages in database
7. **Room Support**: Multiple chat rooms
8. **Emoji Support**: Rich text formatting

## Security Considerations

1. **Input Validation**: Sanitize all user inputs
2. **Rate Limiting**: Prevent spam messages
3. **Authentication**: Verify user identity
4. **HTTPS/WSS**: Use secure connections in production
5. **Message Size Limits**: Prevent large message attacks

This implementation provides a solid foundation for a real-time chat application using WebSocket technology. The code is well-structured, includes error handling, and provides a good user experience with features like auto-reconnection and visual feedback.