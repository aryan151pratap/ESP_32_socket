import { useState } from "react";

function Leftbar({sendCommand, setActiveFile, connection_esp32, connection_server, color, setcolor, setTap_b_open, tab_b_open}){
	const [open, close] = useState(true);
	const [file, setFile] = useState("");
	const [new_wifi, setNew_wifi] = useState(false);
	const [host, sethost] = useState({"hostname":"", "pass":""})

	if(tab_b_open !== open){
		setTap_b_open(!tab_b_open);
	}

	const get_file_data = function(){
		if(file !== ""){
			const data = `with open('${file}', 'r') as file:\n    print(file.read())`;
			setActiveFile(file);
			sendCommand(data);
		}
		setFile("");
	}

	const handle_submit = function(){
		try{
			if(host.hostname !== "" && host.pass !== ""){
				const data = `gw.save_wifi("${host.hostname}", "${host.pass}", 'all_wifi.txt')`;
				sendCommand(data);
				sethost({"hostname":"", "pass":""});
			}
		} catch (error) {
			console.error("Error accessing webcam:", error);
		}
	}

	return(
		<>
		<div className={`h-full flex bg-${color}-800/90`}>
			<div className={`w-7 h-full bg-${color}-800/90 flex flex-col`}>
				<button className=" p-[3px]"
				onClick={() => close(!open)}>
					<span className="text-[20px]">{open ? "[ ]" : "[]"}</span>
				</button>

			</div>
			{ open &&
				<div className="w-[165px] h-full flex flex-col p-1 font-thin">
					<div className="flex flex-row gap-1">
					<input type="text" value={file} onChange={(e) => setFile(e.target.value)} className={`w-full outline-none bg-${color}-700/60 px-2 py-1 font-thin`} placeholder="Get file data . . . "/>
					<button className={`bg-${color}-900 p-1`} onClick={get_file_data}>get</button>
					</div>
					<button className={`mt-2 bg-${color}-700 text-[15px]`} onClick={() => setNew_wifi(!new_wifi)}>
						<span>Add WiFi</span>
					</button>
					{new_wifi &&
						<div className={`mt-2 text-[16px] bg-${color}-700 overflow-hidden flex flex-col p-[1px]`}>
							<span>HOST</span>
							<input type="text" value={host.hostname} onChange={(e) => sethost(prevState => ({...prevState, hostname: e.target.value}))} className={`bg-${color}-700 mb-2 outline-none px-2 text-[14px]`} placeholder="Enter host" spellCheck={false}/>
							<span>PASSWORD</span>
							<input type="text" value={host.pass} onChange={(e) => sethost(prevState => ({...prevState, pass: e.target.value}))} className={`bg-${color}-700 outline-none px-2 text-[14px]`} placeholder="Enter password" spellCheck={false}/>
							<button className={`w-10 bg-${color}-700/50 text-green-500 p-1 flex justify-center mt-1`}
							onClick={handle_submit}>
								<span>Add</span>
							</button>
						</div>
					}
					<div className="flex-grow">
					</div>
					<input type="text" className={`w-full outline-none bg-${color}-700/60 px-2 py-1 font-thin`} value={color} placeholder="Enter color" onChange={(e)=>setcolor(e.target.value)}/>
					<div className={`flex flex-wrap bg-${color}-700 w-full px-1 font-thin text-[13px] text-${color}-200/50`}>
						<p className={connection_server === "connected . . ." ? 'text-green-400' : connection_server === "disconnected . . ." ? 'text-red-400' : 'text-yellow-400 text-[12px]'}><span className="text-white">Server: </span>{connection_server}</p>
						<p className={connection_esp32 === "connected . . ." ? 'text-green-400' : connection_esp32 === "disconnected . . ." ? 'text-red-400' : 'text-yellow-400 text-[12px]'}><span className="text-white">ESP32: </span>{connection_esp32}</p>
					</div>
				</div>
			}
		</div>
		</>
	)
}

export default Leftbar;