import { useEffect, useState, useRef } from "react";
import File from "./file";
import Cmd from "./cmd";
import Leftbar from './leftbar'

function Dashboard() {
  const [sensorData, setSensorData] = useState("");
  const [command, setCommand] = useState("");
  const [file_data, setFile_data] = useState("");
  const [activeFile, setActiveFile] = useState("");

  const socketRef = useRef(null);

  

  useEffect(() => {
	const connectSocket = () => {
	  if (socketRef.current) return;

	  socketRef.current = new WebSocket("ws://192.168.244.50:8081");

	  socketRef.current.onopen = () => console.log("Connected to WebSocket server");

	  socketRef.current.onmessage = (event) => {
		const data = event.data;

		if (data.startsWith("COMMAND:")) {
			setCommand(data.slice(8));
		} else if(data.startsWith("LIVE:")) {
			setSensorData(data.slice(5));
		} else if(data.startsWith("FILE:")) {
			setFile_data(data.slice(5));
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
	<div className="w-full h-screen bg-zinc-700 flex flex-row text-zinc-200">
		<Leftbar sendCommand={sendCommand} setActiveFile={setActiveFile}/>
		<div className="h-full w-full flex flex-col md:flex-row">
			<div className="w-full flex-grow">
				<File sendCommand={sendCommand} file_data={file_data} setFile_data={setFile_data} activeFile={activeFile} setActiveFile={setActiveFile}/>
			</div>
			<Cmd sendCommand={sendCommand} command={command} setCommand={setCommand}
			 sensorData={sensorData} setSensorData={setSensorData}/>
		</div>
	</div>
  );
}

export default Dashboard;
