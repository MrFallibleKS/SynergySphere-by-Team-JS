import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { TaskFormData, User, Project } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronLeft, Calendar as CalendarIcon, Tags } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (task: TaskFormData) => void;
  onCancel: () => void;
  initialData?: Partial<TaskFormData>;
  isEditing?: boolean;
  users?: User[];
  projects?: Project[];
  preSelectedProjectId?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  isEditing = false,
  users = [],
  projects = [],
  preSelectedProjectId,
}) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [assigneeId, setAssigneeId] = useState(initialData.assigneeId || '');
  const [projectId, setProjectId] = useState(preSelectedProjectId || initialData.projectId || '');
  const [date, setDate] = useState<Date | undefined>(
    initialData.dueDate ? new Date(initialData.dueDate) : undefined
  );
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>(initialData.priority || 'MEDIUM');
  const [role, setRole] = useState(initialData.role || '');
  const [tags, setTags] = useState<string[]>(initialData.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { projectId: urlProjectId } = useParams();

  // If we have a project ID from the URL, use it
  useEffect(() => {
    if (urlProjectId && !projectId) {
      setProjectId(urlProjectId);
    }
  }, [urlProjectId, projectId]);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const newTags = tagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '' && !tags.includes(tag));
    
    if (newTags.length > 0) {
      setTags([...tags, ...newTags]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!date) {
      toast({
        title: "Error",
        description: "Deadline is required",
        variant: "destructive"
      });
      return;
    }

    if (!projectId) {
      toast({
        title: "Error",
        description: "Project is required",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const taskData: TaskFormData = {
      id: initialData.id,
      title,
      description,
      assigneeId,
      dueDate: date.toISOString(),
      status: initialData.status || 'TODO',
      priority,
      role,
      projectId,
      tags
    };
    
    onSubmit(taskData);
    setIsSubmitting(false);
  };

  const selectedProject = projects.find(p => p.id === projectId);

  return (
    <Card className="p-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center mr-2"
          onClick={() => navigate(projectId ? `/project/${projectId}` : '/projects')}
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Button>
        <h2 className="text-2xl font-semibold">
          {isEditing ? 'Edit Task' : 'New Task'}
          {selectedProject && (
            <span className="text-muted-foreground ml-2 text-lg font-normal">
              {`in ${selectedProject.name}`}
            </span>
          )}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="task-name" className="text-base">Task Name*</Label>
            <Input
              id="task-name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task name"
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="task-assignee" className="text-base">Assignee</Label>
              <Select 
                value={assigneeId} 
                onValueChange={setAssigneeId}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select assignee" />
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
              <Label htmlFor="task-project" className="text-base">Project*</Label>
              <Select 
                value={projectId} 
                onValueChange={setProjectId}
                disabled={!!preSelectedProjectId || !!urlProjectId}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="task-deadline" className="text-base flex items-center">
                <CalendarIcon size={16} className="mr-2" />
                Deadline*
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left mt-1"
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="task-role" className="text-base">Role/Skill Required</Label>
              <Input
                id="task-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Required skill/role for this task"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-base mb-1 flex items-center">
              <Tags size={16} className="mr-2" />
              Tags
            </Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add tags separated by commas"
              />
              <Button 
                type="button" 
                onClick={addTag}
                variant="secondary"
              >
                Add
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div key={index} className="bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full flex items-center gap-1">
                    {tag}
                    <button 
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive focus:outline-none ml-1"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="task-priority" className="text-base">Priority</Label>
            <RadioGroup 
              value={priority} 
              onValueChange={setPriority}
              className="flex space-x-4 mt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="LOW" id="priority-low" />
                <Label htmlFor="priority-low" className="cursor-pointer">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MEDIUM" id="priority-medium" />
                <Label htmlFor="priority-medium" className="cursor-pointer">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="HIGH" id="priority-high" />
                <Label htmlFor="priority-high" className="cursor-pointer">High</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="task-description" className="text-base">Description</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task"
              rows={4}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Discard
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Save Task'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TaskForm;
