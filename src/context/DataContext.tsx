import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Task, User, Comment, Notification } from '@/types';
import { useToast } from '@/components/ui/use-toast';

// Simple UUID generator for demo purposes
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

interface DataContextType {
  projects: Project[];
  tasks: Task[];
  users: User[];
  comments: Comment[];
  notifications: Notification[];
  
  // Project functions
  getProjectById: (id: string) => Project | undefined;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateProject: (project: Partial<Project> & { id: string }) => void;
  deleteProject: (id: string) => void;
  
  // Task functions
  getTaskById: (id: string) => Task | undefined;
  getTasksByProject: (projectId: string) => Task[];
  getTasksByAssignee: (userId: string) => Task[];
  getAvailableTasks: () => Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateTask: (task: Partial<Task> & { id: string }) => void;
  deleteTask: (id: string) => void;
  assignTask: (taskId: string, userId: string) => void;
  unassignTask: (taskId: string) => void;
  
  // User functions
  getUserById: (id: string) => User | undefined;
  
  // Comment functions
  getCommentsByTask: (taskId: string) => Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => string;
  
  // Notification functions
  markNotificationAsRead: (id: string) => void;
  
  // Team management functions
  addUserToProject: (projectId: string, userId: string) => void;
  removeUserFromProject: (projectId: string, userId: string) => void;
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
    tags: ['UI/UX', 'Web Design', 'Front-end'],
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
    tags: ['Mobile', 'React Native', 'UI Design'],
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
    priority: 'HIGH',
    role: 'UI Designer',
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
    priority: 'MEDIUM',
    role: 'Content Strategist',
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
    priority: 'HIGH',
    role: 'Backend Developer',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 't4',
    title: 'UI Design for Mobile',
    description: 'Create UI mockups for the mobile application',
    assigneeId: '', // Unassigned task
    projectId: 'p2',
    status: 'TODO',
    priority: 'MEDIUM',
    role: 'UI Designer',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Initial notifications
const initialNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'TASK_ASSIGNED',
    referenceId: 't1',
    userId: '1',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'n2',
    type: 'COMMENT_ADDED',
    referenceId: 't2',
    userId: '1',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'n3',
    type: 'TASK_DUE_SOON',
    referenceId: 't3',
    userId: '2',
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'n4',
    type: 'TASK_AVAILABLE',
    referenceId: 't4',
    userId: '3',
    read: false,
    createdAt: new Date().toISOString()
  }
];

// Initial comments
const initialComments: Comment[] = [
  {
    id: 'c1',
    content: 'I started working on this, should be done by tomorrow.',
    authorId: '1',
    taskId: 't1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'c2',
    content: 'Do you need any help with this task?',
    authorId: '2',
    taskId: 't1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users] = useState<User[]>(initialUsers);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const { toast } = useToast();

  useEffect(() => {
    // Load data from localStorage or use initial data
    const savedProjects = localStorage.getItem('projects');
    const savedTasks = localStorage.getItem('tasks');
    const savedComments = localStorage.getItem('comments');
    const savedNotifications = localStorage.getItem('notifications');
    
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
    
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      setComments(initialComments);
    }
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      setNotifications(initialNotifications);
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Project functions
  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProjectId = generateId().slice(0, 8);
    
    // Process any tasks included with the project
    const projectTasks: string[] = [];
    
    if (project.taskDetails && project.taskDetails.length > 0) {
      // Add each task
      project.taskDetails.forEach(taskData => {
        const taskId = `t${tasks.length + projectTasks.length + 1}`;
        projectTasks.push(taskId);
        
        // Add the task
        const newTask: Task = {
          id: taskId,
          title: taskData.title,
          description: taskData.description || '',
          assigneeId: taskData.assigneeId || '',
          dueDate: taskData.dueDate,
          status: taskData.status || 'TODO',
          priority: taskData.priority || 'MEDIUM',
          role: taskData.role || '',
          projectId: newProjectId,
          createdAt: now,
          updatedAt: now
        };
        
        setTasks(prev => [...prev, newTask]);
        
        // Create notification for unassigned task
        if (!newTask.assigneeId) {
          addNotification({
            type: 'TASK_AVAILABLE',
            referenceId: taskId,
            userId: project.members[0], // Notify project creator
            read: false,
          });
        }
      });
    }
    
    const newProject: Project = {
      ...project,
      id: newProjectId,
      tasks: projectTasks,
      createdAt: now,
      updatedAt: now
    };
    
    delete (newProject as any).taskDetails; // Remove the taskDetails as they're now in tasks
    
    setProjects(prev => [...prev, newProject]);
    toast({
      title: "Project created",
      description: `${newProject.name} has been created successfully`
    });
    
    return newProject.id;
  };

  const updateProject = (projectUpdate: Partial<Project> & { id: string }) => {
    // Process any tasks included with the project update
    if (projectUpdate.taskDetails && projectUpdate.taskDetails.length > 0) {
      const existingTaskIds = tasks
        .filter(t => t.projectId === projectUpdate.id)
        .map(t => t.id);
        
      // Check which tasks are new vs updates
      projectUpdate.taskDetails.forEach(taskData => {
        if (taskData.id && existingTaskIds.includes(taskData.id)) {
          // Update existing task
          updateTask({
            id: taskData.id,
            title: taskData.title,
            description: taskData.description,
            assigneeId: taskData.assigneeId,
            dueDate: taskData.dueDate,
            status: taskData.status,
            priority: taskData.priority,
            role: taskData.role
          });
        } else {
          // Add new task
          const now = new Date().toISOString();
          const taskId = addTask({
            title: taskData.title,
            description: taskData.description || '',
            assigneeId: taskData.assigneeId || '',
            dueDate: taskData.dueDate,
            status: taskData.status || 'TODO',
            priority: taskData.priority || 'MEDIUM',
            role: taskData.role || '',
            projectId: projectUpdate.id,
          });
          
          // Update the project's tasks array
          setProjects(prev => prev.map(p => {
            if (p.id === projectUpdate.id) {
              return {
                ...p,
                tasks: [...p.tasks, taskId]
              };
            }
            return p;
          }));
        }
      });
      
      // We've handled the tasks separately
      delete (projectUpdate as any).taskDetails;
    }
    
    setProjects(prev => prev.map(project => {
      if (project.id === projectUpdate.id) {
        return {
          ...project,
          ...projectUpdate,
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
  
  const getAvailableTasks = () => {
    return tasks.filter(task => task.assigneeId === '' && task.status !== 'DONE');
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
    
    // Create notification for unassigned task
    if (!task.assigneeId) {
      // Find project members to notify about available task
      const project = projects.find(p => p.id === task.projectId);
      if (project && project.members.length > 0) {
        project.members.forEach(memberId => {
          addNotification({
            type: 'TASK_AVAILABLE',
            referenceId: newTask.id,
            userId: memberId,
            read: false,
          });
        });
      }
    }
    
    toast({
      title: "Task created",
      description: `${newTask.title} has been added to the project`
    });
    
    return newTask.id;
  };

  const updateTask = (taskUpdate: Partial<Task> & { id: string }) => {
    const task = tasks.find(t => t.id === taskUpdate.id);
    
    // Check if the assignee changed
    if (task && taskUpdate.assigneeId !== undefined && taskUpdate.assigneeId !== task.assigneeId) {
      if (taskUpdate.assigneeId) {
        // Task assigned to someone
        addNotification({
          type: 'TASK_ASSIGNED',
          referenceId: task.id,
          userId: taskUpdate.assigneeId,
          read: false,
        });
      }
    }
    
    setTasks(prev => prev.map(task => {
      if (task.id === taskUpdate.id) {
        return {
          ...task,
          ...taskUpdate,
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
  
  const assignTask = (taskId: string, userId: string) => {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      updateTask({
        id: taskId,
        assigneeId: userId,
        status: 'IN_PROGRESS'
      });
      
      toast({
        title: "Task assigned",
        description: `You've taken up the task "${task.title}"`
      });
    }
  };
  
  const unassignTask = (taskId: string) => {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      const previousAssignee = task.assigneeId;
      
      updateTask({
        id: taskId,
        assigneeId: ''
      });
      
      // Notify project members about available task
      const project = projects.find(p => p.id === task.projectId);
      if (project) {
        project.members.forEach(memberId => {
          if (memberId !== previousAssignee) {
            addNotification({
              type: 'TASK_AVAILABLE',
              referenceId: taskId,
              userId: memberId,
              read: false,
            });
          }
        });
      }
      
      toast({
        title: "Task unassigned",
        description: `You've withdrawn from the task "${task.title}"`
      });
    }
  };

  // Comment functions
  const getCommentsByTask = (taskId: string) => {
    return comments.filter(comment => comment.taskId === taskId);
  };

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const newComment: Comment = {
      ...comment,
      id: `c${comments.length + 1}`,
      createdAt: now,
    };
    
    setComments(prev => [...prev, newComment]);
    
    // Create notification for comment
    if (comment.authorId) {
      const task = tasks.find(t => t.id === comment.taskId);
      if (task && task.assigneeId !== comment.authorId) {
        addNotification({
          type: 'COMMENT_ADDED',
          referenceId: comment.taskId,
          userId: task.assigneeId,
          read: false,
        });
      }
    }
    
    return newComment.id;
  };

  // Notification functions
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const newNotification: Notification = {
      ...notification,
      id: `n${notifications.length + 1}`,
      createdAt: now,
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return newNotification.id;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => {
      if (notification.id === id) {
        return {
          ...notification,
          read: true,
        };
      }
      return notification;
    }));
  };

  // Team management functions
  const addUserToProject = (projectId: string, userId: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId && !project.members.includes(userId)) {
        toast({
          title: "Team updated",
          description: `${users.find(u => u.id === userId)?.name} has been added to the project`
        });
        return {
          ...project,
          members: [...project.members, userId],
          updatedAt: new Date().toISOString()
        };
      }
      return project;
    }));
  };

  const removeUserFromProject = (projectId: string, userId: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId && project.members.includes(userId)) {
        toast({
          title: "Team updated",
          description: `${users.find(u => u.id === userId)?.name} has been removed from the project`
        });
        return {
          ...project,
          members: project.members.filter(id => id !== userId),
          updatedAt: new Date().toISOString()
        };
      }
      return project;
    }));
    
    // Unassign any tasks assigned to this user in the project
    setTasks(prev => prev.map(task => {
      if (task.projectId === projectId && task.assigneeId === userId) {
        return {
          ...task,
          assigneeId: '',
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    }));
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
    notifications,
    getProjectById,
    addProject,
    updateProject,
    deleteProject,
    getTaskById,
    getTasksByProject,
    getTasksByAssignee,
    getAvailableTasks,
    addTask,
    updateTask,
    deleteTask,
    assignTask,
    unassignTask,
    getUserById,
    getCommentsByTask,
    addComment,
    markNotificationAsRead,
    addUserToProject,
    removeUserFromProject
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
