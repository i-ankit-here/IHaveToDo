import React, { useContext, useEffect, useState } from 'react';
import ThemeContext from '../themeContext';
import { useNavigate } from 'react-router-dom';
import getEnvironment from '../../getEnvironment';
import { LayoutGrid } from 'lucide-react';

function Navbar() {
  const { theme, setTheme, user, setUser } = useContext(ThemeContext);
  const [view, setView] = useState(false);
  const path = window.location.pathname;
  const navigate = useNavigate();
  const [show, setShow] = useState("");
  const apiURL = getEnvironment();

  // This effect applies the current theme to the entire app
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme); // Keep theme in sync with local storage
  }, [theme]);

  // Effect to track the current page path
  useEffect(() => {
    setShow(window.location.pathname);
  }, [window.location.pathname]);

  // A single function to toggle the theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const logoutUser = async () => {
    try {
      const response = await fetch(`${apiURL}/api/v1/users/logout`, {
        method: "GET",
        credentials: "include"
      });
      if (response.ok) {
        setUser(null);
        setShow("");
        setView(false);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // Replaced conditional background with a single .themed-bg class
    // Note: The special background for login/register on dark mode is preserved
    <div className={`h-15 ${path === "/" ? " sticky " : " absolute "} top-0 right-1 flex justify-end items-center m-0 themed-bg z-20 ${(show === "/login" || show === "/register") && theme === "dark" ? "!bg-black" : ""}`}>

      <div className="themed-text flex items-center">
        {/* Simplified theme toggle button */}
        <img
          src={theme === "light" ? "/darkTheme.png" : "/lightTheme.png"}
          width="40px"
          height="40px"
          className='rounded-full cursor-pointer'
          alt="Theme toggle"
          onClick={toggleTheme}
        />

        {user ? (
          <div className="px-3 py-1.5 themed-hover-bg rounded-4xl mx-4 flex" onClick={() => { setView(true) }}>
            <img src="/userimg.jpg" width="40px" height="40px" className='rounded-full' alt="User avatar" />
            <img src="/downArraw.svg" className="icon-down-arrow" alt="Down arrow" />
          </div>
        ) : (
          show !== "/login" ? (
            <button type="button" className='w-25 m-1 ml-3 mr-4 text-xl font-serif text-white cursor-pointer rounded-lg p-1 bg-red-500 hover:bg-red-700' onClick={() => navigate("/login")}>
              Sign in
            </button>
          ) : (
            <button type="button" className='w-25 m-1 ml-3 mr-4 text-xl font-serif text-white cursor-pointer rounded-lg p-1 bg-red-500 hover:bg-red-700' onClick={() => navigate("/register")}>
              Sign up
            </button>
          )
        )}
      </div>
      {
        view && user && ( // Added checks for `user` to prevent errors
          <div className="absolute top-15 right-1 h-60 w-60 rounded-md p-3 justify-around flex flex-col gap-3 border-1 themed-bg-secondary themed-border">
            <div className='w-full flex justify-center'>
              <img src={user.avatar ? user.avatar : "/userimg.jpg"} className='h-15 rounded-full' alt="User avatar" />
            </div>
            <div className='w-full flex justify-center'>
              <p className="themed-text font-bold">Hi, {user.firstname}</p>
            </div>
            
            <div className="flex gap-2 justify-start cursor-pointer" onClick={() => { setView(false); navigate("/profile"); }}>
              <img src="/username.svg" alt="" className="icon-profile" />
              <p className="themed-text-secondary">Profile</p>
            </div>
            
            <div className="flex gap-2 justify-start cursor-pointer" onClick={() => { setView(false); navigate("/dashboard"); }}>
              <LayoutGrid className="h-5 w-5 icon-dashboard" />
              <p className="themed-text-secondary">Dashboard</p>
            </div>

            <div className="flex gap-2 justify-start cursor-pointer" onClick={logoutUser}>
              <img src="/logout.svg" alt="" className="icon-logout" />
              <p className="themed-text-secondary">Sign Out</p>
            </div>

            <div className='absolute top-1 right-1 cursor-pointer'>
              <img src="/close.svg" alt="" className="icon-close" onClick={() => { setView(false) }} />
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Navbar;