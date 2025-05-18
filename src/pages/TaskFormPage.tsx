
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TaskForm from '@/components/TaskForm';
import { useData } from '@/context/DataContext';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { TaskFormData } from '@/types';

const TaskFormPage: React.FC = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const { projects, users, addTask, updateTask } = useData();
  const { toast } = useToast();
  
  const isEditing = !!taskId;
  const task = isEditing 
    ? projects
        .flatMap(p => p.taskDetails || [])
        .find(t => t.id === taskId) 
    : undefined;

  const handleSubmit = (taskData: TaskFormData) => {
    try {
      if (isEditing && task) {
        updateTask({
          ...task,
          ...taskData,
        });
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      } else {
        const newTask = {
          ...taskData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addTask(newTask);
        toast({
          title: "Success",
          description: "Task created successfully",
        });
      }
      navigate(taskData.projectId ? `/project/${taskData.projectId}` : '/tasks');
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the task",
        variant: "destructive"
      });
      console.error("Error saving task:", error);
    }
  };

  const handleCancel = () => {
    if (projectId) {
      navigate(`/project/${projectId}`);
    } else {
      navigate('/tasks');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <TaskForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={task}
        isEditing={isEditing}
        users={users}
        projects={projects}
        preSelectedProjectId={projectId}
      />
    </div>
  );
};

export default TaskFormPage;
