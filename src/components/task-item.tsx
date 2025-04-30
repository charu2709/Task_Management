"use client";

import type React from "react";
import { format } from "date-fns";
import type { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
   onToggleComplete: (taskId: string) => void;
}

export function TaskItem({ task, onEdit, onDelete, onToggleComplete }: TaskItemProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click if edit button is clicked
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const handleToggleComplete = () => {
    onToggleComplete(task.id);
  };


  return (
     <Card id={`task-${task.id}`} className={cn("flex flex-col justify-between transition-all duration-300 ease-out hover:shadow-lg", task.completed ? "bg-muted/50 opacity-70" : "bg-card")}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
             <div className="flex items-center space-x-3">
                <Checkbox
                  id={`complete-${task.id}`}
                  checked={!!task.completed}
                  onCheckedChange={handleToggleComplete}
                  aria-label={`Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
                  className="mt-1"
                />
                <CardTitle className={cn("text-lg font-semibold", task.completed && "line-through text-muted-foreground")}>{task.title}</CardTitle>
             </div>
             <div className="flex items-center space-x-1 shrink-0">
             <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleEdit} className="h-8 w-8 text-primary hover:bg-primary/10">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Task</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Task</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
             <TooltipProvider>
               <Tooltip>
                 <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleDelete} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete Task</span>
                  </Button>
                 </TooltipTrigger>
                 <TooltipContent>
                   <p>Delete Task</p>
                 </TooltipContent>
               </Tooltip>
             </TooltipProvider>
           </div>
        </div>

        {task.description && (
          <CardDescription className={cn("mt-2 text-sm", task.completed && "line-through text-muted-foreground")}>{task.description}</CardDescription>
        )}
      </CardHeader>
      {task.dueDate && (
        <CardFooter className="text-xs text-muted-foreground flex items-center mt-auto pt-4 border-t">
          <Calendar className="mr-1.5 h-3 w-3" />
          Due: {format(task.dueDate, "PPP")}
        </CardFooter>
      )}
    </Card>
  );
}
