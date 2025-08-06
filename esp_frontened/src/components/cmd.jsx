import { useEffect, useState, useRef } from "react";
import Output from "./output";

function Cmd({ sendCommand, command, setCommand, sensorData, setSensorData, setcam, cam, color, setIsChatbotOpen, file_data, setCommand_rr, command_rr }) {
  const [activeTab, setActiveTab] = useState("terminal");
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [cmdHistory]);

  // Add new commands to history
  useEffect(() => {
    if (command !== "") {
      setCmdHistory(prev => [...prev, { type: "response", content: command }]);
      setCommand("");
    }
  }, [command, setCommand]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    
    if (trimmedInput === "cls" || trimmedInput === "clear") {
      setCmdHistory([]);
    } else if (trimmedInput !== "") {
      sendCommand(trimmedInput);
	  setCommand_rr(true);
      setCmdHistory(prev => [...prev, { type: "command", content: trimmedInput }]);
    }
    
    setInput("");
  };

  const handleError = (data) => {
    const errorData = data.split(':')[1];
    sendCommand(`API_REQUEST:${errorData} i write this command on python terminal & don't give much text give only important minimal text`);
    setIsChatbotOpen(true);
  };

  return (
    <div className="w-full h-full flex flex-col bg-black border border-gray-700 overflow-hidden shadow-2xl font-mono"
		onClick={() => inputRef.current?.focus()}
	>
      {/* Tab Bar */}
      <div className="flex bg-gray-900 border-b border-gray-700 px-2">
        <button
          className={`px-3 py-1 text-xs ${activeTab === "terminal" ? "bg-gray-700 text-green-400" : "text-gray-500 hover:text-gray-300"}`}
          onClick={() => setActiveTab("terminal")}
        >
          TERMINAL
        </button>
        <button
          className={`px-3 py-1 text-xs ${activeTab === "output" ? "bg-gray-700 text-green-400" : "text-gray-500 hover:text-gray-300"}`}
          onClick={() => setActiveTab("output")}
        >
          OUTPUT
        </button>
        <button
          className={`px-3 py-1 text-xs ml-auto ${cam ? "text-green-400" : "text-gray-500"}`}
          onClick={() => setcam(!cam)}
        >
          WEBCAM {cam ? "●" : "○"}
        </button>
      </div>

      {/* Content Area */}
      <div className="h-full flex flex-col bg-gray-900 overflow-auto">
        {/* Terminal */}
        {activeTab === "terminal" && (
          <div 
            className="text-sm flex flex-col h-full p-2 overflow-hidden bg-black overflow-auto"
          >
            <div 
              ref={scrollRef} 
              className="text-green-400 leading-tight overflow-auto"
            >
              
              {cmdHistory.map((item, index) => (
                <div key={index} className="">
                  {item.type === "command" ? (
                    <div className="flex gap-2">
                      <span className="text-green-500">Esp@32:~$</span>
                      <span className="text-cyan-300">{item.content}</span>
                    </div>
                  ) : (
                    item.content.startsWith("Error:") ? (
                      <div className="flex flex-col">
                        <span className="text-red-500">{item.content}</span>
                        <button 
                          onClick={() => {
                            // Find the command that caused this error
                            if (index > 0 && cmdHistory[index-1].type === "command") {
                              handleError(`${item.content} | Command: ${cmdHistory[index-1].content}`);
                            } else {
                              handleError(item.content);
                            }
                          }}
                          className="mt-1 bg-red-900 hover:bg-red-800 text-red-100 text-xs px-2 py-1 rounded self-start transition-colors"
                        >
                          Ask AI about this error
                        </button>
                      </div>
                    ) : (
                      <div>{item.content}</div>
                    )
                  )}
                </div>
              ))}
			  {!command_rr &&
				<form onSubmit={handleSubmit} className="text-sm flex items-center leading-tight">
					<span className="text-green-500">Esp@32:~$ </span>
					<input
						ref={inputRef}
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="flex-grow bg-transparent outline-none text-white px-2"
						spellCheck={false}
						autoFocus
					/>
				</form>
			}
            </div>
            
          </div>
        )}

        {/* Output */}
        {activeTab === "output" && (
          <div className="bg-black overflow-auto h-full">
            <Output 
              sendCommand={sendCommand} 
              sensorData={sensorData} 
              setSensorData={setSensorData} 
              file_data={file_data} 
              handleError={handleError} 
			  color={color}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Cmd;