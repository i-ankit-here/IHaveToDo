import './App.css'
import {useEffect, useState} from "react"
import ThemeContext from './themeContext';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import MajorTodo from './components/majorTodo'
import Register from './components/register';
import Login from './components/login';

function App() {

  const _theme = localStorage.getItem('theme');
  const [theme,setTheme] = useState(_theme?_theme:"light")
  useEffect(()=>{
    document.body.style.background = theme == "light"?"white":"#171616";
  },[theme])
  return (
    <ThemeContext.Provider value={[theme,setTheme]}>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path='/'>
          <Route path="dashboard" element = {<MajorTodo/>}/>
          <Route path='register' element = {<Register/>}/>
          <Route path='login' element = {<Login/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeContext.Provider>
  )
}

export default App
