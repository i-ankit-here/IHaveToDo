import React from 'react'
import { useState, useEffect, useContext } from 'react';
import ThemeContext from '../themeContext';
import getEnvironment from '../../getEnvironment';


const MajorTodo = () => {

    const [theme, setTheme] = useContext(ThemeContext);
    const apiURL = getEnvironment();

    const [view, setView] = useState(-1);
    const [title, setTitle] = useState("");
    const [majorTodos, setMajorTodos] = useState([]);

    useEffect(()=>{
        const fecthData = async()=>{
            try {
                const response = await fetch(`${apiURL}/api/v1/todos/getTodo`,{
                    method:"GET",
                    credentials:"include"
                })
                if(response.ok){
                    const data = await response.json();
                    console.log(response,data);
                }else{
                    throw new Error("Failed to fetch data")
                }
            } catch (error) {
                console.log("error: ",error);
            }
        }
        fecthData();
    })

    const addNewTodo = async()=>{
        try {
            const todo = {
                title: "Edit Title",
                color: "violet",
                textCol: "black",
                total: 0,
                completed: 0
            };
            const response = await fetch(`${apiURL}/api/v1/todos/addTodo`,{
                method:"POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(todo),
                credentials: "include"           
            })
            console.log(response);
            if(response.ok){
                const newMajorTodos = [...majorTodos,todo];
                setMajorTodos(newMajorTodos);
            }else{
                alert("Some issue occured while updating the Task");
            }
        } catch (error) {
            console.log("error: ",error);
            alert("Some issue occured while updating the Task");
        }
    }

    const save = async(index)=>{
        try {
            console.log(index,title)
            const todo = majorTodos[index];
            todo.title = title;
            const response = await fetch(`${apiURL}/api/v1/todos/addTodo`,{
                method:"POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(todo),
                credentials: "include"           
            })
            if(response.ok){
                const newMajorTodos = majorTodos;
                newMajorTodos[index] = todo;
                setMajorTodos(newMajorTodos);
                setView(-1);
            }else{
                alert("Some issue occured while updating the Task");
            }
        } catch (err) {
            console.log("error: ",err);
            alert("Some issue occured while updating the Task");
        }
    }

    const cancel = () => {
        setView(-1);
    }

    return (
        <>
            <div className='flex gap-1 h-dvh overflow-y-hidden'>
                <div className={`w-[27dvw] rounded-lg h-[100dvh] ${theme=="light"?" bg-neutral-100 border-r-2 border-neutral-200 ":" bg-lightGrey "} pt-10 flex-col items-center`}>
                    <div className='flex justify-center w-100'><img src="iHaveToDo.svg" className={`h-10 ${theme == "light" ? " invert-100 " : " "}`} alt="" /></div>
                    <div className='flex-col w-[27dvw]'>
                        <div className='m-3 pt-10 border-b-2 border-gray-200'>
                            <p className={`text-2xl ${theme=="light"?" text-neutral-600 ":" text-neutral-300 "}`}>#Your Tasks</p>
                        </div>

                        <div className={`flex-col h-[75dvh] rounded-md overflow-y-scroll no-scrollbar `}>
                            {majorTodos.map((item, index) => {
                                return <div key={index} className={`m-3 p-5 h-13 ${theme=="light"?" bg-gray-300 ":" bg-neutral-700 text-gray-200"}  text-md flex items-center justify-between rounded-md`}>
                                    <p className='text-2xl'>{item.title}</p>
                                    <p className={`text-xl font-bold h-10 w-10 ${theme=="light"?" bg-gray-400":" bg-neutral-800 text-gray-200"} rounded-sm text-center content-center`}>{item.total-item.completed}</p>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
                <div className='mt-15'>
                    <div className='pt-3 border-b-2 border-neutral-200 mx-8'>
                        <p className={`${theme=="light"?"":"text-zinc-400 "}text-5xl font-semibold font-sans`}>Hello Ankit !!</p>
                    </div>
                    <div className='cards flex w-[72dvw] h-[84dvh] mt-3 flex-wrap items-center p-8 gap-6 overflow-y-scroll'>
                        {majorTodos.map((item, index) => {
                            return <div
                                key={index}
                                className="w-full md:w-80 md:h-80 p-3 rounded-sm text-white flex justify-between items-center flex-col cursor-pointer "
                                style={{ background: item.color, color: item.textCol }}
                            // onClick={() => { console.log("I am clicked") }}
                            >
                                <div className='w-full md:w-75 flex justify-between'>
                                    <img src="edit.png" className={`w-10 p-1 hover:bg-gray-900 rounded-full ${theme == "light" ? " invert-100 " : " invert-100 "} `} alt=""
                                        onClick={(e) => {
                                            setTitle(item.title)
                                            setView(index);
                                        }}
                                    />
                                    {view != index ?
                                        (<img src="color.png" className={`w-10 p-1 hover:bg-gray-900 rounded-full ${theme == "light" ? " invert-100 " : " invert-100 "} `} alt="" />)
                                        : (<img src="delete.png" className={`w-10 p-1 hover:bg-gray-900 rounded-full ${theme == "light" ? " invert-100 " : " invert-100 "}`} alt="" />)}
                                </div>
                                {view != index ? (<div className='w-full md:w-65 font-bold pb-8 text-4xl varela-round-regular text-center'>
                                    <p>{item.title}</p>
                                </div>)
                                    : <input type="text" className='border-black w-full border-2 rounded-lg p-1' value={title} onChange={(e) => {
                                        setTitle(e.target.value);
                                    }} />
                                }

                                {view != index ? (<div className='w-full md:w-75 p-1 font-medium flex justify-around items-end flex-col text-center'>
                                    <p>Total: {item.total}</p>
                                    <p>Completed: {item.completed}</p>
                                </div>)
                                    : (<div className='w-full md:w-65 justify-around items-end flex text-center'>
                                        <button type="button" className='p-1 w-24 rounded-2xl border-2 border-gray-400 bg-gray-300 hover:bg-gray-400 font-semibold' onClick={()=>{save(index)}}>Save</button>
                                        <button type="button" className='p-1 w-24 rounded-2xl border-2 border-gray-400 bg-gray-300 hover:bg-gray-400 font-semibold' onClick={cancel}>Cancel</button>
                                    </div>)}
                            </div>
                        })}
                        <div className={`w-full md:w-80 md:h-80 p-3 rounded-sm text-white flex justify-center items-center flex-col ${theme == "light" ? "bg-neutral-300" : "bg-lightGrey"} cursor-pointer`}>
                            <div className={`w-30 h-30 rounded-full flex justify-center items-center ${theme == "light" ? " bg-neutral-400 " : " bg-neutral-500 "} hover:bg-neutral-600`}
                                onClick={addNewTodo}>
                                <img src="plusIcon.png" className={`w-20 ${theme == "light" ? " invert-100 " : ""}`} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MajorTodo;