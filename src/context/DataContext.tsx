
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Project, User, Notification, Task, TaskFormData } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useSeedData } from '@/hooks/use-seed-data';

interface DataContextType {
  projects: Project[];
  users: User[];
  notifications: Notification[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  addTask: (task: TaskFormData) => void;
  updateTask: (task: TaskFormData) => void;
  deleteTask: (taskId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  const [users, setUsers] = useLocalStorage<User[]>('users', []);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', []);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { generateSeedData } = useSeedData();

  // Initialize with seed data if empty
  useEffect(() => {
    if (projects.length === 0 && users.length === 0) {
      const seedData = generateSeedData();
      setUsers(seedData.users);
      setProjects(seedData.projects);
    }
  }, [projects.length, users.length, generateSeedData, setUsers, setProjects]);

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...project,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    // Assign IDs to tasks and add them to the project
    if (project.taskDetails && project.taskDetails.length > 0) {
      const taskIds: string[] = [];
      const updatedTaskDetails: TaskFormData[] = project.taskDetails.map(task => {
        const taskId = task.id || uuidv4();
        taskIds.push(taskId);
        return {
          ...task,
          id: taskId,
          projectId: newProject.id
        };
      });
      
      newProject.tasks = taskIds;
      newProject.taskDetails = updatedTaskDetails;
    }
    
    setProjects([...projects, newProject]);
    
    // Add notification for project creation
    if (currentUser) {
      const notification: Notification = {
        id: uuidv4(),
        type: 'PROJECT_UPDATED',
        referenceId: newProject.id,
        userId: currentUser.id,
        read: false,
        createdAt: now
      };
      setNotifications([...notifications, notification]);
    }
  };

  const updateProject = (project: Project) => {
    setProjects(projects.map(p => p.id === project.id ? { ...project, updatedAt: new Date().toISOString() } : p));
  };

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    
    // Remove associated tasks and notifications
    setNotifications(notifications.filter(n => n.referenceId !== projectId));
  };

  const addTask = (task: TaskFormData) => {
    const now = new Date().toISOString();
    const taskId = task.id || uuidv4();
    
    // Find the associated project
    const projectIndex = projects.findIndex(p => p.id === task.projectId);
    
    if (projectIndex === -1) {
      toast({
        title: "Error",
        description: "Project not found",
        variant: "destructive"
      });
      return;
    }
    
    // Update the project with the new task
    const projectCopy = { ...projects[projectIndex] };
    projectCopy.tasks = [...(projectCopy.tasks || []), taskId];
    projectCopy.taskDetails = [
      ...(projectCopy.taskDetails || []), 
      { ...task, id: taskId }
    ];
    projectCopy.updatedAt = now;
    
    const newProjects = [...projects];
    newProjects[projectIndex] = projectCopy;
    
    setProjects(newProjects);
    
    // Add notification for task assignment if there's an assignee
    if (task.assigneeId && currentUser) {
      const notification: Notification = {
        id: uuidv4(),
        type: 'TASK_ASSIGNED',
        referenceId: taskId,
        userId: task.assigneeId,
        read: false,
        createdAt: now
      };
      setNotifications([...notifications, notification]);
    }
  };

  const updateTask = (task: TaskFormData) => {
    // Find the task's project
    const projectIndex = projects.findIndex(p => 
      p.taskDetails?.some(t => t.id === task.id)
    );
    
    if (projectIndex === -1) {
      toast({
        title: "Error",
        description: "Task or project not found",
        variant: "destructive"
      });
      return;
    }
    
    // Update the task in the project
    const projectCopy = { ...projects[projectIndex] };
    projectCopy.taskDetails = projectCopy.taskDetails?.map(t => 
      t.id === task.id ? { ...task } : t
    );
    projectCopy.updatedAt = new Date().toISOString();
    
    const newProjects = [...projects];
    newProjects[projectIndex] = projectCopy;
    
    setProjects(newProjects);
  };

  const deleteTask = (taskId: string) => {
    // Find which project contains the task
    const projectIndex = projects.findIndex(p => p.tasks?.includes(taskId));
    
    if (projectIndex === -1) return;
    
    const projectCopy = { ...projects[projectIndex] };
    
    // Remove the task ID from tasks array
    projectCopy.tasks = projectCopy.tasks.filter(id => id !== taskId);
    
    // Remove the task from taskDetails array
    projectCopy.taskDetails = projectCopy.taskDetails?.filter(t => t.id !== taskId);
    
    const newProjects = [...projects];
    newProjects[projectIndex] = projectCopy;
    
    setProjects(newProjects);
    
    // Remove associated notifications
    setNotifications(notifications.filter(n => n.referenceId !== taskId));
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        users,
        notifications,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        markNotificationAsRead
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
