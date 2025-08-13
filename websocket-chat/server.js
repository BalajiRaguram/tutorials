const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');

// Create Express app for serving static files
const app = express();
const server = http.createServer(app);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.add(ws);
    
    // Send welcome message to the new client
    ws.send(JSON.stringify({
        type: 'system',
        message: 'Welcome to the chat!',
        timestamp: new Date().toISOString()
    }));
    
    // Broadcast user joined message to all other clients
    broadcastMessage({
        type: 'system',
        message: 'A new user joined the chat',
        timestamp: new Date().toISOString()
    }, ws);
    
    // Handle incoming messages
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log('Received:', message);
            
            // Add timestamp to message
            message.timestamp = new Date().toISOString();
            
            // Broadcast message to all clients including sender
            broadcastMessage(message);
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    
    // Handle client disconnect
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
        
        // Broadcast user left message
        broadcastMessage({
            type: 'system',
            message: 'A user left the chat',
            timestamp: new Date().toISOString()
        });
    });
    
    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Function to broadcast message to all connected clients
function broadcastMessage(message, excludeClient = null) {
    const messageString = JSON.stringify(message);
    
    clients.forEach((client) => {
        // Check if client is still connected and not excluded
        if (client.readyState === WebSocket.OPEN && client !== excludeClient) {
            client.send(messageString);
        }
    });
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});