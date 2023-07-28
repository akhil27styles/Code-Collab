import React,{useState} from 'react'
import Client from '../../components/Client';
import Ide from '../../components/Ide';


const EditorPage = () => {
  const [clients, setclients] = useState([
    {socketId:1,username:'Akhil'},
    {socketId:2,username:'Akhil'}]);
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
        <button className='btn copyBtn'>COPY ROOM ID</button>
        <button className='btn leaveBtn'>LEAVE BUTTON</button>
      </div>
      <div className='edtiroWrap'>
        <Ide/>
      </div>
    </div>
  )
}

export default EditorPage