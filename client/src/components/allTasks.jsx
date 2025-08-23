import React from 'react'
import { Circle, Play, CheckCircle} from "lucide-react";
import SubTodo from "./TodoComps/todo"
import {CollapsibleSection} from './collapsible';

function AllTasks({ todos, setTodos, Id, team, pendingTodos, inProgressTodos, completedTodos, toggleSection, collapsedSections }) {
    return (
        <div className='flex-1 p-2 overflow-y-auto'>
            {/* Collapsible Sections */}
            <CollapsibleSection
                title="Pending"
                status="pending"
                count={pendingTodos.length}
                icon={<Circle className="h-6 w-6" />}
                isEmpty={pendingTodos.length === 0}
                toggleSection={toggleSection}
                collapsedSections={collapsedSections}
            >
                {todos.map((item, index) => <SubTodo
                    todos={todos}
                    setTodos={setTodos}
                    item={item}
                    index={index}
                    TodoId={Id}
                    reqstatus="pending"
                    key={item._id}
                    users={team}
                />)}
            </CollapsibleSection>

            <CollapsibleSection
                title="In Progress"
                status="in-progress"
                count={inProgressTodos.length}
                icon={<Play className="h-6 w-6" />}
                isEmpty={inProgressTodos.length === 0}
                toggleSection={toggleSection}
                collapsedSections={collapsedSections}
            >
                {todos.map((item, index) => <SubTodo
                    todos={todos}
                    setTodos={setTodos}
                    item={todos[index]}
                    index={index}
                    TodoId={Id}
                    reqstatus="in-progress"
                    key={item._id}
                    users={team}
                />)}
            </CollapsibleSection>

            <CollapsibleSection
                title="Completed"
                status="completed"
                count={completedTodos.length}
                icon={<CheckCircle className="h-6 w-6" />}
                isEmpty={completedTodos.length === 0}
                toggleSection={toggleSection}
                collapsedSections={collapsedSections}
            >
                {todos.map((item, index) => <SubTodo
                    todos={todos}
                    setTodos={setTodos}
                    item={todos[index]}
                    index={index}
                    TodoId={Id}
                    reqstatus="completed"
                    key={item._id}
                    users={team}
                />)}
            </CollapsibleSection>

            <div className='h-20'></div>
        </div>
    )
}

export default AllTasks
