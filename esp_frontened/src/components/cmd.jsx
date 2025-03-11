import { useEffect, useState, useRef } from "react";
import Output from "./output";

function Cmd({ sendCommand, command, setCommand, sensorData, setSensorData }) {
	const [terminal, setTerminal] = useState(true);
	const [output, setOutput] = useState(true);

	const [input, setInput] = useState("");
	const [cmdShow, setCmdShow] = useState([]);

	const scrollRef = useRef(null);
	useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [cmdShow]);

	useEffect(() => {
		if (command !== "") {
			setCmdShow(prevCmds => [...prevCmds, command]);
			setCommand("");
		}
	}, [command, setCommand]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if( input.trim() == "cls" || input.trim() == "clear"){ setCmdShow([]) }
		else if(input.trim() !== ""){
			sendCommand(input);
			setCmdShow(prevCmds => [...prevCmds, ">>> " + input]);
		}
		setInput("");
	};

	return (
		<div className="w-full md:h-full flex flex-col bg-zinc-700 text-white">
			<div className="w-full flex flex-row gap-1">
				<button className={`px-2 ${!terminal ? "bg-zinc-600" : "bg-zinc-800"}`} onClick={() => setTerminal(!terminal)}>Terminal</button>
				<button className={`px-2 ${!output ? "bg-zinc-600" : "bg-zinc-800"}`} 
				onClick={() => setOutput(!output)}>Output</button>
			</div>
			<div className="flex w-full h-full md:flex-col">
			{terminal && 
			<div className="w-full h-[300px] flex flex-grow md:flex-col">
				<div className="w-full h-full flex flex-col bg-zinc-900/90">
					<div ref={scrollRef} className="w-full h-full px-2 text-zinc-200 overflow-y-auto font-thin tracking-wide">
						{cmdShow.map((cmd, index) => (
							cmd.split(":")[0] === "Error" ?
							<p key={index} className="text-red-400">{cmd}</p>
							:
							<p key={index}>{cmd}</p>
						))}
					</div>
					<form onSubmit={handleSubmit} className="w-full">
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className="w-full bg-zinc-800/70 px-2 p-1 outline-none"
							placeholder="command . . ."
							spellCheck={false} 
						/>
					</form>
				</div>
			</div>
			}
			{output && 
			<div className="w-full h-[300px] md:h-[300px] flex">
				<Output sendCommand={sendCommand} sensorData={sensorData} setSensorData={setSensorData}/>
			</div>
			}
			</div>
		</div>
	);
}

export default Cmd;
