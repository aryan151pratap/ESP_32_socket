import { useEffect, useState, useRef } from "react";
import File from "./file";
import Cmd from "./cmd";
import Leftbar from "./leftbar";
import WebcamComponent from "./camera";
import Chatbot from "./AI";

const ip = import.meta.env.VITE_IP;
console.log(ip)
function Dashboard() {
  const [sensorData, setSensorData] = useState("");
  const [command, setCommand] = useState("");
  const [file_data, setFile_data] = useState("");
  const [activeFile, setActiveFile] = useState("");
  const [cam, setcam] = useState(false);
  const [connection_esp32, setConnection_esp32] = useState("Unable to connect . . .");
  const [connection_server, setConnection_server] = useState("Unable to connect . . .");
  const [bot_text, setBot_text] = useState("");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [current_file_data, setcurrent_file_data] = useState("");
  const [color, setcolor] = useState("zinc");
  const [tab_b_open, setTap_b_open] = useState(true);
  const [command_rr, setCommand_rr] = useState(false);
  const socketRef = useRef(null);
  const [leftbarWidth, setLeftbarWidth] = useState(250);
  const [cmdHeight, setCmdHeight] = useState(300);

	useEffect(() => {
		const connectSocket = () => {
			if (socketRef.current) return;
			
			socketRef.current = new WebSocket(`wss://${ip}`);
			
			socketRef.current.onopen = () => console.log("Connected to WebSocket server");
			
			socketRef.current.onmessage = (event) => {
				setCommand_rr(false);
				const data = event.data;

				if (data.startsWith("COMMAND:")) {
					setCommand(data.slice(8));
				} else if (data.startsWith("LIVE:")) {
					setSensorData(data.slice(5));
				} else if (data.startsWith("FILE:")) {
					setFile_data(data.slice(5));
				} else if (data.startsWith("CONNECT_ESP32:")) {
					setConnection_esp32(data.slice(14));
				} else if (data.startsWith("CONNECT_SERVER:")) {
					setConnection_server(data.slice(15));
				} else if (data.startsWith("API_RESPONSE:")) {
					setBot_text(data.slice(13));
				}
			};

			socketRef.current.onerror = (error) => console.error("WebSocket Error:", error);

			socketRef.current.onclose = () => {
				console.log("WebSocket disconnected, reconnecting...");
				socketRef.current = null;
				setTimeout(connectSocket, 3000);
			};
		};

		connectSocket();
		return () => socketRef.current?.close();
	}, []);

  const sendCommand = (command) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(command);
    }
  };

  const startDraggingLeftbar = (e) => {
    e.preventDefault();
    document.body.style.userSelect = "none";
    const handleMouseMove = (e) => {
      const newWidth = e.clientX;
      if (newWidth > 30 && newWidth < 400) setLeftbarWidth(newWidth);
    };
    const stopMouseMove = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopMouseMove);
      document.body.style.userSelect = "auto";
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopMouseMove);
  };

  const startDraggingCmd = (e) => {
    e.preventDefault();
    document.body.style.userSelect = "none";
    const handleMouseMove = (e) => {
      const newHeight = window.innerHeight - e.clientY;
      if (newHeight > 150 && newHeight < 600) setCmdHeight(newHeight);
    };
    const stopMouseMove = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopMouseMove);
      document.body.style.userSelect = "auto";
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopMouseMove);
  };

  return (
    <div className={`w-full h-screen bg-${color}-700 flex flex-row text-${color}-200`}>
		<div className="w-fit relative">
			<Leftbar
				color={color}
				setcolor={setcolor}
				sendCommand={sendCommand}
				setActiveFile={setActiveFile}
				tab_b_open={tab_b_open}
				setTap_b_open={setTap_b_open}
				connection_esp32={connection_esp32}
				connection_server={connection_server}
				leftbarWidth={leftbarWidth}
				setLeftbarWidth={setLeftbarWidth}
			/>
			<div className="absolute hover:bg-green-500 inset-0 top-0 left-auto w-1 cursor-col-resize"
				onMouseDown={startDraggingLeftbar}
			/>
		</div>

		<div
			className="w-full h-full flex flex-col"
			style={{
			width: `calc(100% - ${leftbarWidth}px)`,
			}}
		>
			<div
				className="w-full sm:w-full md:w-full w-full md:h-full h-full flex-grow"
				style={{ height: `calc(100% - ${cmdHeight}px)` }}
			>
				<div className="h-full w-full flex flex-col md:flex-col sm:flex-row">
					<div className="w-full h-full flex flex-row">
						<File
							color={color}
							sendCommand={sendCommand}
							file_data={file_data}
							setFile_data={setFile_data}
							activeFile={activeFile}
							setActiveFile={setActiveFile}
							setcurrent_file_data={setcurrent_file_data}
						/>
					</div>
					{cam && (
					<div className={`w-full h-full flex bg-${color}-800`}>
						<WebcamComponent />
					</div>
					)}
				</div>
			</div>

			<div className="relative" style={{ height: cmdHeight }}>
				<div className="absolute hover:bg-green-500 inset-0 top-0 left-0 h-1 cursor-row-resize"
					onMouseDown={startDraggingCmd}
				/>
				<Cmd
					setIsChatbotOpen={setIsChatbotOpen}
					color={color}
					sendCommand={sendCommand}
					command={command}
					setCommand={setCommand}
					file_data={current_file_data}
					sensorData={sensorData}
					setSensorData={setSensorData}
					setcam={setcam}
					cam={cam}
					setCommand_rr={setCommand_rr}
					command_rr={command_rr}
				/>
			</div>
		</div>

		<Chatbot
			bot_text={bot_text}
			setBot_text={setBot_text}
			sendCommand={sendCommand}
			color={color}
			setIsChatbotOpen={setIsChatbotOpen}
			isChatbotOpen={isChatbotOpen}
		/>
	</div>
  );
}

export default Dashboard;
