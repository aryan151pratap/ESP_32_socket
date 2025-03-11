const net = require('net');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
    console.log('React frontend connected');

	ws.on('message', (message) => {
        console.log('Received command from frontend:', message);

        if (tcpSocket && tcpSocket.writable) {
            console.log('Sending command to ESP32:', message);
            tcpSocket.write(message);
        } else {
            console.log('No ESP32 connection available to forward the command');
        }
    });

    ws.on('close', () => {
        console.log('Frontend disconnected');
    });
});


const tcpServer = net.createServer((socket) => {
    console.log('ESP32 connected');
	tcpSocket = socket;

    socket.on('data', (data) => {
        console.log('Received from ESP32:', data);

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data.toString());
            }
        });
    });

    socket.on('end', () => console.log('ESP32 disconnected'));

    socket.on('error', (err) => console.log('Error:', err));
});

tcpServer.listen(8080, '0.0.0.0', () => {
    console.log('Node.js TCP server is running on port 8080');
});
