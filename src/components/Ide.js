import React, { useEffect, useRef, useState } from "react";
import ACTIONS from "../constants/Actions";
import Navbar from "./Navbar";
import * as monaco from "monaco-editor";

import ThemeDropdown from "./ThemeDropdown";
const Ide = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const [theme, setTheme] = useState("vs-dark");
  useEffect(() => {
    async function init() {
     editorRef.current = monaco.editor.create(document.getElementById("realtimeEditor"), {
      theme:theme,
      allowNonTsExtensions: true
     });
     console.log(theme)
     console.log(editorRef.current);
     editorRef.current.onDidChangeModelContent((event) => {
      const {changes}=event;
      console.log(changes[0].text); 
      const code = editorRef.current.getValue();
      if(code!=changes[0].text){
      onCodeChange(code);
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code,
      });
    }
    });

  }
    return () => {
      if (!editorRef.current) {
        init();
      }
    };
  }, []);

  useEffect(() => {
    console.log(socketRef.current);
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
    };
  }, [socketRef.current]);
  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    editorRef.current.updateOptions({ theme:selectedTheme });
    console.log(theme);
    console.log(selectedTheme);
  };

  return (
    <>
           <Navbar  socketRef={socketRef}
            roomId={roomId} editorRef={editorRef}/>
            <div className="flex flex-row">
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
      </div>
        <div  id="realtimeEditor"></div>
    </>
  );
};

export default Ide;
