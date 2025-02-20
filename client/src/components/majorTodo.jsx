import React from 'react'
import { useState, useEffect,useContext } from 'react';
import ThemeContext from '../themeContext';

const MajorTodo = () => {

    const [theme,setTheme] = useContext(ThemeContext);

    const [view,setView] = useState(-1);
    const [title,setTitle] = useState("");
    const [majorTodos, serMajorTodos] = useState([{
        title: "Daily Tasks",
        color: "lightgreen",
        textCol:"black",
        total: 10,
        completed: 8
    },
    {
        title: "Daily Tasks",
        color: "pink",
        textCol:"black",
        total: 10,
        completed: 8
    },
    {
        title: "Daily Tasks",
        color: "cyan",
        textCol:"black",
        total: 10,
        completed: 8
    }]);
    return (
        <>
            <div className='cards flex w-full h-[90dvh] justify-center flex-wrap items-center p-8 gap-10'>
                {majorTodos.map((item, index) => {
                    return <div
                        key={index}
                        className="w-full md:w-50 md:h-50 p-3 rounded-2xl text-white flex justify-between items-center flex-col cursor-pointer "
                        style={{ background: item.color , color:item.textCol}}
                        // onClick={() => { console.log("I am clicked") }}
                    >
                        <div className='w-full md:w-43 flex justify-between'>
                            <img src="public/edit.png" className={`w-9 p-1 hover:bg-gray-900 rounded-full ${theme=="light"?" invert-100 ":""} `} alt="" 
                            onClick={(e)=>{
                                setTitle(item.title)
                                setView(index);
                            }}
                            />
                            {view!=index?
                            (<img src="public/color.png" className={`w-9 p-1 hover:bg-gray-900 rounded-full ${theme=="light"?" invert-100 ":""} `} alt="" />)
                            :(<img src="public/delete.png" className={`w-9 p-1 hover:bg-gray-900 rounded-full ${theme=="light"?" invert-100 ":""}`} alt="" />)}
                        </div>
                        {view!=index?(<div className='w-full md:w-43 font-bold pb-8 text-2xl text-center'>
                            <p>{item.title}</p>
                        </div>)
                        :<input type="text" className='border-white border-2 rounded-lg p-1' value={title} onChange={(e)=>{
                            setTitle(e.target.value);
                        }}/>
                        }
                        
                        {view!=index?(<div className='w-full md:w-43 flex justify-around items-end flex-col text-center'>
                            <p>Total: {item.total}</p>
                            <p>Completed: {item.completed}</p>
                        </div>)
                        :(<div className='w-full md:w-43 justify-around items-end flex text-center'>
                            <button type="button" className='p-1 w-15 rounded-2xl bg-gray-700 hover:bg-gray-900'>Save</button>
                            <button type="button" className='p-1 w-16 rounded-2xl bg-gray-700 hover:bg-gray-900'>Cancel</button>
                        </div>)}
                    </div>
                })}
                <div className={`w-full md:w-50 md:h-50 p-3 rounded-2xl text-white flex justify-center items-center flex-col ${theme=="light"?"bg-neutral-300":"bg-lightGrey"} cursor-pointer`}>
                    <div className={`w-30 h-30 rounded-full flex justify-center items-center ${theme=="light"?" bg-neutral-400 ":" bg-neutral-400 "} hover:bg-neutral-500`}
                        onClick={() => { console.log("I am clicked") }}>
                        <img src="public/plusIcon.png" className={`w-25 ${theme=="light"?" invert-100 ":""}`} alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MajorTodo;