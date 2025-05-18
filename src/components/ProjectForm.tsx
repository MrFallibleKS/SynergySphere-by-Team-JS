import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Project, Task, Status, TaskFormData } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { X, Plus, Calendar, Flag } from 'lucide-react';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

interface ProjectFormProps {
  onSubmit: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  initialData?: Partial<Project>;
  isEditing?: boolean;
  users?: { id: string; name: string }[];
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  isEditing = false,
  users = []
}) => {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [imageBanner, setImageBanner] = useState(initialData.imageBanner || '');
  const [managerName, setManagerName] = useState(initialData.managerName || '');
  const [managerContact, setManagerContact] = useState(initialData.managerContact || '');
  const [tags, setTags] = useState<string[]>(initialData.tags || []);
  const [currentTag, setCurrentTag] = useState('');
  const [tasks, setTasks] = useState<TaskFormData[]>(
    initialData.tasks 
      ? initialData.tasks.map(taskId => {
          const task = initialData.taskDetails?.find(t => t.id === taskId);
          return task ? {
            id: task.id,
            title: task.title || '',
            description: task.description || '',
            assigneeId: task.assigneeId || '',
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
            status: task.status || 'TODO',
            priority: task.priority || 'MEDIUM',
            role: task.role || ''
          } : {
            title: '',
            description: '',
            assigneeId: '',
            dueDate: '',
            status: 'TODO',
            priority: 'MEDIUM',
            role: ''
          };
        })
      : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentUser } = useAuth();
  const { toast } = useToast();

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        title: '',
        description: '',
        assigneeId: '',
        dueDate: '',
        status: 'TODO',
        priority: 'MEDIUM',
        role: ''
      }
    ]);
  };

  const updateTask = (index: number, field: keyof TaskFormData, value: any) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value
    };
    setTasks(updatedTasks);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive"
      });
      return;
    }
    
    // Validate tasks
    const incompleteTasks = tasks.filter(
      task => !task.title || !task.dueDate || !task.role
    );
    
    if (incompleteTasks.length > 0) {
      toast({
        title: "Error",
        description: "Please complete all task details or remove incomplete tasks",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Format tasks for submission
    const taskData = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      assigneeId: task.assigneeId,
      dueDate: new Date(task.dueDate).toISOString(),
      status: task.status,
      priority: task.priority,
      role: task.role,
      projectId: initialData.id || ''
    }));
    
    const projectData = {
      name,
      description,
      imageBanner,
      managerName,
      managerContact,
      tags,
      members: initialData.members || (currentUser ? [currentUser.id] : []),
      tasks: initialData.tasks || [],
      taskDetails: taskData
    };
    
    onSubmit(projectData);
    setIsSubmitting(false);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Project Information</h3>
          
          <div>
            <Label htmlFor="project-name">Project Name*</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project"
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="project-tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="project-tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add project tags"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={addTag}
                variant="outline"
              >
                Add
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <Badge key={index} className="flex items-center gap-1 px-3 py-1">
                    {tag}
                    <button 
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500 focus:outline-none"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="project-image">Banner Image URL</Label>
            <Input
              id="project-image"
              value={imageBanner}
              onChange={(e) => setImageBanner(e.target.value)}
              placeholder="Enter banner image URL"
            />
            {imageBanner && (
              <div className="mt-2 rounded-md overflow-hidden h-32 bg-gray-100 flex items-center justify-center">
                <img 
                  src={imageBanner} 
                  alt="Banner Preview" 
                  className="object-cover h-full w-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-medium">Project Manager Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manager-name">Manager Name</Label>
              <Input
                id="manager-name"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="Project manager's name"
              />
            </div>
            
            <div>
              <Label htmlFor="manager-contact">Manager Contact</Label>
              <Input
                id="manager-contact"
                value={managerContact}
                onChange={(e) => setManagerContact(e.target.value)}
                placeholder="Email or phone number"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Project Tasks</h3>
            <Button 
              type="button" 
              onClick={addTask} 
              size="sm"
              variant="outline"
            >
              <Plus size={16} className="mr-1" /> Add Task
            </Button>
          </div>
          
          {tasks.length === 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-center text-gray-500">
              No tasks added yet. Click "Add Task" to create tasks for this project.
            </div>
          )}
          
          {tasks.map((task, index) => (
            <div 
              key={index}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Task #{index + 1}</h4>
                <Button 
                  type="button" 
                  onClick={() => removeTask(index)} 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`task-title-${index}`}>Task Title*</Label>
                  <Input
                    id={`task-title-${index}`}
                    value={task.title}
                    onChange={(e) => updateTask(index, 'title', e.target.value)}
                    placeholder="Task title"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor={`task-role-${index}`}>Role*</Label>
                  <Input
                    id={`task-role-${index}`}
                    value={task.role}
                    onChange={(e) => updateTask(index, 'role', e.target.value)}
                    placeholder="Required skill/role for this task"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor={`task-description-${index}`}>Description</Label>
                <Textarea
                  id={`task-description-${index}`}
                  value={task.description}
                  onChange={(e) => updateTask(index, 'description', e.target.value)}
                  placeholder="Describe the task"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`task-assignee-${index}`}>Assignee</Label>
                  <Select 
                    value={task.assigneeId} 
                    onValueChange={(value) => updateTask(index, 'assigneeId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label 
                    htmlFor={`task-due-date-${index}`}
                    className="flex items-center gap-2"
                  >
                    <Calendar size={14} />
                    Due Date*
                  </Label>
                  <Input
                    id={`task-due-date-${index}`}
                    type="date"
                    value={task.dueDate}
                    onChange={(e) => updateTask(index, 'dueDate', e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label 
                    htmlFor={`task-status-${index}`}
                    className="flex items-center gap-2"
                  >
                    Status
                  </Label>
                  <Select 
                    value={task.status} 
                    onValueChange={(value) => 
                      updateTask(index, 'status', value as Status)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TODO">To Do</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="DONE">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label 
                    htmlFor={`task-priority-${index}`}
                    className="flex items-center gap-2"
                  >
                    <Flag size={14} />
                    Priority
                  </Label>
                  <Select 
                    value={task.priority} 
                    onValueChange={(value) => 
                      updateTask(index, 'priority', value as 'LOW' | 'MEDIUM' | 'HIGH')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProjectForm;
