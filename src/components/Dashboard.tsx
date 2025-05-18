
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="container mx-auto max-w-7xl">
      {/* Welcome Section */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {currentUser?.name}</h1>
            <p className="text-gray-600 mt-1">Here's an overview of your tasks and projects</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0">
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
      
      {/* Task Overview */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* To Do */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">To Do</CardTitle>
                <Badge variant="outline">{todoTasks.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 max-h-40 overflow-auto">
                {todoTasks.length > 0 ? (
                  todoTasks.slice(0, 4).map((task) => {
                    const project = getProjectById(task.projectId);
                    
                    return (
                      <li key={task.id} className="p-2 border rounded-md hover:bg-gray-50">
                        <Link to={`/project/${task.projectId}`} className="block">
                          <p className="font-medium">{task.title}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {project ? project.name : 'Unknown project'}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(task.dueDate)}
                            </span>
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
            {todoTasks.length > 4 && (
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/tasks">
                    View all ({todoTasks.length})
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {/* In Progress */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">In Progress</CardTitle>
                <Badge variant="secondary">{inProgressTasks.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 max-h-40 overflow-auto">
                {inProgressTasks.length > 0 ? (
                  inProgressTasks.slice(0, 4).map((task) => {
                    const project = getProjectById(task.projectId);
                    
                    return (
                      <li key={task.id} className="p-2 border rounded-md hover:bg-gray-50">
                        <Link to={`/project/${task.projectId}`} className="block">
                          <p className="font-medium">{task.title}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {project ? project.name : 'Unknown project'}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(task.dueDate)}
                            </span>
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
            {inProgressTasks.length > 4 && (
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/tasks">
                    View all ({inProgressTasks.length})
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {/* Completed */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Completed</CardTitle>
                <Badge className="bg-green-600">{completedTasks.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 max-h-40 overflow-auto">
                {completedTasks.length > 0 ? (
                  completedTasks.slice(0, 4).map((task) => {
                    const project = getProjectById(task.projectId);
                    
                    return (
                      <li key={task.id} className="p-2 border rounded-md hover:bg-gray-50">
                        <Link to={`/project/${task.projectId}`} className="block">
                          <p className="font-medium line-through text-gray-500">{task.title}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {project ? project.name : 'Unknown project'}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <CheckCheck className="h-3 w-3 mr-1" />
                              Completed
                            </span>
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
            {completedTasks.length > 4 && (
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/tasks">
                    View all ({completedTasks.length})
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </section>
      
      {/* Attention Required */}
      {(tasksOverdue.length > 0 || tasksDueSoon.length > 0) && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Attention Required</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Overdue Tasks */}
            {tasksOverdue.length > 0 && (
              <Card>
                <CardHeader className="pb-2 bg-red-50 rounded-t-md border-b border-red-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-red-600">Overdue</CardTitle>
                    <Badge variant="destructive">{tasksOverdue.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mt-2">
                    {tasksOverdue.map((task) => {
                      const project = getProjectById(task.projectId);
                      
                      return (
                        <li key={task.id} className="p-2 border border-red-100 rounded-md bg-red-50 hover:bg-red-100">
                          <Link to={`/project/${task.projectId}`} className="block">
                            <p className="font-medium">{task.title}</p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-700">
                                {project ? project.name : 'Unknown project'}
                              </span>
                              <span className="text-xs text-red-600 font-medium flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Due: {formatDate(task.dueDate)}
                              </span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {/* Due Soon */}
            {tasksDueSoon.length > 0 && (
              <Card>
                <CardHeader className="pb-2 bg-yellow-50 rounded-t-md border-b border-yellow-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-yellow-600">Due Soon</CardTitle>
                    <Badge className="bg-yellow-500">{tasksDueSoon.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mt-2">
                    {tasksDueSoon.map((task) => {
                      const project = getProjectById(task.projectId);
                      
                      return (
                        <li key={task.id} className="p-2 border border-yellow-100 rounded-md bg-yellow-50 hover:bg-yellow-100">
                          <Link to={`/project/${task.projectId}`} className="block">
                            <p className="font-medium">{task.title}</p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-700">
                                {project ? project.name : 'Unknown project'}
                              </span>
                              <span className="text-xs text-yellow-700 font-medium flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Due: {formatDate(task.dueDate)}
                              </span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}
      
      {/* Recent Projects */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
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
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-synergy-600 h-2.5 rounded-full" 
                            style={{ width: `${completionPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">Team:</span>
                          <div className="flex -space-x-2">
                            {members.slice(0, 3).map(member => (
                              <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                            {members.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                                +{members.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/project/${project.id}`}>
                        <List className="mr-2 h-4 w-4" />
                        View Project
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full border rounded-lg p-8 bg-gray-50 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-4">Create your first project to get started</p>
              <Button onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
