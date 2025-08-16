import React, { useContext, useEffect, useState } from 'react'
import ThemeContext from '../themeContext';
import { useNavigate } from 'react-router-dom';
import getEnvironment from '../../getEnvironment';

function Navbar() {
  const { theme, setTheme, user, setUser } = useContext(ThemeContext)
  const [view, setView] = useState(false);
  const path = window.location.pathname;
  const navigate = useNavigate();
  const [show,setShow] = useState("");
  const apiURL = getEnvironment();

  useEffect(()=>{
    setShow(window.location.pathname);
  },[window.location.pathname])

  const logoutUser = async()=>{
    try {
      const response = await fetch(`${apiURL}/api/v1/users/logout`,{
        method:"GET",
        credentials:"include"
      });
      if(response.ok){
        setUser(null);
        setShow("");
        setView(false);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className={`h-15 ${path === "/" ? " sticky " : " absolute "} top-0 right-1 flex justify-end items-center m-0 ${theme == "light" ? "bg-white" : (show=="/login" || show=="/register")?"bg-black":"bg-grey"} z-20 `}>

      <div className={`${theme == "light" ? "text-black " : "text-white "} flex items-center`}>
        {theme == "light" ? <img src="/darkTheme.png" width="40px" height="40px" className='rounded-full cursor-pointer' alt=""
          onClick={() => {
            localStorage.setItem('theme', 'dark');
            setTheme("dark")
          }} />
          : <img src="/lightTheme.png" width="40px" height="40px" className='rounded-full cursor-pointer' alt=""
            onClick={() => {
              localStorage.setItem('theme', 'light');
              setTheme("light")
            }} />}

        {user ?
          <div className={`px-3 py-1.5  ${theme == "light" ? " hover:bg-neutral-400 " : " hover:bg-neutral-800 "} rounded-4xl mx-4 flex`}
            onClick={() => { setView(true) }}
          >
            <img src="/userimg.jpg" width="40px" height="40px" className='rounded-full' alt="" />
            <img src="/downArraw.svg" className={theme == "light" ? "invert" : ""} alt="" />
          </div>
          :
          show != "/login"?
          <button type="button" className='w-25 m-1 ml-3 mr-4 text-xl font-serif text-white cursor-pointer rounded-lg p-1 bg-red-500 hover:bg-red-700'
            onClick={(e) => {
              navigate("/login");
            }}>
            Sign in
          </button>
          :<button type="button" className='w-25 m-1 ml-3 mr-4 text-xl font-serif text-white cursor-pointer rounded-lg p-1 bg-red-500 hover:bg-red-700'
          onClick={(e) => {
            e.stopPropagation();
            navigate("/register");
          }}>
          Sign up
        </button>
        }
      </div>
      {
        view == true ? <div className={`absolute top-15 right-1 h-60 w-60 rounded-md p-3 justify-around flex flex-col gap-3 border-1 ${theme == "light" ? "bg-gray-100 border-gray-500" : "bg-neutral-700 border-neutral-400"}`}>
          <div className='w-full flex justify-center'>
            <img src={user && user.avatar ? user.avatar : "/userimg.jpg"} className='h-15 rounded-full' alt="" />
          </div>
          <div className='w-full flex justify-center'>
            <p className={`${theme == "light" ? "text-black " : "text-gray-300 "} font-bold`}>Hi, {user.firstname}</p>
          </div>
          <div className={`flex gap-2 justify-start cursor-pointer`} onClick={(e)=>{
            e.stopPropagation();
            setView(false)
            navigate("/profile");
          }}>
            <img src="/username.svg" alt="" className={`${theme == "light" ? "invert-40 " : "invert-100 "}`} />
            <p className={`${theme == "light" ? "text-black " : "text-gray-300 "}`}>Profile</p>
          </div>
          <div className={`flex gap-2 justify-start cursor-pointer`}
          onClick={(e)=>{
            logoutUser();            
          }}
          >
            <img src="/logout.svg" alt="" className={`${theme == "light" ? "invert-60 " : "invert-20 "}`} />
            <p className={`${theme == "light" ? "text-black " : "text-gray-300 "}`}>Sign Out</p>
          </div>
          <div className='absolute top-1 right-1'>
            <img src="/close.svg" alt="" className={`${theme == "light" ? "invert-100 " : "invert-100 "}`} onClick={() => { setView(false) }} />
          </div>
        </div> : ""
      }
    </div>
  )
}

export default Navbar
