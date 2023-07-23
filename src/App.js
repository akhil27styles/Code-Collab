import React from 'react'
import { BrowserRouter ,Routes, Route} from 'react-router-dom'
import Home from './pages/Home/Home'
import EditorPage from './pages/EditorPage'
import './App.css'
const App = () => {
  return (
    <>
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