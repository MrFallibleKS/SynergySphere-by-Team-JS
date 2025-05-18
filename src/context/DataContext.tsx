
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Project, Task, Comment, Notification, User, Status } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface DataContextType {
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  notifications: Notification[];
  users: User[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  getProjectById: (id: string) => Project | undefined;
  getTaskById: (id: string) => Task | undefined;
  getUserById: (id: string) => User | undefined;
  getTasksByProject: (projectId: string) => Task[];
  getTasksByAssignee: (userId: string) => Task[];
  getCommentsByTask: (taskId: string) => Comment[];
  getNotificationsByUser: (userId: string) => Notification[];
  addUserToProject: (projectId: string, userId: string) => void;
  removeUserFromProject: (projectId: string, userId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Sample data for demo purposes
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6d28d9&color=fff',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=6d28d9&color=fff',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=6d28d9&color=fff',
  }
];

const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with new branding',
    members: ['1', '2'],
    tasks: ['1', '2', '3'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Create iOS and Android apps for our service',
    members: ['1', '3'],
    tasks: ['4', '5'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Design Homepage',
    description: 'Create wireframes and mockups for the new homepage',
    assigneeId: '2',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'TODO',
    projectId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Setup CMS',
    description: 'Install and configure the content management system',
    assigneeId: '1',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'IN_PROGRESS',
    projectId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Develop Contact Form',
    description: 'Create a functional contact form with validation',
    assigneeId: '1',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'DONE',
    projectId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Create App Wireframes',
    description: 'Design mobile app wireframes for all primary screens',
    assigneeId: '3',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'IN_PROGRESS',
    projectId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Research API Integration',
    description: 'Evaluate options for integrating with our backend API',
    assigneeId: '1',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'TODO',
    projectId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const sampleComments: Comment[] = [
  {
    id: '1',
    content: 'I\'ve started the wireframes, will share them tomorrow.',
    authorId: '2',
    taskId: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    content: 'I\'ve compared several CMS options, leaning toward Strapi.',
    authorId: '1',
    taskId: '2',
    createdAt: new Date().toISOString(),
  }
];

const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'TASK_ASSIGNED',
    referenceId: '1',
    userId: '2',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'COMMENT_ADDED',
    referenceId: '1',
    userId: '1',
    read: true,
    createdAt: new Date().toISOString(),
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  
  // Initialize state with sample data or load from localStorage
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : sampleProjects;
  });
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : sampleTasks;
  });
  
  const [comments, setComments] = useState<Comment[]>(() => {
    const savedComments = localStorage.getItem('comments');
    return savedComments ? JSON.parse(savedComments) : sampleComments;
  });
  
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : sampleNotifications;
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : sampleUsers;
  });

  // Save data to localStorage whenever it changes
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

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Project operations
  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString();
    const newProject: Project = {
      ...projectData,
      id: `project_${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    setProjects(prevProjects => [...prevProjects, newProject]);
    toast.success(`Project "${newProject.name}" created!`);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === updatedProject.id
          ? { ...updatedProject, updatedAt: new Date().toISOString() }
          : project
      )
    );
    toast.success(`Project "${updatedProject.name}" updated!`);
  };

  const deleteProject = (projectId: string) => {
    // First, get the project name for the toast message
    const projectToDelete = projects.find(p => p.id === projectId);
    
    // Delete project
    setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
    
    // Delete associated tasks
    setTasks(prevTasks => prevTasks.filter(task => task.projectId !== projectId));
    
    // Delete associated comments (from the tasks of this project)
    const projectTaskIds = tasks.filter(task => task.projectId === projectId).map(task => task.id);
    setComments(prevComments => 
      prevComments.filter(comment => !projectTaskIds.includes(comment.taskId))
    );
    
    toast.success(`Project "${projectToDelete?.name}" deleted!`);
  };

  // Task operations
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    
    // Update the project to include the new task ID
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === taskData.projectId
          ? { 
              ...project, 
              tasks: [...project.tasks, newTask.id],
              updatedAt: timestamp 
            }
          : project
      )
    );
    
    // Create a notification for the assigned user
    const newNotification: Notification = {
      id: `notification_${Date.now()}`,
      type: 'TASK_ASSIGNED',
      referenceId: newTask.id,
      userId: newTask.assigneeId,
      read: false,
      createdAt: timestamp,
    };
    
    setNotifications(prevNotifications => [...prevNotifications, newNotification]);
    
    toast.success(`Task "${newTask.title}" created!`);
  };

  const updateTask = (updatedTask: Task) => {
    // Find the existing task to check if the assignee changed
    const existingTask = tasks.find(task => task.id === updatedTask.id);
    const timestamp = new Date().toISOString();
    
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id
          ? { ...updatedTask, updatedAt: timestamp }
          : task
      )
    );
    
    // If assignee changed, create a notification
    if (existingTask && existingTask.assigneeId !== updatedTask.assigneeId) {
      const newNotification: Notification = {
        id: `notification_${Date.now()}`,
        type: 'TASK_ASSIGNED',
        referenceId: updatedTask.id,
        userId: updatedTask.assigneeId,
        read: false,
        createdAt: timestamp,
      };
      
      setNotifications(prevNotifications => [...prevNotifications, newNotification]);
    }
    
    toast.success(`Task "${updatedTask.title}" updated!`);
  };

  const deleteTask = (taskId: string) => {
    // First, get the task for the toast message
    const taskToDelete = tasks.find(t => t.id === taskId);
    
    // Delete task
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    
    // Delete associated comments
    setComments(prevComments => prevComments.filter(comment => comment.taskId !== taskId));
    
    // Update the project to remove the task ID
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.tasks.includes(taskId)
          ? { 
              ...project, 
              tasks: project.tasks.filter(id => id !== taskId),
              updatedAt: new Date().toISOString() 
            }
          : project
      )
    );
    
    toast.success(`Task "${taskToDelete?.title}" deleted!`);
  };

  // Comment operations
  const addComment = (commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const timestamp = new Date().toISOString();
    const newComment: Comment = {
      ...commentData,
      id: `comment_${Date.now()}`,
      createdAt: timestamp,
    };
    
    setComments(prevComments => [...prevComments, newComment]);
    
    // Find the task associated with this comment
    const task = tasks.find(task => task.id === commentData.taskId);
    
    // Create notifications for all project members except the comment author
    if (task) {
      const project = projects.find(project => project.id === task.projectId);
      
      if (project) {
        const notificationsToAdd: Notification[] = [];
        
        // Create a notification for the task assignee if they're not the comment author
        if (task.assigneeId !== commentData.authorId) {
          notificationsToAdd.push({
            id: `notification_${Date.now()}_${task.assigneeId}`,
            type: 'COMMENT_ADDED',
            referenceId: newComment.id,
            userId: task.assigneeId,
            read: false,
            createdAt: timestamp,
          });
        }
        
        setNotifications(prevNotifications => [...prevNotifications, ...notificationsToAdd]);
      }
    }
    
    toast.success('Comment added!');
  };

  // Notification operations
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Helper functions
  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  const getTasksByProject = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getTasksByAssignee = (userId: string) => {
    return tasks.filter(task => task.assigneeId === userId);
  };

  const getCommentsByTask = (taskId: string) => {
    return comments.filter(comment => comment.taskId === taskId);
  };

  const getNotificationsByUser = (userId: string) => {
    return notifications.filter(notification => notification.userId === userId);
  };
  
  const addUserToProject = (projectId: string, userId: string) => {
    const project = getProjectById(projectId);
    
    if (project && !project.members.includes(userId)) {
      setProjects(prevProjects =>
        prevProjects.map(p =>
          p.id === projectId
            ? { ...p, members: [...p.members, userId], updatedAt: new Date().toISOString() }
            : p
        )
      );
      
      // Get user name for toast
      const user = getUserById(userId);
      toast.success(`${user?.name} added to project!`);
    }
  };
  
  const removeUserFromProject = (projectId: string, userId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(p =>
        p.id === projectId
          ? { 
              ...p, 
              members: p.members.filter(id => id !== userId),
              updatedAt: new Date().toISOString()
            }
          : p
      )
    );
    
    // Get user name for toast
    const user = getUserById(userId);
    toast.info(`${user?.name} removed from project.`);
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        tasks,
        comments,
        notifications,
        users,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        addComment,
        markNotificationAsRead,
        getProjectById,
        getTaskById,
        getUserById,
        getTasksByProject,
        getTasksByAssignee,
        getCommentsByTask,
        getNotificationsByUser,
        addUserToProject,
        removeUserFromProject,
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
