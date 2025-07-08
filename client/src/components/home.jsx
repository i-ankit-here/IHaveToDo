import React, { useContext, useEffect, useState } from 'react'
import ThemeContext from '../themeContext'
import { useNavigate } from 'react-router-dom';
import getEnvironment from '../../getEnvironment';
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
    const { theme } = useContext(ThemeContext);

    const [imageSrc, setImageSrc] = useState("/Categories.png");
    const [image, setImage] = useState("hidden");
    const apiURL = getEnvironment();
    const navigate = useNavigate();



    return (
        <div>
            <div className=' w-50 sticky mt-[-44px] top-4 pl-10 z-20'>
                <img src="/iHaveToDo.svg" alt="" className={`${theme == "light" ? "invert-100" : ""} w-full`} />
            </div>
            {theme == "light" && <div className='-z-10 absolute top-20 left-15 bg-blue-100 rotate-10 w-[90dvw] h-[80dvh]'></div>}
            {theme == "light" && <div className='-z-10 absolute top-24 left-10 bg-blue-100 -rotate-6 w-[90dvw] h-[80dvh]'></div>}
            <div className='w-full p-2 h-[100dvh] items-center flex gap-2 mb-32'>
                <div className='ml-25 p-10 h-[80dvh] w-[49dvw] flex flex-col justify-center'>
                    <p className={`text-6xl font-serif ${theme == 'light' ? "text-black" : "text-white"}`}>Organize your</p>
                    <p className={`text-6xl font-serif ${theme == 'light' ? "text-black" : "text-white"}`}>work and </p>
                    <p className={`text-6xl font-serif ${theme == 'light' ? "text-black" : "text-white"}`}>tasks easily</p>
                    <button type="button" className='w-40 mt-15 text-2xl font-serif text-white cursor-pointer rounded-lg p-3 bg-red-500 hover:bg-red-700'
                        onClick={(e) => {
                            navigate("/register");
                        }}
                    >Get Started</button>
                </div>
                <div className='mr-30 pt-5 pl-5 pr-5 bg-orange-200 rounded-xl'>
                    <img src="/dashboard.png" alt="" className='w-[70dvw] rounded-sm ' />
                </div>
            </div>

            <div className={`text-4xl font-serif text-center ${theme == "light" ? " text-black " : " text-white "}`}>Welcome to iHaveToDo – <span className=' italic '>Organize your life, one task at a time!</span></div>

            <div className='w-full p-2 flex gap-10 mt-32'>
                <div className='pl-20 h-fit flex flex-col w-full'>
                    <div className='p-10 h-[100dvh] flex items-center w-full relative'>
                        {theme == "light" && <div className='-z-10 mt-20 absolute top-0 -left-8 bg-green-400 rotate-4 w-[93dvw] h-[80dvh]'></div>}
                        {theme == "light" && <div className='-z-10 mt-20 absolute top-4 -left-8 bg-green-400 -rotate-6 w-[93dvw] h-[80dvh]'></div>}
                        <div className='p-10 h-[100dvh] w-[50dvw] flex flex-col justify-center'>
                            <h1 className={`text-5xl font-serif ${theme == 'light' ? "text-black" : " text-white "} font-semibold`}>Task Categorization</h1>
                            <p className={`mt-15 ml-2 text-2xl font-serif ${theme == 'light' ? "text-black" : " text-white "}`}>Organize todos into categories like </p>
                            <p className={`ml-2 mt-1 text-2xl font-serif ${theme == 'light' ? "text-black" : " text-white "}`}> Fitness, Office, Daily, Weekly, etc.</p>
                        </div>
                        <div className="pt-5 pl-5 pr-5 bg-orange-200 rounded-xl z-10 w-[50dvw]">
                            <img
                                src={'/todo.png'}
                                alt=""
                                className="rounded-t-sm h-full w-full"
                            />
                        </div>
                    </div>

                    <div className='p-10 h-[100dvh] flex flex-row-reverse items-center w-full relative'>
                        {theme == "light" && <div className='-z-10 mt-20 absolute top-0 -left-8 bg-yellow-300 rotate-4 w-[93dvw] h-[80dvh]'></div>}
                        {theme == "light" && <div className='-z-10 mt-20 absolute top-4 -left-8 bg-yellow-300 -rotate-6 w-[93dvw] h-[80dvh]'></div>}
                        <div className='p-10 h-[100dvh] w-[50dvw] flex flex-col justify-center'>
                            <h1 className={`text-5xl font-serif ${theme == 'light' ? "text-black" : " text-white "} font-semibold`}>Task Management </h1>
                            <p className={`mt-15 ml-2 text-2xl font-serif ${theme == 'light' ? "text-black" : " text-white "}`}>Add, update and delete todos effortlessly </p>
                            <p className={`mt-8 ml-2 text-2xl font-serif ${theme == 'light' ? "text-black" : " text-white "}`}> Mark your tasks as completed  </p>
                            <p className={`ml-2 mt-1 text-2xl font-serif ${theme == 'light' ? "text-black" : " text-white "}`}> or remaining  </p>
                        </div>
                        <div className="pt-5 pl-5 pr-5 bg-orange-200 rounded-xl z-10 w-[50dvw]">
                            <img
                                src={'/Dark_theme.png'}
                                alt=""
                                className="rounded-t-sm h-full w-full"
                            />
                        </div>
                    </div>

                    <div className='p-10 h-[100dvh] flex items-center w-full relative'>
                        {theme == "light" && <div className='-z-10 mt-20 absolute top-0 -left-8 bg-fuchsia-400 rotate-4 w-[93dvw] h-[80dvh]'></div>}
                        {theme == "light" && <div className='-z-10 mt-20 absolute top-4 -left-8 bg-fuchsia-400 -rotate-6 w-[93dvw] h-[80dvh]'></div>}
                        <div className='p-10 h-[100dvh] w-[50dvw] flex flex-col justify-center'>
                            <h1 className={`text-5xl font-serif ${theme == 'light' ? "text-black" : " text-white "} font-semibold`}>Light & Dark Mode</h1>
                            <p className={`mt-15 ml-2 text-2xl font-serif ${theme == 'light' ? "text-black" : " text-white "}`}>Switch effortlessly between </p>
                            <p className={`mt-1 ml-2 text-2xl font-serif ${theme == 'light' ? "text-black" : " text-white "}`}>light and dark mode </p>
                            <p className={`ml-2 mt-1 text-2xl font-serif ${theme == 'light' ? "text-black" : " text-white "}`}> to match your preference</p>
                        </div>
                        <div className="pt-5 pl-5 pr-5 bg-orange-200 rounded-xl z-10 w-[50dvw]">
                            <img
                                src={"/details.png"}
                                alt=""
                                className="rounded-t-sm h-full w-full"
                            />
                        </div>
                    </div>

                    <div className='p-10 h-[100dvh] flex flex-row-reverse items-center w-full relative'>
                        {theme == "light" && <div className='-z-10 mt-20 absolute top-0 -left-8 bg-teal-400 rotate-4 w-[93dvw] h-[80dvh]'></div>}
                        {theme == "light" && <div className='-z-10 mt-20 absolute top-4 -left-8 bg-teal-400 -rotate-6 w-[93dvw] h-[80dvh]'></div>}
                        <div className='p-10 h-[100dvh] w-[50dvw] flex flex-col justify-center'>
                            <h1 className={`text-5xl font-serif ${theme == 'light' ? "text-black" : " text-white "} font-semibold`}>Track Your Progress with Colors!</h1>
                            <p className={`mt-15 ml-2 text-2xl font-serif ${theme == 'light' ? "text-black" : " text-white "}`}>Assign unique colors to each category</p>
                            <p className={`ml-2 mt-1 text-2xl font-serif ${theme == 'light' ? "text-black" : " text-white "}`}> for easy identification</p>
                            <p className={`mt-8 ml-2 text-2xl font-serif ${theme == 'light' ? "text-black" : " text-white "}`}>Track your Total, completed </p>
                            <p className={`ml-2 mt-1 text-2xl font-serif ${theme == 'light' ? "text-black" : " text-white "}`}> and remaining tasks</p>
                        </div>
                        <div className="pt-5 pl-5 pr-5 bg-orange-200 rounded-xl z-10 w-[50dvw]">
                            <img
                                src={'/Categories.png'}
                                alt=""
                                className="rounded-t-sm h-full w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='h-100'></div>

            <div className='w-full flex flex-col items-center'>
                <div className='w-full flex justify-center'>
                    <h1 className={`text-5xl font-semibold font-serif ${theme == "light" ? "text-black" : "text-white"}`}>Start managing your tasks </h1>
                </div>
                <button type="button" className='w-40 mt-15 text-2xl font-serif text-white cursor-pointer rounded-lg p-3 bg-red-500 hover:bg-red-700'
                    onClick={(e) => {
                        navigate("/register");
                    }}>
                    Get Started
                </button>
            </div>

            <div className='h-80'></div>

            <div className={`${theme == "light" ? "pt-20 w-full" : ""}`}>
                <section className={`py-12 text-center mx-20 border-t-2 ${theme == "light" ? "border-gray-600" : " border-neutral-400"}`}>
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className={`text-4xl font-semibold ${theme == "light" ? "text-black" : "text-white"} font-serif`}>Let's Connect!</h2>
                        <p className="mt-2 text-gray-400">
                            Have feedback or want to collaborate? Feel free to reach out!
                        </p>

                        <div className="mt-6 flex justify-center space-x-6">
                            <a href="mailto:ankitm2232005@gmail.com" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                                <img src="mail.svg" alt="Email" className={`w-5 h-5 mr-2 ${theme == "light" ? "invert-100" : "invert-100"}`} /> Email Me
                            </a>
                        </div>

                        <div className="mt-6 flex justify-center space-x-6">
                            <a href="https://github.com/i-ankit-here" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                <img src="github-mark-white.png" alt="GitHub" className={`w-6 h-6 mr-2 ${theme == "light" ? "invert-100" : ""}`} />
                            </a>
                            <a href="https://www.linkedin.com/in/ankit-meena-31968228b" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                <img src="linkedIn.png" alt="LinkedIn" className={`w-6 h-6 mr-2 ${theme == "light" ? "invert-100" : ""}`} />
                            </a>
                        </div>
                    </div>
                </section>
            </div>

        </div>
    )
}

export default Home