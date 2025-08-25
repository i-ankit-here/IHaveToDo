import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>{icon}</div>
        <div className="ml-4">
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const ProgressBar = ({ value }) => (
    <div className="w-full bg-gray-200 rounded-full h-4"><div className="bg-blue-600 h-4 rounded-full transition-all duration-500" style={{ width: `${value}%` }}></div></div>
);

// --- SUMMARY COMPONENT ---

export const Summary = ({ tasks, users }) => {
    const insights = useMemo(() => {
        if (!tasks || !users) return {};

        const totalTasks = tasks.length;

        // Use updatedAt as a fallback for completedAt
        const completedTasks = tasks
            .filter(t => t.status === 'completed')
            .map(t => ({ ...t, completedAt: t.completedAt || t.updatedAt }));

        const unassignedTasks = tasks.filter(t => !t.assignedTo || t.assignedTo.length === 0).length;
        const overdueTasks = tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'completed').length;
        const overallProgress = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

        const statusData = [
            { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length },
            { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length },
            { name: 'Completed', value: completedTasks.length },
        ];

        const completionTimes = completedTasks.map(t => new Date(t.completedAt) - new Date(t.createdAt));
        const avgCompletionTimeMs = completionTimes.length > 0 ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length : 0;
        const avgCompletionTimeDays = (avgCompletionTimeMs / (1000 * 60 * 60 * 24)).toFixed(1);

        const getAssigneeNames = (assigneeIds) => {
            if (!assigneeIds || assigneeIds.length === 0) return ['Unassigned'];
            return assigneeIds.map(id => {
                const user = users.get(id);
                return user ? `${user.firstname} ${user.lastname}` : 'Unknown User';
            });
        };

        const upcomingTasks = tasks
            .filter(t => t.deadline && new Date(t.deadline) > new Date() && t.status !== 'completed')
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .slice(0, 5);

        const completedByDate = completedTasks.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

        let cumulativeTasks = 0;
        const timelineData = completedByDate.map(task => {
            cumulativeTasks++;
            return { date: new Date(task.completedAt).toLocaleDateString('en-CA'), completed: cumulativeTasks };
        }).reduce((acc, curr) => {
            const existing = acc.find(item => item.date === curr.date);
            if (existing) existing.completed = curr.completed;
            else acc.push(curr);
            return acc;
        }, []);

        const teamPerformanceData = [...users.values()].map(user => {
            const assignedTasks = tasks.filter(t => t.assignedTo.includes(user._id));
            const completedWithDeadline = assignedTasks
                .filter(t => t.status === 'completed' && t.deadline)
                .map(t => ({ ...t, completedAt: t.completedAt || t.updatedAt }));

            const onTimeCompletions = completedWithDeadline.filter(t => new Date(t.completedAt) <= new Date(t.deadline));
            const onTimeRate = completedWithDeadline.length > 0 ? (onTimeCompletions.length / completedWithDeadline.length) * 100 : 100;
            return { name: `${user.firstname} ${user.lastname}`, tasks: assignedTasks.length, onTimeRate: Math.round(onTimeRate) };
        });

        return { totalTasks, completedTasks: completedTasks.length, unassignedTasks, overdueTasks, overallProgress, statusData, avgCompletionTimeDays, upcomingTasks, timelineData, teamPerformanceData, getAssigneeNames };
    }, [tasks, users]);

    const PIE_COLORS = ['#fbbf24', '#38bdf8', '#22c55e'];

    if (!insights.totalTasks && insights.totalTasks !== 0) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 font-sans overflow-y-scroll">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Project Insights Summary</h1>
                <p className="text-gray-500 mt-1">An overview of your project's health and team performance.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Tasks" value={insights.totalTasks} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} color="bg-blue-100" />
                <StatCard title="Completed" value={`${insights.completedTasks} / ${insights.totalTasks}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="bg-green-100" />
                <StatCard title="Tasks Overdue" value={insights.overdueTasks} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="bg-red-100" />
                <StatCard title="Avg. Completion" value={`${insights.avgCompletionTimeDays} days`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} color="bg-purple-100" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="flex justify-between items-center mb-2"><h2 className="text-lg font-semibold text-gray-700">Overall Progress</h2><span className="font-bold text-blue-600 text-lg">{Math.round(insights.overallProgress)}%</span></div>
                <ProgressBar value={insights.overallProgress} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Task Status</h2>
                    <ResponsiveContainer width="100%" height={250}><PieChart><Pie data={insights.statusData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name">{insights.statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />))}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>
                </div>

                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Team Performance</h2>
                    <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-gray-500 px-3">
                            <span>Member</span>
                            <span className="text-center">Tasks</span>
                            <span className="text-right">On-Time %</span>
                        </div>
                        {insights.teamPerformanceData.map(user => (
                            <div key={user.name} className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-md items-center">
                                <span className="font-medium text-gray-800">{user.name}</span>
                                <span className="text-center text-lg font-bold text-gray-700">{user.tasks}</span>
                                <span className={`text-right font-semibold ${user.onTimeRate >= 80 ? 'text-green-600' : 'text-amber-600'}`}>{user.onTimeRate}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Task Completion Timeline</h2>
                    <ResponsiveContainer width="100%" height={300}><LineChart data={insights.timelineData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis allowDecimals={false} /><Tooltip /><Legend /><Line type="monotone" dataKey="completed" stroke="#16a34a" strokeWidth={2} name="Tasks Completed" /></LineChart></ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Upcoming Deadlines</h2>
                    <div className="space-y-3">
                        {insights.upcomingTasks.length > 0 ? (
                            insights.upcomingTasks.map(task => (
                                <div key={task._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div>
                                        <p className="font-medium text-gray-800">{task.content}</p>
                                        <p className="text-sm text-gray-500">{insights.getAssigneeNames(task.assignedTo).join(', ')}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-600">{new Date(task.deadline).toLocaleDateString()}</span>
                                </div>
                            ))
                        ) : (<p className="text-center text-gray-500 py-4">No upcoming deadlines.</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
};