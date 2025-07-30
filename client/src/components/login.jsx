import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import getEnvironment from '../../getEnvironment';
import ThemeContext from '../themeContext';
import { useSearchParams } from 'react-router-dom';


const Login = () => {
    const apiURL = getEnvironment();
    const Navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showSlider,setShowSlider] = useState(false)

    const {theme, setTheme,user,setUser} = useContext(ThemeContext);
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect");

    const submit = async (event) => {
        try {
            setShowSlider(true);
            event.preventDefault();
            const info = document.getElementById("info");
            if (!password || !username) {
                setShowSlider(false);
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
                body: JSON.stringify(formData),
                credentials:"include"
            })
            const data = await response.json();
            console.log(data);
            if (data.success) {
                setShowSlider(false);
                setUser(data?.data?.user);
                info.style.color = theme=="light"?"green":"chartreuse";
                info.innerText = "User logged in successfully "
                if(redirect)Navigate(`/${redirect}`);
                else Navigate("/dashboard");
            }
            else {
                setShowSlider(false);
                info.style.color = "red";
                info.innerText = data.message;
                return;
            }
        } catch (error) {
            setShowSlider(false);
            console.log(error);
        }
        setShowSlider(false);
    }
    return (
        <div className={`w-full h-dvh flex justify-center items-center ${theme == "light" ? " bg-white " : " bg-black "}`}>
            <form id="form" onSubmit={submit} className={`relative rounded-md h-min w-[90dvw] md:w-100 p-8 overflow-hidden  ${theme == "light" ? " bg-gray-300 shadow-2xl " : " bg-neutral-800 "}`}>
                <div className='flex w-full flex-col gap-8 items-center'>
                    <div><p className={`text-4xl font-bold ${theme == "light" ? " text-black " : " text-white "} `}>Sign In</p></div>

                    <div className='flex w-full'>
                        <img src="username.svg" alt="" className={`p-1 bg-transparent h-10 ${theme == "light" ? "  " : " invert-100 "}`} />
                        <input name="username" type="text" placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value) }} className='p-1 border-2 border-gray-700 bg-white w-full rounded-sm h-10' />
                    </div>
                    <div className='flex w-full'>
                        <img src="pass.svg" alt="" className={`p-1 bg-transparent h-10 ${theme == "light" ? "  " : " invert-100 "}`} />
                        <input name='password' type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} className='p-1 border-2 border-gray-700 bg-white w-full rounded-sm h-10' />
                    </div>
                    <div className='flex-col w-full justify-center items-center'>
                        <button type='submit' disabled={showSlider} className='bg-gray-50 rounded-sm shadow-2xl hover:bg-gray-200 hover:shadow-2xl p-2 w-full font-medium'>Sign In</button>
                        <div><p id="info" className='text-center text-md mt-1 pt-1' ></p></div>
                    </div>
                </div>
                <div className={`absolute bottom-0 left-0 h-1 bg-blue-500 w-30 slider ${showSlider?"block":"hidden"}`} ></div>
            </form>
        </div>
    )
}

export default Login