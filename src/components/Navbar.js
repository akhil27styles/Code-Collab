import React from 'react'
import ACTIONS from '../constants/Actions';
import i18n from '../constants/en';
import { toast } from "react-hot-toast";
import {useNavigate} from "react-router";
const Navbar = ({socketRef,roomId, editorRef,UsernName}) => {
  const reactNavigator = useNavigate();
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        editorRef.current.setValue(fileContent);
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code: fileContent,
        });
      };
      reader.readAsText(file);
    }
  };
  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }
  function leaveRoom() {
    reactNavigator("/");
  }
  return (
    <>
      {/* This example requires Tailwind CSS v2.0+ */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 ">
          <div className="flex justify-between items-center border-b-2 border-gray-100 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
            <div className="m-2 px-2 py-1 ">
        <label className="custom-file-input">
          <input type="file"  onChange={handleFileUpload}/>
          Upload a File
        </label>
        </div>
        <div className="m-2 px-2 py-1 ">
        <label className="custom-file-input">
          <input type="file"  />
          WhiteBoard
        </label>
      </div>
      <div className="m-2 px-2 py-1 ">
      <button className="custom-file-input" onClick={copyRoomId}>
              {i18n.shareRoomInvite}
            </button>
      </div>
      <div className="m-2 px-2 py-1 ">
      <button className="custom-file-input" onClick={leaveRoom}>
              {i18n.leaveButton}
            </button>
      </div>
      <div className='m-2 px-2 py-1'>
     <span>Welcome {UsernName}</span>
      </div>
            </div>
               </div>
               </div>
               </div>
    </>
  );
}

export default Navbar