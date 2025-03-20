import { useState } from "react";

function Leftbar({sendCommand, setActiveFile, connection_esp32, connection_server}){
	const [open, close] = useState(true);
	const [file, setFile] = useState("");
	const [new_wifi, setNew_wifi] = useState(false);
	const [host, sethost] = useState({"host":"", "pass":""})


	const get_file_data = function(){
		if(file !== ""){
			const data = `with open('${file}', 'r') as file:\n    print(file.read())`;
			setActiveFile(file);
			sendCommand(data);
		}
		setFile("");
	}

	const handle_submit = function(){
		console.log("send .. . .", host.host);
		try{
			if(host.host !== "" && host.pass !== ""){

			}
		} catch (error) {
			console.error("Error accessing webcam:", error);
		}
	}

	return(
		<>
		<div className="h-full flex bg-zinc-800/90">
			<div className="w-7 h-full bg-zinc-800/90 flex flex-col">
				<button className=" p-[3px]"
				onClick={() => close(!open)}>
					<span className="text-[20px]">{open ? "[ ]" : "[]"}</span>
				</button>

			</div>
			{ open &&
				<div className="w-[165px] h-full flex flex-col p-1 font-thin">
					<div className="flex flex-row gap-1">
					<input type="text" value={file} onChange={(e) => setFile(e.target.value)} className="w-full outline-none bg-zinc-700/60 px-2 py-1 font-thin" placeholder="Get file data . . . "/>
					<button className="bg-zinc-900 p-1" onClick={get_file_data}>get</button>
					</div>
					<button className="mt-2 bg-zinc-700 text-[15px]" onClick={() => setNew_wifi(!new_wifi)}>
						<span>Add WiFi</span>
					</button>
					{new_wifi &&
						<div className="mt-2 text-[16px] bg-zinc-700/50 overflow-hidden flex flex-col p-[1px]">
							<span>HOST</span>
							<input type="text" value={host.host} onChange={(e) => sethost({"host":e.target.value})} className="bg-zinc-700 outline-none px-2 text-[14px]" placeholder="Enter host" spellCheck={false} required/>
							<span>PASSWORD</span>
							<input type="text" value={host.pass} onChange={(e) => sethost({"pass":e.target.value})} className="bg-zinc-700 outline-none px-2 text-[14px]" placeholder="Enter password" spellCheck={false} required/>
							<button className="w-10 bg-zinc-700 text-green-500 p-1 flex justify-center"
							onClick={handle_submit}>
								<span>Add</span></button>
						</div>
					}
					<div className="flex-grow">
					</div>
					<div className="flex flex-wrap bg-zinc-700 w-full px-1 font-thin text-[13px] text-zinc-200/50">
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