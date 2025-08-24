import React, { useContext } from 'react'
import ThemeContext from '../themeContext';
import { Card} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users, LayoutDashboard, User, ListTodo } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function Sidebar({ activeView, setActiveView, directMessages, groupChat }) {
    const { theme } = useContext(ThemeContext);

    const getLinkClassName = (viewId) => {
        const baseClasses = "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer";
        const themeClasses = theme === 'light'
            ? "hover:bg-gray-100"
            : "hover:bg-neutral-800";
        const activeClasses = theme === 'light'
            ? "bg-gray-200 text-gray-900"
            : "bg-neutral-700 text-neutral-50";

        return `${baseClasses} ${themeClasses} ${activeView === viewId ? activeClasses : ''}`;
    };


    return (
        <Card className={`w-[27dvw] rounded-lg h-[100dvh] ${theme == "light" ? "bg-gradient-to-b from-neutral-50 to-neutral-100 border-r-2 border-neutral-200" : "bg-gradient-to-b from-neutral-900 to-lightGrey border-neutral-700"} pt-10 flex-col items-center border-0 border-r-2 shadow-lg`}>
            <div className='flex justify-center w-full px-2 mb-8'>
                <img src="/iHaveToDo.svg" className={`h-12 ${theme == "light" ? "invert-100" : ""}`} alt="" />
            </div>
            <div className='flex-col w-[27dvw] px-4 h-full'>

                {/* Project Views Section */}
                <div className='pb-6'>
                    <h2 className={`px-3 text-lg font-semibold tracking-tight ${theme === "light" ? "text-neutral-800" : "text-neutral-200"}`}>
                        Project
                    </h2>
                    <Separator className={`my-3 ${theme === "light" ? "bg-gray-300" : "bg-neutral-600"}`} />
                    <nav className='space-y-1'>
                        <div onClick={() => setActiveView('summary')} className={getLinkClassName('summary')}>
                            <LayoutDashboard className="h-5 w-5" />
                            <span>Project Summary</span>
                        </div>
                        <div onClick={() => setActiveView('my-tasks')} className={getLinkClassName('my-tasks')}>
                            <User className="h-5 w-5" />
                            <span>My Tasks</span>
                        </div>
                        <div onClick={() => setActiveView('all-tasks')} className={getLinkClassName('all-tasks')}>
                            <ListTodo className="h-5 w-5" />
                            <span>All Project Tasks</span>
                        </div>
                    </nav>
                </div>

                {/* Chats Section */}
                <div className='pt-4'>
                    <h2 className={`px-3 text-lg font-semibold tracking-tight ${theme === "light" ? "text-neutral-800" : "text-neutral-200"}`}>
                        Chats
                    </h2>
                    <Separator className={`my-3 ${theme === "light" ? "bg-gray-300" : "bg-neutral-600"}`} />
                    <nav className='flex-col space-y-1'>
                        {/* Group Chat */}
                        {groupChat.map((group) => (
                            <div key={group._id} onClick={() => setActiveView(`chat-${group._id}`)} className={getLinkClassName(group._id)}>
                                <Users className="h-5 w-5" />
                                <span>{group.name}</span>
                            </div>
                        ))}

                        {/* Personal Chats */}
                        <h3 className={`px-3 mt-4 mb-2 text-xs font-semibold uppercase ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Direct Messages
                        </h3>
                        <div className='space-y-1 h-full overflow-y-scroll'>
                            {directMessages.map((conv) => (
                                <div key={conv._id} onClick={() => setActiveView(`chat-${conv._id}`)} className={getLinkClassName(conv._id)}>
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={conv?.avatar || "/userimg.jpg"} />
                                        <AvatarFallback>{conv?.name}</AvatarFallback>
                                    </Avatar>
                                    <span>{conv.name}</span>
                                </div>
                            ))}
                        </div>
                    </nav>
                </div>
            </div>
        </Card>

    )
}

export default Sidebar
