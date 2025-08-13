// DOM elements
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const usernameInput = document.getElementById('usernameInput');
const connectionStatus = document.getElementById('connectionStatus');
const statusText = connectionStatus.querySelector('.status-text');

// WebSocket connection
let ws = null;
let username = '';
let reconnectTimeout = null;
let messageQueue = [];

// Initialize WebSocket connection
function connectWebSocket() {
    // Use ws:// for local development, wss:// for production with HTTPS
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    try {
        ws = new WebSocket(wsUrl);
        
        // Connection opened
        ws.onopen = () => {
            console.log('Connected to WebSocket server');
            updateConnectionStatus('connected');
            
            // Send any queued messages
            while (messageQueue.length > 0) {
                const message = messageQueue.shift();
                ws.send(JSON.stringify(message));
            }
        };
        
        // Listen for messages
        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                displayMessage(message);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };
        
        // Connection closed
        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
            updateConnectionStatus('disconnected');
            
            // Attempt to reconnect after 3 seconds
            clearTimeout(reconnectTimeout);
            reconnectTimeout = setTimeout(() => {
                console.log('Attempting to reconnect...');
                connectWebSocket();
            }, 3000);
        };
        
        // Connection error
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            updateConnectionStatus('disconnected');
        };
    } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        updateConnectionStatus('disconnected');
    }
}

// Update connection status UI
function updateConnectionStatus(status) {
    connectionStatus.className = `connection-status ${status}`;
    
    switch (status) {
        case 'connected':
            statusText.textContent = 'Connected';
            enableChat();
            break;
        case 'disconnected':
            statusText.textContent = 'Disconnected';
            disableChat();
            break;
        default:
            statusText.textContent = 'Connecting...';
    }
}

// Enable chat inputs
function enableChat() {
    if (username) {
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
    }
}

// Disable chat inputs
function disableChat() {
    messageInput.disabled = true;
    sendButton.disabled = true;
}

// Display a message in the chat
function displayMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    // Add appropriate class based on message type
    if (message.type === 'system') {
        messageDiv.classList.add('system');
    } else if (message.username === username) {
        messageDiv.classList.add('own');
    }
    
    // Create message content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (message.type === 'system') {
        contentDiv.textContent = message.message;
    } else {
        contentDiv.textContent = message.message;
        
        // Add message info (username and time)
        const infoDiv = document.createElement('div');
        infoDiv.className = 'message-info';
        
        const time = new Date(message.timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
        
        if (message.username === username) {
            infoDiv.textContent = time;
        } else {
            infoDiv.textContent = `${message.username || 'Anonymous'} • ${time}`;
        }
        
        messageDiv.appendChild(infoDiv);
    }
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send a message
function sendMessage() {
    const text = messageInput.value.trim();
    
    if (!text || !username) return;
    
    const message = {
        type: 'message',
        username: username,
        message: text
    };
    
    // Send message or queue it if not connected
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        messageQueue.push(message);
        console.log('Message queued - not connected');
    }
    
    // Clear input
    messageInput.value = '';
    messageInput.focus();
}

// Handle username input
usernameInput.addEventListener('input', (e) => {
    username = e.target.value.trim();
    
    if (username && ws && ws.readyState === WebSocket.OPEN) {
        enableChat();
    } else {
        disableChat();
    }
});

// Handle send button click
sendButton.addEventListener('click', sendMessage);

// Handle Enter key in message input
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Handle Enter key in username input
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && username) {
        messageInput.focus();
    }
});

// Initialize connection when page loads
window.addEventListener('load', () => {
    connectWebSocket();
    usernameInput.focus();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (ws) {
        ws.close();
    }
    clearTimeout(reconnectTimeout);
});