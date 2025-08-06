import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Output({ sendCommand, sensorData, setSensorData, color, handleError, file_data }) {
  const [outputshow, setOutputshow] = useState([]);
	
  const scrollRef = useRef(null);
  
  const accentColors = {
    "blue": {
      bg: "bg-gradient-to-br from-blue-900/80 to-blue-800",
      text: "text-blue-300",
      border: "border-blue-700",
      button: "bg-blue-700 hover:bg-blue-600"
    },
    "purple": {
      bg: "bg-gradient-to-br from-purple-900/80 to-purple-800",
      text: "text-purple-300",
      border: "border-purple-700",
      button: "bg-purple-700 hover:bg-purple-600"
    },
    "green": {
      bg: "bg-gradient-to-br from-green-900/80 to-green-800",
      text: "text-green-300",
      border: "border-green-700",
      button: "bg-green-700 hover:bg-green-600"
    },
    "red": {
      bg: "bg-gradient-to-br from-red-900/80 to-red-800",
      text: "text-red-300",
      border: "border-red-700",
      button: "bg-red-700 hover:bg-red-600"
    },
    "amber": {
      bg: "bg-gradient-to-br from-amber-900/80 to-amber-800",
      text: "text-amber-300",
      border: "border-amber-700",
      button: "bg-amber-700 hover:bg-amber-600"
    },
	"zinc": {
      bg: "bg-gradient-to-br from-zinc-900/80 to-zinc-800",
      text: "text-zinc-300",
      border: "border-zinc-700",
      button: "bg-amber-700 hover:bg-zinc-600"
    }
  };
  
  const accent = accentColors[color] || accentColors["zinc"];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [outputshow]);

  useEffect(() => {
    if (sensorData !== "") {
      const parts = sensorData.split("LIVE:").filter(part => part.trim() !== "");
      setOutputshow(prevCmds => [...prevCmds, ...parts]);
      setSensorData("");
    }
  }, [sensorData, setSensorData]);

  const handleStop = function() {
    // setOutputshow([]);
    sendCommand("stop");
  }

  const handleCopyError = (data) => {
    navigator.clipboard.writeText(data).then(() => {
      const notification = document.createElement('div');
      notification.textContent = 'Copied!';
      notification.className = 'fixed bottom-20 right-8 bg-black/80 text-white px-3 py-1 rounded-md text-sm z-60';
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 1500);
    }).catch((err) => {
      console.error("Failed to copy:", err);
    });
  }

  const handleAskAI = function(data) {
    handleError(data);
  }

  return (
    <AnimatePresence>
      {!sensorData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`h-full w-full flex flex-col overflow-hidden ${accent.bg} border ${accent.border} shadow-2xl`}
        >
          <div className={`h-fit flex justify-between items-center p-1 border-b ${accent.border} bg-black/30`}>
            <div className="flex items-center space-x-2">
              <div className={`p-1 rounded-md ${accent.button}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-md">Output Console</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleStop}
                className={`${accent.button} p-1 rounded-md flex items-center transition-colors`}
                title="Stop execution"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </button>
              <button 
                onClick={() => setOutputshow([])}
                className={`${accent.button} p-1 rounded-md flex items-center transition-colors`}
                title="Clear console"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div 
            ref={scrollRef} 
            className={`w-full h-full p-3 ${accent.text} overflow-auto font-mono text-sm bg-gradient-to-b from-gray-900/70 to-black/50`}
          >
            {outputshow.length !== 0 ? (
              outputshow.map((output, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-1 last:mb-20"
                >
                  {output.split(":")[0] === "Error" ? (
                    <div className="p-3 rounded-lg bg-red-900/40 border border-red-800/60">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-red-300 font-medium">{output}</span>
                        </div>
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleCopyError(`code: ${file_data}\n Output: ${output}`)}
                            className="bg-red-800/50 hover:bg-red-700 p-1.5 rounded-md transition-colors"
                            title="Copy error details"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleAskAI(`code: ${file_data}\n Output: ${output}`)}
                            className="bg-blue-700 hover:bg-blue-600 p-1.5 rounded-md transition-colors"
                            title="Ask AI for help"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`${accent.text} px-2 py-1 rounded bg-gray-800/30`}>
                      {output}
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-lg">No output data yet</p>
                <p className="text-sm mt-2 opacity-70">Run your code to see output here</p>
              </div>
            )}
          </div>

          <div className={`p-3 text-xs text-center ${accent.text} bg-black/30 border-t ${accent.border}`}>
            {outputshow.length > 0 ? (
              <div className="flex gap-4 items-center px-2">
                <span>{outputshow.length} output lines</span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Live updating
                </span>
              </div>
            ) : (
              "Console is ready to receive output"
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Output;