const express = require('express');
const net = require('net');
const axios = require('axios');
const WebSocket = require('ws');

const http = require('http');
const app = express();
const server = http.createServer(app);

let tcpSocket = null;

const WS_PORT = process.env.PORT || 4000;
const TCP_PORT = process.env.TCP_PORT || 8080;

// const wss = new WebSocket.Server({ port: WS_PORT });
const wss = new WebSocket.Server({ server });

const API_KEY = "AIzaSyDtGit2qq25qrQ5bSvXQ0Xd_EoGniHnAcU";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

wss.on('connection', (ws) => {
    console.log('React frontend connected');
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('CONNECT_SERVER:connected . . .');
        }
    });

    ws.on('message', async  (message) => {
        console.log('Received command from frontend:', message, message.toString());
        if (message.toString().split(":")[0] === 'API_REQUEST') {
            const data = message.toString().split(":")[1];
            try {
                const response = await axios.post(URL, {
                    contents: [{ parts: [{ text: data }] }]
                });
                const apiResponse = response.data.candidates[0].content.parts[0].text;
                console.log(apiResponse);
                ws.send("API_RESPONSE:"+apiResponse);
            } catch (error) {
                console.log('Error during API request:', error.message);
                ws.send('API_RESPONSE: Error occurred during API request');
            }
        } else {
            if (tcpSocket && tcpSocket.writable) {
                console.log('Sending command to ESP32:', message);
                tcpSocket.write(message);
            } else {
                console.log('No ESP32 connection available to forward the command');
                ws.send('COMMAND:Error: No ESP32 connection available');
            }
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
