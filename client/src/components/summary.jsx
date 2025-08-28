import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { FolderKanban, CheckCircle2, AlertTriangle, Clock, ListTodo, Users, BarChart3 } from 'lucide-react';

const StatCard = ({ title, value, icon, accentClassName }) => (
    <div className="themed-bg-secondary p-6 rounded-lg shadow-md flex items-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${accentClassName}`}>
            {icon}
        </div>
        <div className="ml-4">
            <p className="themed-text-secondary text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold themed-text">{value}</p>
        </div>
    </div>
);

const ProgressBar = ({ value }) => (
    <div className="w-full themed-bg-accent rounded-full h-4">
        <div className="themed-accent-bg h-4 rounded-full transition-all duration-500" style={{ width: `${value}%` }}></div>
    </div>
);

export const Summary = ({ tasks, users }) => {
    const insights = useMemo(() => {
        if (!tasks || !users) return {};

        const totalTasks = tasks.length;

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
        return <div className="p-8 text-center themed-text-secondary">Loading dashboard...</div>;
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 themed-bg font-sans h-full overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold themed-text">Project Insights Summary</h1>
                <p className="themed-text-secondary mt-1">An overview of your project's health and team performance.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Tasks" value={insights.totalTasks} icon={<FolderKanban className="h-6 w-6 text-blue-600" />} accentClassName="bg-blue-100" />
                <StatCard title="Completed" value={`${insights.completedTasks} / ${insights.totalTasks}`} icon={<CheckCircle2 className="h-6 w-6 text-green-600" />} accentClassName="bg-green-100" />
                <StatCard title="Tasks Overdue" value={insights.overdueTasks} icon={<AlertTriangle className="h-6 w-6 text-red-600" />} accentClassName="bg-red-100" />
                <StatCard title="Avg. Completion" value={`${insights.avgCompletionTimeDays} days`} icon={<Clock className="h-6 w-6 text-purple-600" />} accentClassName="bg-purple-100" />
            </div>

            <div className="themed-bg-secondary p-6 rounded-lg shadow-md mb-8">
                <div className="flex justify-between items-center mb-2"><h2 className="text-lg font-semibold themed-text">Overall Progress</h2><span className="font-bold themed-accent-text text-lg">{Math.round(insights.overallProgress)}%</span></div>
                <ProgressBar value={insights.overallProgress} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="lg:col-span-1 themed-bg-secondary p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold themed-text mb-4 text-center">Task Status</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={insights.statusData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name">
                                {insights.statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }} itemStyle={{ color: 'var(--text-primary)' }} />
                            <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="lg:col-span-1 themed-bg-secondary p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold themed-text mb-4">Team Performance</h2>
                    <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-4 text-sm font-semibold themed-text-secondary px-3">
                            <span>Member</span>
                            <span className="text-center">Tasks</span>
                            <span className="text-right">On-Time %</span>
                        </div>
                        {insights.teamPerformanceData.map(user => (
                            <div key={user.name} className="grid grid-cols-3 gap-4 p-3 themed-bg rounded-md items-center">
                                <span className="font-medium themed-text">{user.name}</span>
                                <span className="text-center text-lg font-bold themed-text">{user.tasks}</span>
                                <span className={`text-right font-semibold ${user.onTimeRate >= 80 ? 'text-green-600' : 'text-amber-600'}`}>{user.onTimeRate}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="themed-bg-secondary p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold themed-text mb-4">Task Completion Timeline</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={insights.timelineData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                            <XAxis dataKey="date" stroke="var(--text-secondary)" />
                            <YAxis allowDecimals={false} stroke="var(--text-secondary)" />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }} itemStyle={{ color: 'var(--text-primary)' }} />
                            <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} />
                            <Line type="monotone" dataKey="completed" stroke="#16a34a" strokeWidth={2} name="Tasks Completed" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="themed-bg-secondary p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold themed-text mb-4">Upcoming Deadlines</h2>
                    <div className="space-y-3">
                        {insights.upcomingTasks.length > 0 ? (
                            insights.upcomingTasks.map(task => (
                                <div key={task._id} className="flex justify-between items-center p-3 themed-bg rounded-md">
                                    <div>
                                        <p className="font-medium themed-text">{task.content}</p>
                                        <p className="text-sm themed-text-secondary">{insights.getAssigneeNames(task.assignedTo).join(', ')}</p>
                                    </div>
                                    <span className="text-sm font-semibold themed-text-secondary">{new Date(task.deadline).toLocaleDateString()}</span>
                                </div>
                            ))
                        ) : (<p className="text-center themed-text-secondary py-4">No upcoming deadlines.</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
};