const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', ws => {
  console.log('New client connected');

  ws.on('message', message => {
    // Convert Buffer to string
    let messageStr;
    if (message instanceof Buffer) {
      messageStr = message.toString('utf8');
    } else {
      messageStr = message;
    }

    console.log(`Received message => ${messageStr}`);

    let parsedMessage;

    // Check if message is JSON
    try {
      parsedMessage = JSON.parse(messageStr);
      if (parsedMessage && typeof parsedMessage === 'object') {
        switch (parsedMessage.type) {
          case 'track':
            console.log(`Track id received: ${parsedMessage.id} Track name: ${parsedMessage.name}`);
            break;
          default:
            console.log(`Unrecognized message type: ${parsedMessage.type}`);
        }
      }
    } catch (e) {
      // Message is not JSON, handle as plain text
      if (messageStr === 'Android Client Connected') {
        console.log('Android Client Connected');
      }
    }

    // Broadcast message to all clients
    wss.clients.forEach(client => {
      if (parsedMessage && parsedMessage.type === 'track') {
        client.send(JSON.stringify(parsedMessage)); // sending the whole parsedMessage object as JSON
      } else {
        client.send(messageStr);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
