"use client";

import type React from "react";
import { TaskItem } from "./task-item";
import type { Task } from "@/types/task";
import { Card, CardContent } from "@/components/ui/card";

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export function TaskList({ tasks, onEditTask, onDeleteTask, onToggleComplete }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-center text-muted-foreground mt-8">No tasks yet. Add a new task to get started!</p>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
         <TaskItem
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onToggleComplete={onToggleComplete}
          />
      ))}
    </div>
  );
}
