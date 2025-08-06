import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { dracula } from "@uiw/codemirror-theme-dracula";

const PythonEditor = () => {
  const [code, setCode] = useState("print('Hello, ESP32!')");

  return (
    <div>
      <h2>Python Code Editor</h2>
      <CodeMirror
        value={code}
        height="300px"
        extensions={[python()]}
        theme={dracula}
        onChange={(value) => setCode(value)}
      />
      <p>Current Code:</p>
      <pre>{code}</pre>
    </div>
  );
};

export default PythonEditor;
