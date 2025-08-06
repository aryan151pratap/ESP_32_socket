import network
import socket
import time
import io
import _thread
from machine import Pin, reset, soft_reset
import get_wifi as gw

SSID = "Galaxy F12 D5ED"
PASSWORD = "12345678"

data = gw.wf('all_wifi.txt')
l = data[0].split(',')
if len(l) != 0:
    SSID = l[0]
    PASSWORD = l[1]

wifi = network.WLAN(network.STA_IF)
wifi.active(True)
wifi.connect(SSID, PASSWORD)

start_time = time.time()
while not wifi.isconnected():
    if time.time() - start_time > 10:
        soft_reset()
    time.sleep(1)

led = Pin(2, Pin.OUT)

for i in range(3):
    led.on()
    time.sleep(0.1)
    led.off()
    time.sleep(0.1)

print("Connected to Wi-Fi:", wifi.ifconfig())

HOST = data[1]
PORT = 8080

current_file = False
running_thread = None  
socket_thread_running = False


def stop_execution():
    global current_file
    current_file = False
    print("Execution stopped.")
    soft_reset()

def execute_command(command):
    global current_file
    output = ""

    try:
        if command == "led_on":
            led.on()
            output = "LED turned on"
        elif command == "led_off":
            led.off()
            output = "LED turned off"
        elif command == "stop":
            output = "Stopping execution..."
        else:
            command_output = io.StringIO()
            original_print = print

            def custom_print(*args, **kwargs):
                original_print(*args, **kwargs)
                command_output.write(" ".join(map(str, args)) + "\n")

            globals()["print"] = custom_print
            exec(command, globals())
            globals()["print"] = original_print  

            output = command_output.getvalue().strip() or "Executed successfully"
    except Exception as e:
        output = f"Error: {str(e)}"

    return output

def send_output_to_server(output):
    try:
        s.send(f"LIVE:{output}".encode())
    except Exception as e:
        print(f"Error sending output to server: {e}")

def listen_for_commands():
    global socket_thread_running

    while socket_thread_running:
        try:
            command = s.recv(2048).decode().strip()
            if command:
                if command == "stop":
                    reset()
                print("Another code is executing . . .")
        except Exception as e:
            print(f"Socket listen error: {e}")

    

def execute_file(file_name):
    global socket_thread_running, current_file
    current_file = True  
    socket_thread_running = True

    _thread.start_new_thread(listen_for_commands, ())

    try:
        if file_name.endswith('.py'):
            with open(file_name, 'r') as f:
                file_content = f.read()
        else:
            file_content = file_name[4:]

        original_print = print

        def custom_print(*args, **kwargs):
            output_line = " ".join(map(str, args)) + "\n"
            send_output_to_server(output_line)  

        globals()["print"] = custom_print
        exec_globals = globals().copy()

        print(f"Executing Output . . . ")
        
        exec(file_content, exec_globals)  

    except Exception as e:
        send_output_to_server(f"Error: {e}")

    finally:
        globals()["print"] = original_print 
        socket_thread_running = False
        current_file = False
        stop_execution()


while True:
    try:
        addr = socket.getaddrinfo(HOST, PORT)[0][-1]
        s = socket.socket()
        s.connect(addr)
        print("Connected to server")

        while True:
            command = s.recv(2048).decode().strip()
            if not command:
                continue

            print("Received command:", command)  

            if command.endswith('.py') or command.startswith("RUN:"):
                execute_file(command)  

            else:
                if command.startswith("with"):
                    response = "FILE:" + execute_command(command)
                else:
                    response = "COMMAND:" + execute_command(command)
                s.send(response.encode())
                print("Sent:", response)
                if response == "COMMAND:Stopping execution...": stop_execution()
    except Exception as e:
        print("Connection failed:", e)
        time.sleep(2)
    finally:
        s.close()
