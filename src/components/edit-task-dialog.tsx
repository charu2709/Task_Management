"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }).max(100, { message: "Title must be 100 characters or less." }),
  description: z.string().max(500, { message: "Description must be 500 characters or less." }).optional(),
  dueDate: z.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditTaskDialogProps {
  task: Task;
  onSaveTask: (updatedTask: Task) => void;
  onClose: () => void;
}

export function EditTaskDialog({ task, onSaveTask, onClose }: EditTaskDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    },
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

   // Reset form when task prop changes
  useEffect(() => {
    form.reset({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    });
  }, [task, form]);


  function onSubmit(values: FormData) {
    onSaveTask({
      ...task, // Preserve existing id and completed status
      title: values.title,
      description: values.description,
      dueDate: values.dueDate,
    });
  }

  return (
    <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter task description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date (Optional)</FormLabel>
                   <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                           className={cn(
                             "w-full pl-3 text-left font-normal",
                             !field.value && "text-muted-foreground"
                           )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                           ) : (
                            <span>Pick a date</span>
                           )}
                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                         </Button>
                       </FormControl>
                     </PopoverTrigger>
                     <PopoverContent className="w-auto p-0" align="start">
                       <Calendar
                         mode="single"
                         selected={field.value}
                        onSelect={(date) => {
                            field.onChange(date);
                            setIsCalendarOpen(false); // Close calendar on select
                        }}
                         disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} // Disable past dates
                         initialFocus
                       />
                     </PopoverContent>
                   </Popover>
                   <FormMessage />
                 </FormItem>
               )}
             />
             <DialogFooter className="pt-4">
                <DialogClose asChild>
                 <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
               <Button type="submit" className="bg-primary hover:bg-primary/90">Save Changes</Button>
             </DialogFooter>
           </form>
         </Form>
       </DialogContent>
     </Dialog>
  );
}
