import { useEffect, useState, useRef } from "react";

function Output({ sendCommand, sensorData, setSensorData }){

	const [outputshow, setOutputshow] = useState([]);
	
	const scrollRef = useRef(null);

	useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [outputshow]);

	useEffect(() => {
		if (sensorData !== "") {
			setOutputshow(prevCmds => [...prevCmds, sensorData]);
			setSensorData("");
		}
	}, [sensorData, setSensorData]);

	const handle_Stop = function(){
		setOutputshow([]);
		sendCommand("stop");
	}


	return(
		<>
		<div className="p-2 w-full h-full flex bg-zinc-100">
			{outputshow.length !== 0 ?
			<div className="w-full h-full flex flex-col">
				<div ref={scrollRef} className="flex-grow w-full h-full px-2 text-zinc-900 overflow-y-auto">
					{outputshow.map((output, index) => (
						<p key={index}>{output}</p>
					))}
				</div>
				<div className="flex justify-between">
					<button className="bg-zinc-700 px-2 rounded-md" onClick={handle_Stop}>stop</button>
					<button className="bg-zinc-700 px-2 rounded-md" onClick={() => setOutputshow([])}>clear</button>
				</div>
			</div>
			:
			<div className="w-full h-full flex bg-zinc-400 justify-center items-center">
				<p className="[word-spacing:8px]">no output yet  . . . .</p>
			</div>
			}
			
		</div>
		</>
	)
}

export default Output;