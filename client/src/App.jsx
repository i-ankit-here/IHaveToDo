import './App.css'
import { useEffect, useState } from "react"
import ThemeContext from './themeContext';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import MajorTodo from './components/majorTodo'
import Register from './components/register';
import Login from './components/login';
import getEnvironment from '../getEnvironment';

function App() {
  const apiURL = getEnvironment();
  const _theme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(_theme ? _theme : "light")
  const [user, setUser] = useState("")

  //fetching the user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${apiURL}/api/v1/users/getUser`, {
          method: "GET",
          credentials: "include"
        })
        if (response.ok) {
          const data = await response.json();
          console.log(response, data);
          setUser(data?.data?.user);
        } else {
          throw new Error("Failed to fetch data")
        }
      } catch (error) {
        console.log("error: ", error);
      }
    }
    fetchUser();
  },[])

  //setting the theme
  useEffect(() => {
    document.body.style.background = theme == "light" ? "white" : "#171616";
  }, [theme])

  // console.log(user);

  return (
    <ThemeContext.Provider value={{theme,setTheme,user:user,setUser}}>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route path="dashboard" element={<MajorTodo />} />
            <Route path='register' element={<Register />} />
            <Route path='login' element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeContext.Provider>
  )
}

export default App
