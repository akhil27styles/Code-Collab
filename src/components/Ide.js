import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import "react-codemirror/node_modules/codemirror/mode/javascript/javascript";
import "react-codemirror/node_modules/codemirror/mode/css/css";
import "react-codemirror/node_modules/codemirror/addon/hint/show-hint";
import "react-codemirror/node_modules/codemirror/addon/hint/javascript-hint";
import "react-codemirror/node_modules/codemirror/theme/monokai.css";

import { javascript } from "@codemirror/lang-javascript";
import { autocompletion } from "@codemirror/autocomplete";
const languageModes = [
  { name: "javascript", json: true },
  { name: "python", version: 3 },
  { name: "ruby" },
];

//To be refactored & changed
function myCompletions(context) {
  let word = context.matchBefore(/\w*/);
  if (word.from === word.to && !context.explicit) return null;

  const doc = context.state.doc;
  const pos = word.from;

  const jsState = javascript.languageData
    .of({})
    .getState(doc.sliceString(0, pos));
  const completions = javascript.completionSpec.completeAt(jsState, pos);

  return {
    from: word.from,
    options: completions,
  };
}

const Ide = () => {
  const [code, setCode] = useState("//:code");
  const [themeDark, setThemeDark] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const updateCode = (newCode) => {
    setCode(newCode);
  };

  useEffect(() => {
    console.log(themeDark);
  }, [themeDark]);

  return (
    <div className={`${themeDark ? "dark" : ""}`}>
      <div
        style={{
          alignItems: "center",
          display: "grid",
          gridAutoFlow: "column",
          justifyContent: "space-evenly",
        }}
      >
        <div>
          <label htmlFor="language">Select Language:</label>
          <select
            id="language"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {languageModes.map((mode) => (
              <option key={mode.name} value={mode.name}>
                {mode.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ alignItems: "center", display: "flex" }}>
          <input
            type="checkbox"
            class="checkbox"
            id="checkbox"
            onClick={() => {
              setThemeDark(!themeDark);
            }}
          />
          <label for="checkbox" class="checkbox-label">
            <i class="fas fa-moon"></i>
            <i class="fas fa-sun"></i>
            <span class="ball"></span>
          </label>
          <h1>Light/Dark Toggle Button</h1>
        </div>
      </div>
      <CodeMirror
        onChange={() => updateCode(code)}
        value={code}
        theme={themeDark ? "dark" : "light"}
        height={20 * 16}
        options={{
          viewportMargin: 20,
          lineWrapping: true, // Enable text wrapping
          theme: "monokai",
          keyMap: "sublime",
          mode: selectedLanguage,
          lineNumbers: true,
          extraKeys: {
            "Ctrl-Space": "autocomplete",
          },
        }}
        extensions={[autocompletion({ override: [myCompletions] })]}
      />
    </div>
  );
};

export default Ide;
