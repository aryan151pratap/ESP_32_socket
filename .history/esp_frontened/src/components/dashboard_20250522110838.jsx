import { useEffect, useState, useRef } from "react";
import File from "./file";
import Cmd from "./cmd";
import Leftbar from './leftbar'
import WebcamComponent from "./camera";
import Chatbot from './AI';

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

 
  const socketRef = useRef(null);


  useEffect(() => {
	const connectSocket = () => {
	  if (socketRef.current) return;

	  socketRef.current = new WebSocket("ws://192.168.59.50:4000");

	  socketRef.current.onopen = () => console.log("Connected to WebSocket server");

	  socketRef.current.onmessage = (event) => {
		const data = event.data;

		if (data.startsWith("COMMAND:")) {
			setCommand(data.slice(8));
		} else if(data.startsWith("LIVE:")) {
			setSensorData(data.slice(5));
			console.log(data);
		} else if(data.startsWith("FILE:")) {
			setFile_data(data.slice(5)); //
		} else if(data.startsWith("CONNECT_ESP32:")) {
			setConnection_esp32(data.slice(14));
		} else if(data.startsWith("CONNECT_SERVER:")) {
			setConnection_server(data.slice(15));
		} else if(data.startsWith("API_RESPONSE:")) {
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

  return (
	<>
	<div className={`w-full h-screen bg-${color}-700 flex flex-row text-${color}-200`}>
		<Leftbar color={color} setcolor={setcolor} sendCommand={sendCommand} setActiveFile={setActiveFile}
		tab_b_open={tab_b_open} setTap_b_open={setTap_b_open}
		connection_esp32={connection_esp32} connection_server={connection_server}/>


		<div className="h-full flex flex-col md:flex-row"  style={ !tab_b_open ? { width: 'calc(100% - 1.75rem)' } : { width: 'calc(100% - 165px - 1.75rem'}}>
			<div className="sm:w-full w-full md:h-[100%] h-[50%] flex-grow">
				<div className="h-full w-full flex flex-col md:flex-col sm:flex-row">
					<div className="w-full w-fit h-full flex flex-row">
						
						<File color={color} sendCommand={sendCommand} file_data={file_data} setFile_data={setFile_data} activeFile={activeFile} setActiveFile={setActiveFile}
						setcurrent_file_data={setcurrent_file_data}/>

					</div>
					{ cam &&
					<div className={`w-full h-full flex bg-${color}-800`}>
						<WebcamComponent/>
					</div>}
				</div>
			</div>

			<Cmd setIsChatbotOpen={setIsChatbotOpen} color={color} sendCommand={sendCommand} command={command} setCommand={setCommand}
			file_data={current_file_data} sensorData={sensorData} setSensorData={setSensorData} setcam={setcam} cam={cam}/>

		</div>
		
		<Chatbot bot_text={bot_text} setBot_text={setBot_text} sendCommand={sendCommand} color={color} setIsChatbotOpen={setIsChatbotOpen}
		isChatbotOpen={isChatbotOpen}/>
	</div>
	</>
  );
}

export default Dashboard;
