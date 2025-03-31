import React, { useContext } from 'react'
import ThemeContext from './../themeContext';

function Navbar() {
  const {theme,setTheme} = useContext(ThemeContext)
  const path = window.location.pathname;
  console.log(theme)
  return (
    <div className={`h-15 ${path==="/"?" sticky ":" absolute "} top-0 right-1 flex justify-end items-center m-0 ${theme=="light"?"bg-white":"bg-grey"} z-20 `}>
      
      <div className={`${theme=="light"?"text-black ":"text-white "} flex items-center`}>
        {theme=="light"?<img src="/darkTheme.png" width="40px" height="40px" className='rounded-full cursor-pointer' alt=""
        onClick={()=>{
          localStorage.setItem('theme', 'dark');
          setTheme("dark")
        }}/>
        :<img src="/lightTheme.png" width="40px" height="40px" className='rounded-full cursor-pointer' alt=""
        onClick={()=>{
          localStorage.setItem('theme', 'light');
          setTheme("light")
        }}/>} 

        <div className={`px-3 py-1.5  ${theme=="light"?" hover:bg-neutral-400 ":" hover:bg-neutral-800 "} rounded-4xl mx-4 flex`}>
          <img src="/userimg.jpg" width="40px" height="40px" className='rounded-full' alt=""/>
          <img src="/downArraw.svg" className={theme=="light"?"invert":""} alt="" />
          </div> 
        </div>
    </div>
  )
}

export default Navbar
