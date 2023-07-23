import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import  './Home.css'

const Home = () => {
  const [roomId,setRoomid]=useState('');
  const [username,setusername]=useState('');
  const createNewRoom=(e)=>{
   e.preventDefault();
   const id=uuidv4();
   console.log(id);
   setRoomid(id);
  }
  return (
    <div className='homePageWrapper'>
        <div className='formWrapper'>
            <img src="/" className="homePageLogo" alt="code-collab"/>
            <h4 className='mainLabel'>Paste invitation Room Id</h4>
            <div className='inputGroup'>
               <input type="text" className='inputBox' placeholder='ROOM ID' onChange={(e)=>setRoomid(e.target.value)} value={roomId}/>
               <input type="text" className='inputBox' placeholder='USERNAME' onChange={(e)=>setusername(e.target.value)} value={username}/>
               <button className='btn joinBtn'>Join</button>
               <span className='createInfo'>If you don't have an invite then create &nbsp;
               <a onClick={createNewRoom} href="#" className='createNewBtn'>new room</a>
               </span>
            </div>
        </div>
    </div>
  )
}

export default Home