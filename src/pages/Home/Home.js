import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
            <h4 className='mainLabel'>Paste invitation Room Id</h4>
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
               <button className='btn joinBtn' onClick={joinRoom}>Join</button>
               <span className='createInfo'>If you don't have an invite then create &nbsp;
               <Link onClick={createNewRoom}  className='createNewBtn'>new room</Link>
               </span>
            </div>
        </div>
    </div>
  )
}

export default Home