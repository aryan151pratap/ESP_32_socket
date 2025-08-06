import { useEffect } from "react";
import { useState } from "react";
import { 
  FaFolderOpen, 
  FaWifi, 
  FaServer, 
  FaMicrochip, 
  FaPalette, 
  FaChevronLeft, 
  FaChevronRight,
  FaPlus
} from "react-icons/fa";

function Leftbar({sendCommand, setActiveFile, connection_esp32, connection_server, color, setcolor, setTap_b_open, tab_b_open, leftbarWidth, setLeftbarWidth}) {
	const [width, setWidth] = useState(leftbarWidth);
  const [new_wifi, setNew_wifi] = useState(false);
  const [host, sethost] = useState({hostname: "", pass: ""});
  const [file, setFile] = useState("");

  const get_file_data = function() {
    if(file !== "") {
      const data = `with open('${file}', 'r') as file:\n    print(file.read())`;
      setActiveFile(file);
      sendCommand(data);
    }
    setFile("");
  }

  useEffect(() => {
	if(leftbarWidth > 30){
		setWidth(leftbarWidth);
	}
  }, [leftbarWidth])

  const handle_submit = function() {
    try {
      if(host.hostname !== "" && host.pass !== "") {
        const data = `gw.save_wifi("${host.hostname}", "${host.pass}", 'all_wifi.txt')`;
        sendCommand(data);
        sethost({hostname: "", pass: ""});
        setNew_wifi(false);
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  }

  // Color mapping for better theme consistency
  const colorMap = {
    zinc: "bg-zinc-800",
    slate: "bg-slate-800",
    gray: "bg-gray-800",
    neutral: "bg-neutral-800",
    stone: "bg-stone-800",
    red: "bg-red-800",
    orange: "bg-orange-800",
    amber: "bg-amber-800",
    yellow: "bg-yellow-800",
    lime: "bg-lime-800",
    green: "bg-green-800",
    emerald: "bg-emerald-800",
    teal: "bg-teal-800",
    cyan: "bg-cyan-800",
    sky: "bg-sky-800",
    blue: "bg-blue-800",
    indigo: "bg-indigo-800",
    violet: "bg-violet-800",
    purple: "bg-purple-800",
    fuchsia: "bg-fuchsia-800",
    pink: "bg-pink-800",
    rose: "bg-rose-800"
  };

  const bgColor = colorMap[color] || "bg-zinc-800";

  return (
    <div className={`w-full h-full flex ${bgColor} text-gray-200 border-r border-gray-700`}  style={{ width: leftbarWidth }}>
      {/* Collapse/Expand Button */}
      <div className="w-8 h-full flex flex-col items-center py-2">
        <button 
			className="p-2 hover:bg-gray-700 rounded-md transition-colors"
			onClick={() => {
				if(tab_b_open !== true){
					setLeftbarWidth(width);
				}else{
					setLeftbarWidth(30);
				}
				setTap_b_open(!tab_b_open);
			}}
        >
          {tab_b_open ? <FaChevronLeft className="text-gray-400" /> : <FaChevronRight className="text-gray-400" />}
        </button>
		<div className="flex-grow flex flex-col items-center justify-center space-y-4 mt-4">
		<button 
			className="p-2 hover:bg-gray-700 rounded-md transition-colors"
			onClick={() => document.getElementById('fileInput')?.focus()}
			title="Open File"
		>
			<FaFolderOpen className="text-blue-400" />
		</button>
		<button 
			className="p-2 hover:bg-gray-700 rounded-md transition-colors"
			onClick={() => setNew_wifi(!new_wifi)}
			title="Add WiFi"
		>
			<FaWifi className="text-green-400" />
		</button>
		<button 
			className="p-2 hover:bg-gray-700 rounded-md transition-colors"
			onClick={() => document.getElementById('colorInput')?.focus()}
			title="Change Theme"
		>
			<FaPalette className="text-purple-400" />
		</button>
		</div>
      </div>


      {tab_b_open && (
        <div className="h-full flex flex-col p-3 border-l border-gray-700 overflow-auto" style={{ width: leftbarWidth }}>
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-400 mb-2 flex items-center">
              <FaFolderOpen className="mr-2 text-blue-400" /> File Explorer
            </h2>
            <div className="w-full flex flex-col gap-2">
              <input 
                id="fileInput"
                type="text" 
                value={file} 
                onChange={(e) => setFile(e.target.value)} 
                className="outline-none bg-gray-700 px-3 py-2 rounded text-sm"
                placeholder="Enter filename..."
                spellCheck={false}
              />
              <button 
                className="w-fit ml-auto bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                onClick={get_file_data}
              >
                Open
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold text-gray-400 flex items-center">
                <FaWifi className="mr-2 text-green-400" /> WiFi Configuration
              </h2>
              <button 
                className="text-xs bg-gray-700 hover:bg-gray-600 p-1 rounded transition-colors"
                onClick={() => setNew_wifi(!new_wifi)}
              >
                {new_wifi ? "Cancel" : <FaPlus />}
              </button>
            </div>
            
            {new_wifi && (
              <div className="bg-gray-700 rounded p-3">
                <div className="mb-2">
                  <label className="block text-xs text-gray-400 mb-1">Network SSID</label>
                  <input 
                    type="text" 
                    value={host.hostname} 
                    onChange={(e) => sethost(prev => ({...prev, hostname: e.target.value}))} 
                    className="w-full bg-gray-800 rounded px-3 py-2 outline-none text-sm" 
                    placeholder="Enter network name"
                    spellCheck={false}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs text-gray-400 mb-1">Password</label>
                  <input 
                    type="password" 
                    value={host.pass} 
                    onChange={(e) => sethost(prev => ({...prev, pass: e.target.value}))} 
                    className="w-full bg-gray-800 rounded px-3 py-2 outline-none text-sm" 
                    placeholder="Enter password"
                  />
                </div>
                <button 
                  className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-sm font-medium transition-colors"
                  onClick={handle_submit}
                >
                  Add Network
                </button>
              </div>
            )}
          </div>

          <div className="mt-auto">
            <h2 className="text-sm font-semibold text-gray-400 mb-2 flex items-center">
              <FaPalette className="mr-2 text-purple-400" /> Theme
            </h2>
            <input 
              id="colorInput"
              type="text" 
              value={color} 
              onChange={(e) => setcolor(e.target.value)} 
              className="w-full bg-gray-700 rounded px-3 py-2 outline-none text-sm" 
              placeholder="Enter theme name"
              list="colorOptions"
            />
            <datalist id="colorOptions">
              <option value="zinc" />
              <option value="slate" />
              <option value="gray" />
              <option value="neutral" />
              <option value="stone" />
              <option value="red" />
              <option value="orange" />
              <option value="amber" />
              <option value="yellow" />
              <option value="lime" />
              <option value="green" />
              <option value="emerald" />
              <option value="teal" />
              <option value="cyan" />
              <option value="sky" />
              <option value="blue" />
              <option value="indigo" />
              <option value="violet" />
              <option value="purple" />
              <option value="fuchsia" />
              <option value="pink" />
              <option value="rose" />
            </datalist>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center mb-2">
              <FaServer className="mr-2 text-yellow-400" />
              <span className="text-xs text-gray-300">Server:</span>
              <span className={`ml-2 text-xs font-medium ${
                connection_server === "connected . . ." 
                  ? 'text-green-400' 
                  : connection_server === "disconnected . . ." 
                    ? 'text-red-400' 
                    : 'text-yellow-400'
              }`}>
                {connection_server}
              </span>
            </div>
            <div className="flex items-center">
              <FaMicrochip className="mr-2 text-yellow-400" />
              <span className="text-xs text-gray-300">ESP32:</span>
              <span className={`ml-2 text-xs font-medium ${
                connection_esp32 === "connected . . ." 
                  ? 'text-green-400' 
                  : connection_esp32 === "disconnected . . ." 
                    ? 'text-red-400' 
                    : 'text-yellow-400'
              }`}>
                {connection_esp32}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leftbar;