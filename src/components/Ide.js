import React, { useEffect, useRef, useState } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../constants/Actions';

const Ide = ({ socketRef, roomId }) => {
  const [editor, setEditor] = useState(null);
  const [receivedCode, setReceivedCode] = useState(null); // Separate variable for received code

  useEffect(() => {
    async function init() {
      const newEditor = Codemirror.fromTextArea(
        document.getElementById('realtimeEditor'),
        {
          mode: { name: 'javascript', json: true },
          theme: 'dracula',
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
      setEditor(newEditor);
    }
    init();
  }, []);

  useEffect(() => {
    if (editor) {
      editor.on('change', (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue(); // Getting all the code
        if (origin !== 'setValue') {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
          console.log(code); // Here you should see the code on the console
        }
      });
    }
  }, [editor]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code != null) {
          console.log(code); // Here you should see the code on the console
          console.log(editor); // Here you should see the editor instance on the console
          setReceivedCode(code); // Store the received code in the separate state variable
        }
      });
    }
  }, [socketRef.current]);

  // Update the editor value when receivedCode changes
  useEffect(() => {
    if (editor && receivedCode !== null) {
      editor.setValue(receivedCode);
    }
  }, [editor, receivedCode]);

  return <textarea id="realtimeEditor"></textarea>;
};

export default Ide;
