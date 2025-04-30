"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskList } from "@/components/task-list";
import { AddTaskForm } from "@/components/add-task-form";
import { EditTaskDialog } from "@/components/edit-task-dialog";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load tasks from local storage on initial render
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        // Validate tasks structure
        if (Array.isArray(parsedTasks) && parsedTasks.every(task => task.id && task.title)) {
           setTasks(parsedTasks.map((task: Task) => ({
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
           })));
        } else {
            console.error("Invalid tasks data found in local storage.");
            localStorage.removeItem("tasks"); // Clear invalid data
        }
      } catch (error) {
        console.error("Failed to parse tasks from local storage:", error);
        localStorage.removeItem("tasks"); // Clear potentially corrupted data
      }
    }
  }, []);

  useEffect(() => {
    // Save tasks to local storage whenever the tasks state changes
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((newTaskData: Omit<Task, "id">) => {
    const newTask: Task = { ...newTaskData, id: uuidv4() };
    setTasks(prevTasks => {
        const updatedTasks = [newTask, ...prevTasks];
        // Trigger fade-in animation class
        setTimeout(() => {
          const element = document.getElementById(`task-${newTask.id}`);
          if (element) {
            element.classList.add('fade-in');
          }
        }, 0);
        return updatedTasks;
      });
    toast({
      title: "Task Added",
      description: `"${newTask.title}" has been successfully added.`,
    });
    setIsAddFormVisible(false); // Hide form after adding
  }, [toast]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => {
      const taskToDelete = prevTasks.find(task => task.id === taskId);
      if (!taskToDelete) return prevTasks;

      // Trigger fade-out animation class
      const element = document.getElementById(`task-${taskId}`);
      if (element) {
        element.classList.add('fade-out');
        // Remove the task from state after the animation completes
        setTimeout(() => {
          setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
          toast({
            title: "Task Deleted",
            description: `"${taskToDelete.title}" has been successfully deleted.`,
            variant: "destructive",
          });
        }, 300); // Corresponds to the animation duration
      } else {
          // If element not found (e.g., fast deletion), remove immediately
          setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
          toast({
              title: "Task Deleted",
              description: `"${taskToDelete.title}" has been successfully deleted.`,
              variant: "destructive",
          });
      }
      // Return the original list temporarily while animation runs
      return prevTasks;
    });
  }, [toast]);


  const editTask = useCallback((taskToEdit: Task) => {
    setEditingTask(taskToEdit);
  }, []);

  const saveTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    toast({
      title: "Task Updated",
      description: `"${updatedTask.title}" has been successfully updated.`,
    });
    setEditingTask(null); // Close the dialog
  }, [toast]);

  const toggleComplete = useCallback((taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);


  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary text-center">TaskFlow</h1>

      <div className="mb-6 flex justify-end">
        <Button onClick={() => setIsAddFormVisible(true)} variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-2 h-4 w-4" /> Add New Task
        </Button>
      </div>

      {isAddFormVisible && (
        <div className="mb-8 p-6 bg-card rounded-lg shadow-md fade-in">
          <AddTaskForm onAddTask={addTask} onCancel={() => setIsAddFormVisible(false)} />
        </div>
      )}

       <TaskList
        tasks={tasks}
        onEditTask={editTask}
        onDeleteTask={deleteTask}
        onToggleComplete={toggleComplete}
       />


      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          onSaveTask={saveTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </main>
  );
}
