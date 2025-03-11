import { useState } from "react";

function Leftbar({sendCommand, setActiveFile}){
	const [open, close] = useState(true);
	const [file, setFile] = useState("");


	const get_file_data = function(){
		if(file !== ""){
			const data = `with open('${file}', 'r') as file:\n    print(file.read())`;
			setActiveFile(file);
			sendCommand(data);
		}
		setFile("");
	}

	return(
		<>
		<div className="h-full flex bg-zinc-800/90">
			<div className="w-6 h-full bg-zinc-700/90 flex flex-col">
				<button className=""
				onClick={() => close(!open)}>O</button>
			</div>
			{ open &&
				<div className="w-[170px] h-full flex flex-col p-1 font-thin">
					<div className="flex flex-row gap-1">
					<input type="text" value={file} onChange={(e) => setFile(e.target.value)} className="w-full outline-none bg-zinc-700/60 px-2 py-1 font-thin" placeholder="Get file data . . . "/>
					<button className="bg-zinc-900 p-1" onClick={get_file_data}>get</button>
					</div>
				</div>
			}
		</div>
		</>
	)
}

export default Leftbar;