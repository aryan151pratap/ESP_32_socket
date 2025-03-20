import { useState, useEffect } from "react";

const File = ({ sendCommand, file_data, setFile_data, activeFile, setActiveFile }) => {
  const [input, setInput] = useState("");

  useEffect(() => {
    if (file_data !== "") {
      setInput(file_data);
      setFile_data(""); 
    }

	const button = document.getElementById("runButton");
    if (input.trim() === "") {
      button.classList.add("hidden");
    } else {
      button.classList.remove("hidden");
    }

  }, [file_data, setFile_data, input]);

  
  const handleTab = (e) => {
	  if (e.key === "Tab") {
		  e.preventDefault();
		  const cursorPos = e.target.selectionStart;
		  const textBefore = input.substring(0, cursorPos);
		  const textAfter = input.substring(cursorPos);
		  setInput(textBefore + "\t" + textAfter);
		  
		  setTimeout(() => {
			  e.target.selectionStart = e.target.selectionEnd = cursorPos + 1;
			}, 0);
		}
	};

	const escapePythonCode = (text) => {
	  return text
		.replace(/\\/g, '\\\\')      
		.replace(/'/g, "\\'")       
		.replace(/"/g, '\\"') 
		.replace(/\n/g, '\\n')
		.replace(/\r/g, '\\r')
		.replace(/\t/g, '\\t') 
		.replace(/("""|''')/g, '\\$1');
	};

  const handle_Save = () => {
    if (activeFile !== "" && input !== "") {
      const escapedInput = escapePythonCode(input);
      const data = `with open('${activeFile}', 'w') as file:\n    file.write("""${escapedInput}""")`;

      try {
        sendCommand(data);
        alert("File saved successfully!");
      } catch (error) {
        alert("Error saving file: " + error.message);
      }
    } else {
      alert("Please enter some text before saving.");
    }
  };

  const handle_close = () => {
    setActiveFile("");
    setInput("");
  };

  const handle_run = function(){
	  sendCommand("RUN:"+input);
  }

  return (
    <div className="w-full h-full flex flex-col gap-1 bg-zinc-800/70 overflow-x-auto">
      <div className="w-full flex gap-1 bg-zinc-800/70 text-zinc-200 font-thin">
        {activeFile && (
          <>
            <div className="flex items-center px-2 py-[2px] text-sm bg-zinc-900">
              <button className="hover:underline">{activeFile.split("/").pop()}</button>
              <button className="ml-2 text-red-400 hover:text-red-600" onClick={handle_close}>
                ✕
              </button>
            </div>
            <div className="ml-auto">
              <button className="bg-zinc-700 px-4" onClick={handle_Save}>
                Save
              </button>
            </div>
          </>
        )}
      </div>

	  <div className="relative w-full h-full flex">
		<textarea
			className="w-full h-full bg-zinc-900 resize-none outline-none text-white p-4 font-thin tracking-wide"
			spellCheck={false}
			value={input}
			onChange={(e) => setInput(e.target.value)}
			placeholder="Enter text here . . . ."
			onKeyDown={handleTab}
			></textarea>
			<button id="runButton" className="absolute top-2 right-5 bg-green-500 text-white px-3 py-1 rounded hidden"
			onClick={handle_run}
			>
				Run
			</button>
		</div>
    </div>
  );
};

export default File;
