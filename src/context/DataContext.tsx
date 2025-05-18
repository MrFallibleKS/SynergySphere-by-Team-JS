
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Task, User, Comment } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from '@/lib/utils';

interface DataContextType {
  projects: Project[];
  tasks: Task[];
  users: User[];
  comments: Comment[];
  
  // Project functions
  getProjectById: (id: string) => Project | undefined;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Task functions
  getTaskById: (id: string) => Task | undefined;
  getTasksByProject: (projectId: string) => Task[];
  getTasksByAssignee: (userId: string) => Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // User functions
  getUserById: (id: string) => User | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Initial mock data
const initialUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
  },
  {
    id: '3',
    name: 'Demo User 1',
    email: 'abc@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo1'
  },
  {
    id: '4',
    name: 'Demo User 2',
    email: 'xyz@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo2'
  }
];

const initialProjects: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Redesign the company website with modern UI/UX principles',
    imageBanner: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&h=400&q=80',
    managerName: 'John Doe',
    managerContact: 'john@example.com',
    members: ['1', '2'],
    tasks: ['t1', 't2'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p2',
    name: 'Mobile App Development',
    description: 'Develop a cross-platform mobile application for our service',
    imageBanner: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?auto=format&fit=crop&w=1200&h=400&q=80',
    managerName: 'Jane Smith',
    managerContact: 'jane@example.com',
    members: ['1', '2', '3'],
    tasks: ['t3', 't4'],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const initialTasks: Task[] = [
  {
    id: 't1',
    title: 'Design Homepage Wireframes',
    description: 'Create wireframes for the new homepage design',
    assigneeId: '1',
    projectId: 'p1',
    status: 'IN_PROGRESS',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 't2',
    title: 'Content Audit',
    description: 'Perform a content audit of the existing website',
    assigneeId: '2',
    projectId: 'p1',
    status: 'DONE',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 't3',
    title: 'API Integration',
    description: 'Implement API integration for user authentication',
    assigneeId: '1',
    projectId: 'p2',
    status: 'TODO',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 't4',
    title: 'UI Design for Mobile',
    description: 'Create UI mockups for the mobile application',
    assigneeId: '3',
    projectId: 'p2',
    status: 'IN_PROGRESS',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users] = useState<User[]>(initialUsers);
  const [comments] = useState<Comment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load data from localStorage or use initial data
    const savedProjects = localStorage.getItem('projects');
    const savedTasks = localStorage.getItem('tasks');
    
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      setProjects(initialProjects);
    }
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(initialTasks);
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Project functions
  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...project,
      id: uuidv4().slice(0, 8),
      createdAt: now,
      updatedAt: now
    };
    
    setProjects(prev => [...prev, newProject]);
    toast({
      title: "Project created",
      description: `${newProject.name} has been created successfully`
    });
    
    return newProject.id;
  };

  const updateProject = (id: string, projectUpdates: Partial<Project>) => {
    setProjects(prev => prev.map(project => {
      if (project.id === id) {
        return {
          ...project,
          ...projectUpdates,
          updatedAt: new Date().toISOString()
        };
      }
      return project;
    }));
    
    toast({
      title: "Project updated",
      description: "Project has been updated successfully"
    });
  };

  const deleteProject = (id: string) => {
    // First, delete all tasks associated with the project
    setTasks(prev => prev.filter(task => task.projectId !== id));
    
    // Then delete the project
    setProjects(prev => {
      const projectToDelete = prev.find(project => project.id === id);
      const newProjects = prev.filter(project => project.id !== id);
      
      if (projectToDelete) {
        toast({
          title: "Project deleted",
          description: `${projectToDelete.name} has been deleted`
        });
      }
      
      return newProjects;
    });
  };

  // Task functions
  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  const getTasksByProject = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getTasksByAssignee = (userId: string) => {
    return tasks.filter(task => task.assigneeId === userId);
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...task,
      id: `t${tasks.length + 1}`,
      createdAt: now,
      updatedAt: now
    };
    
    setTasks(prev => [...prev, newTask]);
    
    // Update the project's tasks array
    setProjects(prev => prev.map(project => {
      if (project.id === task.projectId) {
        return {
          ...project,
          tasks: [...project.tasks, newTask.id],
          updatedAt: now
        };
      }
      return project;
    }));
    
    toast({
      title: "Task created",
      description: `${newTask.title} has been added to the project`
    });
    
    return newTask.id;
  };

  const updateTask = (id: string, taskUpdates: Partial<Task>) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        return {
          ...task,
          ...taskUpdates,
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    }));
    
    toast({
      title: "Task updated",
      description: "Task has been updated successfully"
    });
  };

  const deleteTask = (id: string) => {
    // Find the task first to get its projectId
    const taskToDelete = tasks.find(task => task.id === id);
    
    if (taskToDelete) {
      // Remove the task
      setTasks(prev => prev.filter(task => task.id !== id));
      
      // Update the project's tasks array
      setProjects(prev => prev.map(project => {
        if (project.id === taskToDelete.projectId) {
          return {
            ...project,
            tasks: project.tasks.filter(taskId => taskId !== id),
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      }));
      
      toast({
        title: "Task deleted",
        description: `${taskToDelete.title} has been removed`
      });
    }
  };

  // User functions
  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  const value = {
    projects,
    tasks,
    users,
    comments,
    getProjectById,
    addProject,
    updateProject,
    deleteProject,
    getTaskById,
    getTasksByProject,
    getTasksByAssignee,
    addTask,
    updateTask,
    deleteTask,
    getUserById
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
