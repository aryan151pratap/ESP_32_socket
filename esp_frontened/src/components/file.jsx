import { useState, useEffect } from "react";
import { X, Play, Save } from "lucide-react";
// import CodeMirror from "@uiw/react-codemirror";
// import { python } from "@codemirror/lang-python";
// import { dracula } from "@uiw/codemirror-theme-dracula";
import Editor from '@monaco-editor/react';


const File = ({ sendCommand, file_data, setFile_data, activeFile, setActiveFile, color, setcurrent_file_data }) => {
  const [input, setInput] = useState("");
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [filename, setFilename] = useState("");
  const [save, setsave] = useState(false);

  useEffect(() => { 
    if (file_data !== "") {
      setInput(file_data);
      setFile_data("");
    }
    if(filename !== "" && save){
      handleSave();
      setFilename("");
      setsave(false);
    }
    if(input !== ""){
      setcurrent_file_data(input);
    }
  }, [file_data, setFile_data, filename, setFilename, save, setsave, input, setcurrent_file_data]);

  const handleTab = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const cursorPos = e.target.selectionStart;
      const textBefore = input.substring(0, cursorPos);
      const textAfter = input.substring(cursorPos);
      setInput(textBefore + "    " + textAfter);

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = cursorPos + 4;
      }, 0);
    }
  };

  const handleSave = () => {
    if (activeFile !== "" && input !== "") {
      const data = `with open('${activeFile}', 'w') as file:\n    file.write("""${input}""")`;
      sendCommand(data);
      setOpenSaveModal(false);
    } else {
      setOpenSaveModal(true);
    }
  };

  const handleRun = () => {
    sendCommand("RUN:" + input);
  };

  const give_to_save = function(){
    setActiveFile(filename);
    setsave(true);
    setOpenSaveModal(false);
  }

  const close = function(){
    setActiveFile("");
    setInput("");
  }

  return (
    <div className={`w-full h-full flex flex-col bg-slate-400 shadow-lg overflow-hidden`}>
      {/* Top Bar */}
      <div className={`w-full flex items-center justify-between bg-${color}-800 p-[1px] text-white text-sm`}>
        {activeFile && (
          <div className="flex items-center gap-2">
            <span className={`font-mono text-${color}-300`}>{activeFile.split("/").pop()}</span>
            <button className="text-red-500 hover:text-red-400" onClick={close}>✕</button>
          </div>
        )}
        {input != "" &&
        <div className="w-full flex gap-[1px] justify-end">
          <button className={`flex items-center gap-[1px] bg-${color}-600 px-4 py-[1px] hover:bg-${color}-700`} onClick={handleRun}>
            <Play size={16} /> Run
          </button>
          <button className={`flex items-center gap-[1px] bg-${color}-600 px-4 py-[1px] hover:bg-${color}-700`} onClick={handleSave}>
            <Save size={16} /> Save
          </button>
        </div>
        }
      </div>
      
      {/* Code Editor */}
      <div className="h-full w-full flex bg-zinc-900/95">
        {/* <CodeMirror
          height="200px"
          style={{ width: "100%", maxWidth: "600px" }} 
          value={input}
          extensions={[python()]}
          theme={dracula}
          onChange={(value) => setInput(value)}
          onKeyDown={handleTab}
          className="flex overflow-auto"
        /> */}
        <Editor
          height="98%"
          language="python"
          value={input}
          onChange={(value) => setInput(value)}
          theme={'vs-dark'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </div>


      {/* Save File Modal */}
      {openSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg">Save File</h2>
              <button className="text-gray-400 hover:text-gray-200" onClick={() => setOpenSaveModal(false)}>
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded outline-none"
              placeholder="Enter filename"
            />
            <button
              className="mt-4 w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
              onClick={give_to_save}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default File;