import React, { useEffect, useRef, useState } from "react";
import ACTIONS from "../constants/Actions";
import Navbar from "./Navbar";
import * as monaco from "monaco-editor";
import Modal from "react-modal";
import ThemeDropdown from "./ThemeDropdown";
import CustomInput from "./CustomInput";
import OutputWindow from "./OutputWindow";
import OutputDetails from "./OutputDetails";
import axios from "axios";
import { languageOptions } from "../constants/languageOptions";
import LanguagesDropdown from "./LanguagesDropdown";

const Ide = ({ socketRef, roomId, onCodeChange,UsernName }) => {
  
  const editorRef = useRef(null);
  const [theme, setTheme] = useState("vs-dark");
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [collapse, setCollapse] = useState(false);
  const [language, setLanguage] = useState(languageOptions[0]);
  useEffect(() => {
    async function init() {
     editorRef.current = monaco.editor.create(document.getElementById("realtimeEditor"), {
      theme:theme,
      allowNonTsExtensions: true,
      language:language||"javascript"
     });
     
     console.log(theme)
     console.log(editorRef.current);
     editorRef.current.onDidChangeModelContent((event) => {
      const {changes}=event;
      console.log(changes[0].text); 
      const code = editorRef.current.getValue();
      if(code!==changes[0].text){
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
  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };
  const handleCompile = () => {
    setProcessing(true);

    const formData = {
       language_id: language.id,
      // encode source code in base64
      source_code: btoa(editorRef.current.getValue()),
      stdin: btoa(customInput),
    };
    console.log(formData);
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
            roomId={roomId} editorRef={editorRef} UsernName={UsernName}/>
            <div className="flex flex-row">
              <div className="px-4 py-2">
              <LanguagesDropdown onSelectChange={onSelectChange} />
              </div>
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
        <div className="px-y py-2">
        <button onClick={handleCompile} disabled={processing} className="mt-2 RunCompile">
        {processing ? "Processing..." : "Compile and Execute"}
      </button>
        </div>
      </div>
        <div  id="realtimeEditor"></div>
        <div>
    <div className="Console-area">
      Input-Output-Console
      <div className="split-container">
        <CustomInput customInput={customInput} setCustomInput={setCustomInput} />
        <div className="mid-line"></div>
        <OutputWindow outputDetails={outputDetails} />
      </div>
      {outputDetails && <OutputDetails outputDetails={outputDetails} />}
    </div>
  </div>


    </>
  );
};

export default Ide;
