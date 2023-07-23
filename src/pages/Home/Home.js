import React from 'react'
import  './Home.css'
const Home = () => {
  return (
    <div className='homePageWrapper'>
        <div className='formWrapper'>
            <img src="/" className="homePageLogo" alt="code-collab"/>
            <h4 className='mainLabel'>Paste invitation Room Id</h4>
            <div className='inputGroup'>
               <input type="text" className='inputBox' placeholder='ROOM ID'/>
               <input type="text" className='inputBox' placeholder='USERNAME'/>
               <button className='btn joinBtn'>Join</button>
               <span className='createInfo'>If you don't have an invite then create &nbsp;
               <a href="" className='createNewBtn'>new room</a>
               </span>
            </div>
        </div>
    </div>
  )
}

export default Home