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
    const [showSlider, setShowSlider] = useState(false);

    const { theme, setTheme } = useContext(ThemeContext);

    const submit = async (event) => {
        try {
            setShowSlider(true);
            event.preventDefault();
            const info = document.getElementById("info");

            if (repeatPassword !== password) {
                setShowSlider(false);
                info.style.color = "red";
                info.innerText = "Password and Confirm password are different";
                return;
            }

            const formData = {
                username,
                password,
                firstname: firstName,
                lastname: lastName,
                email
            };

            const response = await fetch(`${apiURL}/api/v1/users/register`, {
                method: 'POST',
                headers: { "Content-type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setShowSlider(false);
                info.style.color = theme === "light" ? "green" : "chartreuse";
                info.innerText = "Registration successful!";
                Navigate("/dashboard");
            } else {
                setShowSlider(false);
                info.style.color = "red";
                info.innerText = data.message || "Registration failed";
            }
        } catch (error) {
            setShowSlider(false);
            console.log(error);
        }
    };

    return (
        <div className={`w-full h-dvh flex justify-center items-center ${theme === "light" ? "bg-white" : "bg-black"}`}>
            <form id="form" onSubmit={submit} className={`relative rounded-md w-[90dvw] md:w-120 p-8 overflow-hidden ${theme === "light" ? "bg-gray-300 shadow-2xl" : "bg-neutral-800"}`}>
                <div className='flex w-full flex-col gap-8 items-center'>
                    <div>
                        <p className={`text-4xl font-bold ${theme === "light" ? "text-black" : "text-white"}`}>Register</p>
                    </div>

                    {/* First and Last Name */}
                    <div className='flex gap-2 w-full'>
                        <div className='flex w-1/2'>
                            <img src="username.svg" alt="" className={`p-1 h-10 ${theme === "light" ? "" : "invert"}`} />
                            <input name='firstname' type="text" placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} className='p-1 border-2 border-gray-700 bg-white w-full rounded-sm h-10' />
                        </div>
                        <div className='flex w-1/2'>
                            <img src="username.svg" alt="" className={`p-1 h-10 ${theme === "light" ? "" : "invert"}`} />
                            <input name='lastname' type="text" placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} className='p-1 border-2 border-gray-700 bg-white w-full rounded-sm h-10' />
                        </div>
                    </div>

                    {/* Email */}
                    <div className='flex w-full'>
                        <img src="mail.svg" alt="" className={`p-1 h-10 ${theme === "light" ? "" : "invert"}`} />
                        <input name='email' type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className='p-1 border-2 border-gray-700 bg-white w-full rounded-sm h-10' />
                    </div>

                    {/* Username */}
                    <div className='flex w-full'>
                        <img src="username.svg" alt="" className={`p-1 h-10 ${theme === "light" ? "" : "invert"}`} />
                        <input name="username" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className='p-1 border-2 border-gray-700 bg-white w-full rounded-sm h-10' />
                    </div>

                    {/* Password */}
                    <div className='flex w-full'>
                        <img src="pass.svg" alt="" className={`p-1 h-10 ${theme === "light" ? "" : "invert"}`} />
                        <input name='password' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className='p-1 border-2 border-gray-700 bg-white w-full rounded-sm h-10' />
                    </div>

                    {/* Confirm Password */}
                    <div className='flex w-full'>
                        <img src="pass.svg" alt="" className={`p-1 h-10 ${theme === "light" ? "" : "invert"}`} />
                        <input name="repeatPassword" type="password" placeholder="Confirm Password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} className='p-1 border-2 border-gray-700 bg-white w-full rounded-sm h-10' />
                    </div>

                    {/* Submit Button */}
                    <div className='flex-col w-full justify-center items-center'>
                        <button type='submit' disabled={showSlider} className='bg-gray-50 rounded-sm shadow-2xl hover:bg-gray-200 hover:shadow-2xl p-2 w-full font-medium'>Register</button>
                        <div><p id="info" className='text-center text-md mt-1 pt-1'></p></div>
                    </div>
                </div>

                {/* Loading Slider */}
                <div className={`absolute bottom-0 left-0 h-1 bg-blue-500 w-30 slider ${showSlider ? "block animate-pulse" : "hidden"}`}></div>
            </form>
        </div>
    )
}

export default Register
