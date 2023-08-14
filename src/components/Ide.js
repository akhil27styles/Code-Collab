import React, { useEffect, useRef, useState } from "react";
import ACTIONS from "../constants/Actions";
import Navbar from "./Navbar";
import * as monaco from "monaco-editor";

import ThemeDropdown from "./ThemeDropdown";
import { javascript } from "@codemirror/lang-javascript";
import CustomInput from "./CustomInput";
import OutputWindow from "./OutputWindow";
import OutputDetails from "./OutputDetails";
import { classnames } from "./utils/general";
import axios from "axios";

const Ide = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const [theme, setTheme] = useState("vs-dark");
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    async function init() {
     editorRef.current = monaco.editor.create(document.getElementById("realtimeEditor"), {
      theme:theme,
      allowNonTsExtensions: true,
      languages:javascript
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
  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      // language_id: language.id,
      // encode source code in base64
      source_code: btoa(editorRef.current.getValue()),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);
        }
        setProcessing(false);
        console.log("catch block...", error);
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;
console.log(response);
      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
    }
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
        <div className="right-container flex flex-shrink-0 w-[30%] flex-row">
  <div className="flex flex-col space-y-2 mt-4">
    <div
      className="cursor-pointer bg-gray-200 p-2 rounded-md"
      onClick={() => setCollapse(!collapse)}
    >
      {collapse ? "Expand" : "Collapse"}
    </div>
    <div
      className={`transition-all max-h-0 overflow-hidden flex flex-row  ${collapse ? "max-h-[500px]" : ""}`}
    >
      <CustomInput
        customInput={customInput}
        setCustomInput={setCustomInput}
      />
    <OutputWindow outputDetails={outputDetails} />
     {outputDetails && <OutputDetails outputDetails={outputDetails} />}
     <button
        onClick={handleCompile}
        disabled={processing}
        className="mt-2"
      >
        {processing ? "Processing..." : "Compile and Execute"}
      </button>
       </div>
      </div>
    </div>
    </>
  );
};

export default Ide;
