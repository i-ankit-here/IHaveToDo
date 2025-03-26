import React, { useContext } from 'react'
import ThemeContext from './../themeContext';

function Navbar() {
  const {theme,setTheme} = useContext(ThemeContext)
  console.log(theme)
  return (
    <div className={`w-dvw h-15 absolute top-0 flex justify-end  items-center m-0`}>
      
      <div className={`${theme=="light"?"text-black ":"text-white "} flex items-center`}>
        {theme=="light"?<img src="darkTheme.png" width="40px" height="40px" className='rounded-full cursor-pointer' alt=""
        onClick={()=>{
          localStorage.setItem('theme', 'dark');
          setTheme("dark")
        }}/>
        :<img src="lightTheme.png" width="40px" className='rounded-full cursor-pointer' alt=""
        onClick={()=>{
          localStorage.setItem('theme', 'light');
          setTheme("light")
        }}/>} 

        <div className={`px-3 py-1.5  ${theme=="light"?" hover:bg-neutral-400 ":" hover:bg-neutral-800 "} rounded-4xl mx-4 flex`}>
          <img src="userimg.jpg" width="40px" className='rounded-full' alt=""/>
          <img src="downArraw.svg" className={theme=="light"?"invert":""} alt="" />
          </div> 
        </div>
    </div>
  )
}

export default Navbar
