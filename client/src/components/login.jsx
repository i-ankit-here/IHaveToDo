import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import getEnvironment from '../../getEnvironment';
import ThemeContext from '../themeContext';
import { Form } from 'react-router-dom';

const Login = () => {
    const apiURL = getEnvironment();
    const Navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [theme, setTheme] = useContext(ThemeContext);

    const submit = async (event) => {
        try {
            event.preventDefault();
            const info = document.getElementById("info");
            if (!password || !username) {
                info.style.color = "red";
                info.innerText = "username and password are necessary";
                return;
            }
            const formData = {
                username: username,
                password: password
            }
            console.log(formData)
            const response = await fetch(`${apiURL}/api/v1/users/login`, {
                method: 'POST',
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await response.json();
            console.log(data);
            if (data.success) Navigate("/dashboard");
            else {
                info.style.color = "red";
                info.innerText = data.message;
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className={`w-full h-dvh flex justify-center items-center ${theme == "light" ? " bg-white " : " bg-black "}`}>
            <form id="form" onSubmit={submit} className={`rounded-md h-min w-[90dvw] md:w-80 p-8  ${theme == "light" ? " bg-gray-300 " : " bg-neutral-800 "}`}>
                <div className='flex w-full flex-col gap-8 items-center'>
                    <div><p className={`text-4xl font-bold ${theme == "light" ? " text-black " : " text-white "} `}>Sign In</p></div>

                    <div className='flex w-full'>
                        <img src="public/username.svg" alt="" className='p-1 border-2 border-gray-300 bg-white' />
                        <input name="username" type="text" placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value) }} className='p-1 border-2 border-gray-300 bg-white w-full rounded-r-sm' />
                    </div>
                    <div className='flex w-full'>
                        <img src="public/pass.svg" alt="" className='p-1 border-2 border-gray-300 bg-white' />
                        <input name='password' type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} className='p-1 border-2 border-gray-300 bg-white w-full rounded-r-sm' />
                    </div>
                    <div className='flex-col w-full justify-center items-center'>
                        <button type='submit' className='bg-gray-200 rounded-full hover:bg-gray-400 p-2 w-full'>Sign In</button>
                        <div><p id="info" className='text-center' ></p></div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login