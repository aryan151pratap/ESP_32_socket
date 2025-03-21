const net = require('net');
const WebSocket = require('ws');

let tcpSocket = null;

const WS_PORT = process.env.PORT || 4000;
const TCP_PORT = process.env.TCP_PORT || 9000;

const wss = new WebSocket.Server({ port: WS_PORT });

wss.on('connection', (ws) => {
    console.log('React frontend connected');
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('CONNECT_SERVER:connected . . .');
        }
    });

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
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('CONNECT_SERVER:disconnected . . .');
            }
        });
    });
});

const tcpServer = net.createServer((socket) => {
    console.log('ESP32 connected');
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('CONNECT_ESP32:connected . . .');
        }
    });
    tcpSocket = socket;

    socket.on('data', (data) => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data.toString());
            }
        });
    });

    socket.on('end', () => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('CONNECT_ESP32:disconnected . . .');
            }
        });
        console.log('ESP32 disconnected');
    });

    socket.on('error', (err) => console.log('Error:', err));
});

tcpServer.listen(TCP_PORT, '0.0.0.0', () => {
    console.log(`Node.js TCP server is running on port ${TCP_PORT}`);
});
