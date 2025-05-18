import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { TaskFormData, User, Project } from '@/types';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (task: TaskFormData) => void;
  onCancel: () => void;
  initialData?: TaskFormData;
  isEditing?: boolean;
  users: User[];
  projects: Project[];
  preSelectedProjectId?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  users,
  projects,
  preSelectedProjectId
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [assigneeId, setAssigneeId] = useState(initialData?.assigneeId || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialData?.dueDate ? new Date(initialData.dueDate) : undefined
  );
  const [status, setStatus] = useState(initialData?.status || 'TODO');
  const [projectId, setProjectId] = useState(preSelectedProjectId || initialData?.projectId || '');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>(initialData?.priority || 'MEDIUM');
  const [role, setRole] = useState(initialData?.role || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      return;
    }
    
    setIsSubmitting(true);
    
    const taskData = {
      ...initialData,
      title,
      description,
      assigneeId,
      dueDate: dueDate ? dueDate.toISOString() : '',
      status,
      projectId,
      priority,
      role,
      tags
    };
    
    onSubmit(taskData);
    setIsSubmitting(false);
  };

  return (
    <Card className="p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">{isEditing ? 'Edit Task' : 'New Task'}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="task-title" className="text-base">Task Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="mt-1"
            />
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
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="task-deadline" className="text-base flex items-center">
                <CalendarIcon size={16} className="mr-2" />
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left mt-1"
                  >
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="task-project" className="text-base">Project</Label>
            <Select 
              value={projectId} 
              onValueChange={setProjectId}
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

          <div>
            <Label htmlFor="task-role" className="text-base">Role</Label>
            <Input
              id="task-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Enter task role"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-base mb-1">Tags</Label>
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
              onValueChange={(value) => setPriority(value as 'LOW' | 'MEDIUM' | 'HIGH')}
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
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TaskForm;
