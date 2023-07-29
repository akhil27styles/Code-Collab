import React,{useEffect, useState,useRef} from 'react'
import Client from '../../components/Client';
import Ide from '../../components/Ide';
import { initSocket } from '../../socket';
import ACTIONS from '../../constants/Actions';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router';
import { toast } from 'react-hot-toast';

const EditorPage = () => {
  const socketRef=useRef(null);
  const location=useLocation();
  const {roomId}=useParams();

  const reactNavigator=useNavigate();
  const [clients, setclients] = useState([]);
  useEffect(()=>{
    const init=async()=>{
      socketRef.current=await initSocket();
      socketRef.current.on('connect_error',(err)=>handleErrors(err));
      socketRef.current.on('connect_failed',(err)=>handleErrors(err));
      
      function handleErrors(e){
        console.log('socket error',e);
        toast.error('Socket connection failed , try again later.');
        reactNavigator('/');
      }
      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username:location.state?.username,
      });

      //listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({clients,username,socketId})=>{
          console.log(username);
          console.log(location.state?.username);
          if(username!==location.state?.username){
            toast.success(`${username} joined the room`);
            console.log(`${username} joined`);
          }
          console.log(clients);
          setclients(clients);
        }
      );
      
      // listening for disconnecting
      socketRef.current.on(
        ACTIONS.DISCONNECTED,({socketId,username})=>{
          toast.success(`${username} left the room`);
          setclients((prev)=>{
            return prev.filter(client=>client.socketId!==socketId);
          })
        }
      );
    }
    init();

    return ()=>{
      //cleaning when component unmount
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
    };
  },[]);


  
  async function copyRoomId() {
    try {
        await navigator.clipboard.writeText(roomId);
        toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
        toast.error('Could not copy the Room ID');
        console.error(err);
    }
}

   if(!location.state){
    return <Navigate to="/" />
   }
  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='logo'>
            <img className='logoImage' src="" alt="logo"/>
          </div>
          <h3>Connected</h3>
          <div className='clientList'>
              {clients.map((client)=>(
                <Client key={client.socketId} username={client.username}/>
              ))}
          </div>
        </div>
        <button className='btn copyBtn' onClick={copyRoomId}>SHARE ROOM INVITE</button>
        <button className='btn leaveBtn'>LEAVE BUTTON</button>
      </div>
      <div className='edtiroWrap'>
        <Ide/>
      </div>
    </div>
  )
}

export default EditorPage