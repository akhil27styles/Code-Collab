import React from 'react'
import { BrowserRouter ,Routes, Route} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import Home from './pages/Home/Home'
import EditorPage from './pages/EditorPage/EditorPage'
import './App.css'
const App = () => {
  return (
    <>
    <div>
      <Toaster
      position='top-right'
      toastOptions={{
        success:{
          theme:{
            primary:'#4aed8B'
          }
        }
      }}
      ></Toaster>
    </div>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/editor/:roomId" element={<EditorPage/>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App