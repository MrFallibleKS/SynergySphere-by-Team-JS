
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { User as UserIcon, Trash2, Edit, Plus, Calendar, UserPlus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { Task, Status } from '@/types';
import TaskDetail from './TaskDetail';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { 
    getProjectById, 
    getTasksByProject,
    getUserById,
    users,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addUserToProject,
    removeUserFromProject
  } = useData();
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();
  
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Form states
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newMemberId, setNewMemberId] = useState('');
  
  if (!projectId) {
    navigate('/');
    return null;
  }
  
  const project = getProjectById(projectId);
  
  if (!project) {
    navigate('/');
    return null;
  }
  
  // Initialize edit form when opening
  const handleEditProjectOpen = () => {
    setEditName(project.name);
    setEditDescription(project.description);
    setIsEditProjectOpen(true);
  };
  
  // Save project edits
  const handleSaveProjectEdits = () => {
    if (!editName.trim()) {
      toast.error('Project name is required');
      return;
    }
    
    updateProject({
      id: project.id,
      name: editName,
      description: editDescription,
    });
    
    setIsEditProjectOpen(false);
  };
  
  // Delete project
  const handleDeleteProject = () => {
    deleteProject(project.id);
    navigate('/');
  };
  
  // Create new task
  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error('Task title is required');
      return;
    }
    
    if (!newTaskAssignee) {
      toast.error('Please select an assignee');
      return;
    }
    
    if (!newTaskDueDate) {
      toast.error('Please select a due date');
      return;
    }
    
    addTask({
      title: newTaskTitle,
      description: newTaskDescription,
      assigneeId: newTaskAssignee,
      dueDate: new Date(newTaskDueDate).toISOString(),
      status: 'TODO',
      projectId: project.id,
    });
    
    // Reset form
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskAssignee('');
    setNewTaskDueDate('');
    setIsNewTaskOpen(false);
  };
  
  // Add member to project
  const handleAddMember = () => {
    if (!newMemberId) {
      toast.error('Please select a user');
      return;
    }
    
    addUserToProject(project.id, newMemberId);
    setNewMemberId('');
    setIsAddMemberOpen(false);
  };
  
  // Remove member from project
  const handleRemoveMember = (userId: string) => {
    removeUserFromProject(project.id, userId);
  };
  
  // Update task status
  const handleUpdateTaskStatus = (task: Task, newStatus: Status) => {
    updateTask({
      id: task.id,
      status: newStatus,
    });
  };
  
  // Get all tasks for this project
  const projectTasks = getTasksByProject(project.id);
  
  // Group tasks by status
  const todoTasks = projectTasks.filter(task => task.status === 'TODO');
  const inProgressTasks = projectTasks.filter(task => task.status === 'IN_PROGRESS');
  const doneTasks = projectTasks.filter(task => task.status === 'DONE');
  
  // Get project members
  const projectMembers = project.members.map(memberId => getUserById(memberId)!).filter(Boolean);
  
  // Get users not in the project (for adding members)
  const nonProjectMembers = users.filter(user => !project.members.includes(user.id));
  
  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  };
  
  // Handle task selection
  const handleViewTask = (taskId: string) => {
    setSelectedTaskId(taskId);
  };
  
  // Handle task deletion
  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };
  
  // Render task card
  const renderTaskCard = (task: Task) => {
    const assignee = getUserById(task.assigneeId);
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'DONE';
    
    return (
      <Card 
        key={task.id} 
        className={`mb-3 cursor-pointer hover:shadow-md transition-shadow ${
          isOverdue ? 'border-red-300' : ''
        }`}
        onClick={() => handleViewTask(task.id)}
      >
        <CardHeader className="px-4 py-3 pb-0">
          <CardTitle className="text-base font-medium">{task.title}</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-3">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                {formatDate(task.dueDate)}
              </span>
            </div>
            
            {assignee && (
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={assignee.avatar} alt={assignee.name} />
                  <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{assignee.name}</span>
              </div>
            )}
            
            {/* Status change dropdown */}
            <div className="flex justify-between items-center pt-1">
              <Badge variant={
                task.status === 'TODO' ? 'outline' : 
                task.status === 'IN_PROGRESS' ? 'secondary' : 
                'default'
              }>
                {task.status === 'TODO' ? 'To Do' : 
                task.status === 'IN_PROGRESS' ? 'In Progress' : 
                'Done'}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateTaskStatus(task, 'TODO');
                  }}>
                    Mark as To Do
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateTaskStatus(task, 'IN_PROGRESS');
                  }}>
                    Mark as In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateTaskStatus(task, 'DONE');
                  }}>
                    Mark as Done
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-500" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTask(task.id);
                    }}
                  >
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Project Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-gray-500 mt-1 max-w-3xl">
            {project.description}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleEditProjectOpen}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Project</DialogTitle>
                <DialogDescription>
                  Make changes to your project details.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Project Name</Label>
                  <Input
                    id="edit-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditProjectOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProjectEdits}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <AlertDialog open={isDeleteProjectOpen} onOpenChange={setIsDeleteProjectOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size={isMobile ? "sm" : "default"}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the project
                  and all associated tasks and comments.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProject}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Project Tabs */}
      <Tabs defaultValue="tasks" className="mt-6">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-4">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Project Tasks</h2>
            <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add a new task to this project.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input
                      id="task-title"
                      placeholder="Enter task title"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea
                      id="task-description"
                      placeholder="Describe the task"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-assignee">Assignee</Label>
                    <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-due-date">Due Date</Label>
                    <Input
                      id="task-due-date"
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewTaskOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask}>
                    Create Task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Task Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* To Do Column */}
            <div>
              <div className="mb-3 bg-gray-100 p-3 rounded-md">
                <h3 className="font-medium text-gray-700 flex items-center">
                  To Do
                  <Badge variant="outline" className="ml-2">{todoTasks.length}</Badge>
                </h3>
              </div>
              <div className="space-y-1">
                {todoTasks.length > 0 ? (
                  todoTasks.map(task => renderTaskCard(task))
                ) : (
                  <p className="text-gray-500 text-center py-4">No tasks</p>
                )}
              </div>
            </div>
            
            {/* In Progress Column */}
            <div>
              <div className="mb-3 bg-blue-50 p-3 rounded-md">
                <h3 className="font-medium text-blue-700 flex items-center">
                  In Progress
                  <Badge variant="secondary" className="ml-2">{inProgressTasks.length}</Badge>
                </h3>
              </div>
              <div className="space-y-1">
                {inProgressTasks.length > 0 ? (
                  inProgressTasks.map(task => renderTaskCard(task))
                ) : (
                  <p className="text-gray-500 text-center py-4">No tasks</p>
                )}
              </div>
            </div>
            
            {/* Done Column */}
            <div>
              <div className="mb-3 bg-green-50 p-3 rounded-md">
                <h3 className="font-medium text-green-700 flex items-center">
                  Done
                  <Badge className="ml-2">{doneTasks.length}</Badge>
                </h3>
              </div>
              <div className="space-y-1">
                {doneTasks.length > 0 ? (
                  doneTasks.map(task => renderTaskCard(task))
                ) : (
                  <p className="text-gray-500 text-center py-4">No tasks</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Members Tab */}
        <TabsContent value="members" className="mt-4">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Team Members</h2>
            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Team Member</DialogTitle>
                  <DialogDescription>
                    Add a new member to this project.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-member">Select User</Label>
                    <Select value={newMemberId} onValueChange={setNewMemberId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {nonProjectMembers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {nonProjectMembers.length === 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        All users are already members of this project.
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMember} disabled={nonProjectMembers.length === 0}>
                    Add to Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Members List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  
                  {/* Only allow removing other members, not yourself */}
                  {member.id !== currentUser?.id && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <X className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {member.name} from this project? 
                            They will no longer have access to this project's tasks and discussions.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemoveMember(member.id)}>
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {projectMembers.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                <UserIcon className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>No team members yet</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Task Detail Modal */}
      {selectedTaskId && (
        <Dialog open={!!selectedTaskId} onOpenChange={(isOpen) => !isOpen && setSelectedTaskId(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <TaskDetail 
              taskId={selectedTaskId} 
              onClose={() => setSelectedTaskId(null)}
              onDelete={handleDeleteTask}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProjectDetails;
