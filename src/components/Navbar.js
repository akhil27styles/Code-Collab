import React,{useState,useEffect } from 'react'
import ACTIONS from '../constants/Actions';
import i18n from '../constants/en';
import { toast } from "react-hot-toast";
import {useNavigate} from "react-router";
import Modal from './Modal';
const Navbar = ({socketRef,roomId, editorRef,UsernName}) => {
  const [modalOpen, setmodalOpen] = useState(false);
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
  const handleModal=()=>{
    socketRef.current.emit(ACTIONS.OPEN_WHITE_BOARD, {modalOpen:true,roomId});
    setmodalOpen(true); 
  }
  useEffect(()=>{
    if(socketRef.current){
        socketRef.current.on(ACTIONS.WHITE_BOARD_OPENED,({modalOpen,roomId})=>{
            console.log('NAVBAR',roomId,modalOpen);
             if(roomId===roomId){
                setmodalOpen(modalOpen);
             }
        });
      }
        return ()=>{
          if(socketRef.current){
            socketRef.current.off(ACTIONS.WHITE_BOARD_OPENED);
          }
        };
},[socketRef.current,modalOpen])
  return (
    <>
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
         <button
           className='openModal'
            onClick={handleModal}>
           WhiteBoard
       </button>
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
               {modalOpen && <Modal modalOpen={modalOpen}  setmodalOpen={setmodalOpen} socketRef={socketRef} roomId={roomId}/>}
    </>
  );
}

export default Navbar