import usocket as socket
import ustruct as struct

class WebSocketClient:
    def __init__(self, url):
        self.url = url.replace("ws://", "").replace("wss://", "")  # Remove protocol
        self.sock = None

    def connect(self):
        host, port = self.url.split(":")
        self.sock = socket.socket()
        self.sock.connect((host, int(port)))
        print("Connected to WebSocket Server")

    def send(self, message):
        self.sock.send(message.encode("utf-8"))

    def receive(self):
        return self.sock.recv(1024).decode("utf-8")

    def close(self):
        self.sock.close()
