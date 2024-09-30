import './App.css'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/nav/Nav.jsx'
import Home from './pages/homepage/Homepage.jsx'
import Subjects from './pages/subjects/Subjects.jsx'
import Profile from './pages/profile/Profile.jsx'
import Challenge from './pages/challenge/Challenge.jsx'


function App() {
  
  return (
    <>
      <Nav />
      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/subjects" element={<Subjects />} />
         <Route path="/profile" element={<Profile/>} />
         <Route path="/challenge" element={<Challenge/>} />
      </Routes>
    </>
  )
}

export default App
