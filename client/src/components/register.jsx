import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import getEnvironment from '../../getEnvironment';
import ThemeContext from '../themeContext';

const Register = () => {
    const apiURL = getEnvironment();
    const Navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [theme, setTheme] = useContext(ThemeContext);

    const submit = async (event) => {
        try {
            event.preventDefault();
            const info = document.getElementById("info");
            if (repeatPassword != password) {
                info.style.color = "red";
                info.innerText = "Password and Confirm password are different";
                return;
            }
            const formData = new FormData(document.getElementById("form"));
            const response = await fetch(`${apiURL}/api/v1/users/register`, {
                method: 'POST',
                // credentials: 'include',
                body: formData
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
            <form id="form" onSubmit={submit} className={`rounded-md h-[70dvh] p-8  ${theme == "light" ? " bg-gray-300 " : " bg-neutral-800 "}`}>
                <div className='flex w-full flex-col gap-8 items-center'>
                    <div><p className={`text-4xl font-bold ${theme == "light" ? " text-black " : " text-white "} `}>Register</p></div>
                    <div className='flex gap-1 w-full'>
                        <div className='flex'>
                            <img src="public/username.svg" alt="" className='p-1 border-2 border-gray-400 bg-white' />
                            <input name='firstname' type="text" placeholder='First Name' value={firstName} onChange={(e) => { setFirstName(e.target.value) }} className='p-1 border-2 border-gray-400 bg-white rounded-r-sm' />
                        </div>
                        <div className='flex'>
                            <img src="public/username.svg" alt="" className='p-1 border-2 border-gray-400 bg-white' />
                            <input name='lastname' type="text" placeholder='Last Name' value={lastName} onChange={(e) => { setLastName(e.target.value) }} className='p-1 border-2 border-gray-400 bg-white rounded-r-sm' />
                        </div>
                    </div>
                    <div className='flex w-full'>
                        <img src="public/mail.svg" alt="" className='p-1 border-2 border-gray-400 bg-white' />
                        <input name='email' type="email" placeholder='Email' value={email} onChange={(e) => { setEmail(e.target.value) }} className='p-1 border-2 border-gray-400 bg-white w-full rounded-r-sm' />
                    </div>
                    <div className='flex gap-0 w-full'>
                        <img src="public/username.svg" alt="" className='p-1 border-2 border-gray-400 bg-white' />
                        <input name="username" type="text" placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value) }} className='p-1 border-2 border-gray-400 bg-white w-full rounded-r-sm' />
                    </div>
                    <div className='flex w-full'>
                        <img src="public/pass.svg" alt="" className='p-1 border-2 border-gray-400 bg-white' />
                        <input name='password' type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} className='p-1 border-2 border-gray-400 bg-white w-full rounded-r-sm' />
                    </div>
                    <div className='flex w-full'>
                        <img src="public/pass.svg" alt="" className='p-1 border-2 border-gray-400 bg-white' />
                        <input name="repeatPassword" type="password" placeholder="Confirm password" value={repeatPassword} onChange={(e) => { setRepeatPassword(e.target.value) }} className='p-1 border-2 border-gray-400 bg-white w-full rounded-r-sm' />
                    </div>
                    <div className='flex-col w-full justify-center items-center'>
                        <button type='submit' className='bg-gray-200 rounded-full hover:bg-gray-400 p-2 w-full border-2 border-gray-500 '>Register</button>
                        <div><p id="info" className='text-center' ></p></div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Register