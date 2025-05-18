
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, List, Plus, CheckCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AvailableProjects from './AvailableProjects';
import TaskStatusLegend from './TaskStatusLegend';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    projects, 
    tasks, 
    getTasksByAssignee, 
    getProjectById,
    getUserById,
    addProject 
  } = useData();
  
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // Get user's tasks
  const userTasks = currentUser ? getTasksByAssignee(currentUser.id) : [];
  
  // User's projects
  const userProjects = currentUser 
    ? projects.filter(project => project.members.includes(currentUser.id)) 
    : [];
  
  // Tasks due soon (within the next 3 days)
  const tasksDueSoon = userTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const threeDaysFromNow = addDays(now, 3);
    return isBefore(dueDate, threeDaysFromNow) && isAfter(dueDate, now) && task.status !== 'DONE';
  });
  
  // Overdue tasks
  const tasksOverdue = userTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    return isBefore(dueDate, now) && task.status !== 'DONE';
  });
  
  // Tasks by status
  const todoTasks = userTasks.filter(task => task.status === 'TODO');
  const inProgressTasks = userTasks.filter(task => task.status === 'IN_PROGRESS');
  const completedTasks = userTasks.filter(task => task.status === 'DONE');
  
  // Create new project
  const handleCreateProject = () => {
    if (!name.trim() || !currentUser) return;
    
    addProject({
      name,
      description,
      members: [currentUser.id],
      tasks: [],
    });
    
    setName('');
    setDescription('');
    setIsOpen(false);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Welcome Section */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Welcome, {currentUser?.name}</h1>
            <p className="text-gray-600 mt-1">Here's an overview of your tasks and projects</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0 px-6 bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Add a new project to start collaborating with your team.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="Enter project name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="Describe the project"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateProject}>Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>
      
      <TaskStatusLegend />
      
      {/* Task Overview */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">To Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* To Do */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2 bg-white dark:bg-gray-800">
              <CardTitle className="text-xl">To Do</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {todoTasks.length > 0 ? (
                  todoTasks.slice(0, 4).map((task) => {
                    const project = getProjectById(task.projectId);
                    
                    return (
                      <li key={task.id} className="p-2 border-b pb-3">
                        <Link to={`/project/${task.projectId}`} className="block">
                          <p className="font-medium">{task.title}</p>
                          <div className="text-sm text-gray-500 mt-1">
                            {project ? project.name : 'Unknown project'}
                          </div>
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-2">No tasks to do</p>
                )}
              </ul>
            </CardContent>
          </Card>
          
          {/* In Progress */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2 bg-white dark:bg-gray-800">
              <CardTitle className="text-xl">In Progress</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {inProgressTasks.length > 0 ? (
                  inProgressTasks.slice(0, 4).map((task) => {
                    const project = getProjectById(task.projectId);
                    
                    return (
                      <li key={task.id} className="p-2 border-b pb-3">
                        <Link to={`/project/${task.projectId}`} className="block">
                          <p className="font-medium">{task.title}</p>
                          <div className="text-sm text-gray-500 mt-1">
                            {project ? project.name : 'Unknown project'}
                          </div>
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-2">No tasks in progress</p>
                )}
              </ul>
            </CardContent>
          </Card>
          
          {/* Completed */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2 bg-white dark:bg-gray-800">
              <CardTitle className="text-xl">Completed</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {completedTasks.length > 0 ? (
                  completedTasks.slice(0, 4).map((task) => {
                    const project = getProjectById(task.projectId);
                    
                    return (
                      <li key={task.id} className="p-2 border-b pb-3">
                        <Link to={`/project/${task.projectId}`} className="block">
                          <p className="font-medium line-through text-gray-500">{task.title}</p>
                          <div className="text-sm text-gray-500 mt-1">
                            {project ? project.name : 'Unknown project'}
                          </div>
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-2">No completed tasks</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Attention Required Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Attention Required</h2>
        {tasksDueSoon.length > 0 && (
          <Card className="border shadow-sm mb-4 bg-amber-50 dark:bg-amber-900/20">
            <CardHeader className="pb-2 border-b border-amber-100 dark:border-amber-800">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-amber-800 dark:text-amber-300">Due Soon</CardTitle>
                <div className="text-amber-600 dark:text-amber-400">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mt-2">
                {tasksDueSoon.map((task) => {
                  const project = getProjectById(task.projectId);
                  
                  return (
                    <li key={task.id} className="p-2 border-b pb-3 dark:border-amber-800/30">
                      <Link to={`/project/${task.projectId}`} className="block">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                              {project ? project.name : 'Unknown project'}
                            </div>
                          </div>
                          <div className="text-amber-800 dark:text-amber-300 font-medium">
                            {formatDate(task.dueDate)}
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        )}
      </section>
      
      {/* Projects Section */}
      <section className="mb-8">
        <Tabs defaultValue="your-projects">
          <TabsList className="mb-4">
            <TabsTrigger value="your-projects">Your Projects</TabsTrigger>
            <TabsTrigger value="available-projects">Available Projects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="your-projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProjects.length > 0 ? (
                userProjects.map((project) => {
                  // Get project members
                  const members = project.members
                    .map(id => getUserById(id))
                    .filter(Boolean);
                  
                  // Get project tasks
                  const projectTasksCount = tasks.filter(task => task.projectId === project.id).length;
                  const completedTasksCount = tasks.filter(task => task.projectId === project.id && task.status === 'DONE').length;
                  
                  // Calculate completion percentage
                  const completionPercentage = projectTasksCount > 0
                    ? Math.round((completedTasksCount / projectTasksCount) * 100)
                    : 0;
                  
                  return (
                    <Card key={project.id} className="border shadow-sm">
                      <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{completionPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                              <div 
                                className="bg-indigo-600 h-2 rounded-full" 
                                style={{ width: `${completionPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full mt-2" 
                            asChild
                          >
                            <Link to={`/project/${project.id}`}>
                              View Project <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full border rounded-lg p-8 bg-gray-50 dark:bg-gray-800 text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No projects yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first project to get started</p>
                  <Button onClick={() => setIsOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="available-projects">
            <h2 className="text-xl font-semibold mb-4">Join Available Projects</h2>
            <AvailableProjects />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Dashboard;
