import React,{useEffect} from 'react';
import './Modal.css';
import ACTIONS from '../constants/Actions';
const Modal = ({ modalOpen,setmodalOpen,socketRef,roomId }) => {
    useEffect(()=>{
        if(socketRef.current){
            socketRef.current.on(ACTIONS.WHITE_BOARD_OPENED,({modalOpen,roomId})=>{
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
    const handleClose=()=>{
       setmodalOpen(false);
       socketRef.current.emit(ACTIONS.CLOSE_WHITE_BOARD,{modalOpen,roomId});
    }
  return (
    <div className={`modalBackground active`}>
      <div className={`modalContainer active`}>
        <div className='titleCloseBtn'>
          <button
            onClick={handleClose}
          >
            Close
          </button>
        </div>
        <div className='title'>
          <h1>WhiteBoard</h1>
        </div>
        {/* Add your WhiteBoard content here */}
      </div>
    </div>
  );
};

export default Modal;
