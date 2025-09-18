import { useRef, useState, useEffect, useContext } from 'react';
import ThemeContext from '../themeContext';
import getEnvironment from '../../getEnvironment';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback } from './ui/avatar';
import { Plus, Pencil, UserPlus, Trash2, Palette, ListTodo, Users, FolderKanban, CheckCircle2, BarChart3, LayoutGrid, List, ChevronsUpDown, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Invite from './invite';


const MajorTodo = () => {

    const { theme, setTheme, user } = useContext(ThemeContext);
    console.log(user)
    const apiURL = getEnvironment();

    const [view, setView] = useState(-1);
    const [title, setTitle] = useState("");
    const [majorTodos, setMajorTodos] = useState([]);
    const [color, setColor] = useState("");
    const prev = useRef("");
    const navigate = useNavigate();
    const [enableColor, setEnableColor] = useState(false);
    const [inviteFlag, setInviteFlag] = useState(false);
    const [userIds, setUserIds] = useState([]);
    const [todoId, setTodoId] = useState("");
    const [displayMode, setDisplayMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fecthData = async () => {
            try {
                const response = await fetch(`${apiURL}/api/v1/todos/getTodos`, {
                    method: "GET",
                    credentials: "include"
                })
                if (response.ok) {
                    const data = await response.json();
                    setMajorTodos(data?.data?.todos);
                    console.log(response, data);
                } else {
                    throw new Error("Failed to fetch data")
                }
            } catch (error) {
                console.log("error: ", error);
            }
        }
        fecthData();
    }, [])

    const addNewTodo = async () => {
        try {
            const todo = {
                _id: undefined,
                title: "Edit Title",
                color: "violet",
                textCol: "black",
                total: 0,
                completed: 0
            };
            const newMajorTodos = [...majorTodos, todo];
            setMajorTodos(newMajorTodos);
            setView(newMajorTodos.length - 1);
        } catch (error) {
            console.log("error: ", error);
            alert("Some issue occured while updating the Task");
        }
    }

    const deleteTodo = async (item, index) => {
        try {
            const id = item._id;
            const response = await fetch(`${apiURL}/api/v1/todos/deleteTodo/${id}`, {
                method: "DELETE",
                credentials: "include"
            })
            if (response.ok) {
                console.log("Todo deleted Successfully", response);
                const arr = [...majorTodos];
                arr.splice(index, 1);
                setView(-1);
                setMajorTodos(arr);
            }
        }
        catch (error) {
            console.log("Error occured, ", error)
        }
    }

    const changeColor = async (e) => {
        console.log(e.hex);
        setColor(e.hex);
    }

    const save = async (index) => {
        try {
            console.log(index, title)
            const todo = majorTodos[index];
            todo.title = title;
            const response = await fetch(`${apiURL}/api/v1/todos/addTodo`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(todo),
                credentials: "include"
            })
            if (response.ok) {
                const data = await response.json();
                const newMajorTodos = majorTodos;
                console.log(data.data);
                if (!todo._id) newMajorTodos[index] = data?.data?.createdTodo;
                else newMajorTodos[index] = data?.data?.updatedTodo;
                setMajorTodos(newMajorTodos);
                setTitle("");
                setEnableColor(false);
                setView(-1);
            } else {
                alert("Some issue occured while updating the Task");
            }
        } catch (err) {
            console.log("error: ", err);
            alert("Some issue occured while updating the Task");
        }
    }

    const cancel = (index) => {
        if (!majorTodos[index]._id) {
            const arr = [...majorTodos];
            arr.pop();
            setMajorTodos(arr);
            setTitle("");
            setView(-1);
            return;
        }
        console.log(prev.current);
        majorTodos[index].color = prev.current;
        setView(-1);
    }


    const totalProjects = majorTodos.length;
    const totalTasks = majorTodos.reduce((sum, p) => sum + p.total, 0);
    const totalCompletedTasks = majorTodos.reduce((sum, p) => sum + p.completed, 0);
    const overallProgress = totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };


    return (
        <>
            <div className={`flex h-dvh overflow-y-hidden themed-bg ${inviteFlag ? "opacity-20" : "opacity-100"}`}>
                <aside className="w-[27dvw] min-w-[300px] h-full themed-bg p-4 flex flex-col gap-4 border-r-2">
                    <nav className="flex flex-col gap-2">
                        <Button variant="ghost" className="justify-start gap-3 text-md h-12">
                            <LayoutGrid className="w-5 h-5" /> Dashboard
                        </Button>
                        <Button variant="ghost" className="justify-start gap-3 text-md h-12 themed-text-secondary">
                            <List className="w-5 h-5" /> My Tasks
                        </Button>
                    </nav>

                    <Collapsible defaultOpen={true} className="flex-grow flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between px-2">
                            <p className="text-sm font-semibold themed-text-secondary uppercase tracking-wider">Your Projects</p>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="w-9 p-0">
                                    <ChevronsUpDown className="h-4 w-4" />
                                    <span className="sr-only">Toggle</span>
                                </Button>
                            </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent className="flex-grow flex flex-col gap-2 overflow-hidden pt-2">
                            <div className="relative p-2">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 themed-text-secondary" />
                                <Input
                                    placeholder="Filter projects..."
                                    className="pl-10 h-11"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex-col flex-grow rounded-md overflow-y-auto no-scrollbar">
                                {majorTodos.filter(project => project.title.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((project) => (
                                        <Button
                                            key={project._id || project.title}
                                            variant="ghost"
                                            className="w-full text-md flex items-center justify-between rounded-md h-12 mb-1 themed-text cursor-pointer "
                                            onClick={() => {navigate(`/todos/${project._id}`,{ state: project })}}
                                        >
                                            <p className='text-base truncate'>{project.title}</p>
                                            <p className="text-sm font-semibold h-7 w-7 themed-bg-accent rounded-sm flex items-center justify-center">
                                                {Math.max(0, project.total - project.completed)}
                                            </p>
                                        </Button>
                                    ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    <div className="mt-auto pt-4 ">
                        <div className="p-2 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className={"border-2"}>
                                    <AvatarFallback>{user?.firstname?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-semibold themed-text">{user?.firstname} {user?.lastname}</span>
                                    <span className="text-xs themed-text-secondary">{user?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className='flex-1 flex flex-col'>
                    <header className='p-6 pt-10 flex items-center justify-between sticky top-0 themed-bg z-10 mx-2 border-b-1'>
                        <h2 className="themed-text text-4xl font-semibold font-sans">{user?.firstname}'s Projects</h2>
                    </header>

                    <div className="p-6 overflow-y-auto">
                        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" initial="hidden" animate="visible" variants={containerVariants}>
                            <motion.div variants={itemVariants}>
                                <Card className="themed-bg-secondary themed-border"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Projects</CardTitle><FolderKanban className="w-5 h-5 themed-text-secondary" /></CardHeader><CardContent><div className="text-3xl font-bold">{totalProjects}</div></CardContent></Card>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Card className="themed-bg-secondary themed-border"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Tasks Completed</CardTitle><CheckCircle2 className="w-5 h-5 themed-text-secondary" /></CardHeader><CardContent><div className="text-3xl font-bold">{totalCompletedTasks}</div></CardContent></Card>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Card className="themed-bg-secondary themed-border"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Overall Progress</CardTitle><BarChart3 className="w-5 h-5 themed-text-secondary" /></CardHeader><CardContent><div className="text-3xl font-bold">{overallProgress}%</div></CardContent></Card>
                            </motion.div>
                        </motion.div>

                        <div className="flex justify-end items-center mb-4">
                            <Button variant={displayMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setDisplayMode('grid')}><LayoutGrid className="w-5 h-5" /></Button>
                            <Button variant={displayMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setDisplayMode('list')}><List className="w-5 h-5" /></Button>
                        </div>

                        <motion.div
                            key={displayMode}
                            className={displayMode === 'grid'
                                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6"
                                : "flex flex-col gap-3"}
                            initial="hidden" animate="visible" variants={containerVariants}
                        >
                            {majorTodos.map((project, index) => {
                                const inEditMode = view === index;
                                const progress = project.total > 0 ? (project.completed / project.total) * 100 : 0;

                                if (displayMode === 'grid') {
                                    return (
                                        <motion.div key={project._id || index} variants={itemVariants} className="group relative">
                                            <Card className="themed-bg-secondary themed-border flex flex-col justify-between min-h-[240px] transition-all duration-200">
                                                {!inEditMode && (
                                                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" onClick={() => { setView(index); setTitle(project.title); }}> <Pencil className="w-5 h-5" /> </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => { setInviteFlag(true); setUserIds(project?.team || []); setTodoId(project._id); setTitle(project.title); }}> <UserPlus className="w-5 h-5" /> </Button>
                                                    </div>
                                                )}

                                                <CardHeader>
                                                    {inEditMode ? (<Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-xl" />)
                                                        : (<CardTitle className="themed-text font-semibold text-xl cursor-pointer pr-16" onClick={() => navigate(`../todos/${project._id}`, { state: project })}>{project.title}</CardTitle>)}
                                                </CardHeader>

                                                <CardContent className="flex-grow">
                                                    {!inEditMode && (<><p className="themed-text-secondary text-sm mb-4 flex items-center gap-2"><ListTodo className="w-4 h-4" />{project.completed} of {project.total} tasks complete</p><Progress value={progress} /></>)}
                                                </CardContent>

                                                <CardFooter>
                                                    {inEditMode ? (
                                                        <div className="w-full flex justify-between items-center">
                                                            <Button variant="ghost" size="icon" onClick={() => deleteTodo(project, index)}> <Trash2 className="w-5 h-5 text-red-500" /> </Button>
                                                            <div className="flex gap-2">
                                                                <Button variant="outline" onClick={() => cancel(index)}>Cancel</Button>
                                                                <Button onClick={() => save(index)}>Save</Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full flex justify-between items-center">
                                                            <div className="flex items-center gap-2 themed-text-secondary"><Users className="w-4 h-4" /><span>{project.team?.length || 0} Members</span></div>
                                                            <Button variant="outline" onClick={() => navigate(`../todos/${project._id}`, { state: project })}>View Project</Button>
                                                        </div>
                                                    )}
                                                </CardFooter>
                                            </Card>
                                        </motion.div>
                                    );
                                }

                                return (
                                    <motion.div key={project._id || index} variants={itemVariants} className="group">
                                        <div className="themed-bg-secondary themed-border rounded-lg p-4 flex items-center justify-between transition-all">
                                            {inEditMode ? (
                                                <div className="flex-1 flex gap-4 items-center">
                                                    <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-lg" />
                                                    <Button variant="outline" onClick={() => cancel(index)}>Cancel</Button>
                                                    <Button onClick={() => save(index)}>Save</Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-1/3 cursor-pointer" onClick={() => navigate(`../todos/${project._id}`, { state: project })}><p className="themed-text font-semibold truncate">{project.title}</p></div>
                                                    <div className="w-1/4 flex items-center gap-2 themed-text-secondary"><Users className="w-4 h-4" /><span>{project.team?.length || 0} Members</span></div>
                                                    <div className="w-1/3 flex items-center gap-3"><Progress value={progress} /><span className="themed-text-secondary text-sm">{Math.round(progress)}%</span></div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" onClick={() => { setView(index); setTitle(project.title); }}> <Pencil className="w-5 h-5" /> </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => deleteTodo(project, index)}> <Trash2 className="w-5 h-5" /> </Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {displayMode === 'grid' && (
                                <motion.div variants={itemVariants}>
                                    <Card className="themed-border h-16 w-16 fixed bottom-3 right-6 rounded-full border-dashed flex items-center justify-center hover:shadow-lg hover:border-solid transition-all duration-200 cursor-pointer invert-100" onClick={addNewTodo}>
                                        <div className="text-center themed-text-secondary"><Plus className="w-8 h-8" /></div>
                                    </Card>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </main>
            </div>
            {inviteFlag && <Invite userIds={userIds} onClose={() => { setInviteFlag(false); setUserIds([]); setTodoId(""); setTitle(""); }} todoId={todoId} title={title} inviteeName={`${user?.firstname} ${user?.lastname}`} />}
        </>
    )
}

export default MajorTodo;