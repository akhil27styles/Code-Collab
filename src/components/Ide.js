import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import 'react-codemirror/node_modules/codemirror/mode/javascript/javascript';
import 'react-codemirror/node_modules/codemirror/mode/css/css';
import 'react-codemirror/node_modules/codemirror/addon/hint/show-hint';
import 'react-codemirror/node_modules/codemirror/addon/hint/javascript-hint';
import 'react-codemirror/node_modules/codemirror/theme/monokai.css';
const languageModes = [
  { name: 'javascript', json: true },
  { name: 'python', version: 3 },
  { name: 'ruby' },
];

const Ide = () => {
  const [code, setCode] = useState('//:code');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const updateCode = (newCode) => {
    setCode(newCode);
  };

  return (
    <div>
      <div>
        <label htmlFor="language">Select Language:</label>
        <select id="language" value={selectedLanguage} onChange={handleLanguageChange}>
          {languageModes.map((mode) => (
            <option key={mode.name} value={mode.name}>
              {mode.name}
            </option>
          ))}
        </select>
      </div>
      <CodeMirror
        onChange={() => updateCode(code)}
        value={code}
        options={{
          theme: 'monokai',
          keyMap: 'sublime',
          mode: selectedLanguage, 
          lineNumbers: true,
          extraKeys: {
            'Ctrl-Space': 'autocomplete',
          },
        }}
      />
    </div>
  );
};

export default Ide;
