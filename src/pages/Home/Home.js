import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import i18n from '../../constants/en';
const Home = () => {
  const navigate=useNavigate();
  const [roomId,setRoomid]=useState('');
  const [username,setusername]=useState('');
  const createNewRoom=(e)=>{
   e.preventDefault();
   const id=uuidv4();
   setRoomid(id);
   toast.success('Created a new room');
  };
  const joinRoom=()=>{
    if(!roomId || !username){
      toast.error('ROOM ID & Username is required');
      return;
    }
    //Redirect
    navigate(`/editor/${roomId}`,{
      state:{
        username,
      }
    });
  }
  const handleInputEnter=(e)=>{
    if(e.code==='Enter'){
      joinRoom();
    }
  }
  return (
    <div className='homePageWrapper'>
        <div className='formWrapper'>
            <img src="/" className="homePageLogo" alt="code-collab"/>
            <h4 className='mainLabel'>{i18n.pasteInvitationRoomId}</h4>
            <div className='inputGroup'>
               <input type="text" className='inputBox' 
                placeholder='ROOM ID' 
                onChange={(e)=>setRoomid(e.target.value)} value={roomId}
                onKeyUp={handleInputEnter}
               />
               <input type="text" className='inputBox'
                 placeholder='USERNAME'
                 onChange={(e)=>setusername(e.target.value)}
                 value={username}
                 onKeyUp={handleInputEnter}/>
               <button className='btn joinBtn' onClick={joinRoom}>{i18n.join}</button>
               <span className='createInfo'>{i18n.createNewRoom} &nbsp;
               <a onClick={createNewRoom}  href=""
               className='createNewBtn'>{i18n.newroom}</a>
               </span>
            </div>
        </div>
    </div>
  )
}

export default Home