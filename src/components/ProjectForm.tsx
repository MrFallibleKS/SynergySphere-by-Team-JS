import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { Project, User } from '@/types';
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
import { Calendar as CalendarIcon } from 'lucide-react';

interface ProjectFormProps {
  onSubmit: (project: Partial<Project>) => void;
  onCancel: () => void;
  initialData?: Project;
  isEditing?: boolean;
  users: User[];
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  users
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [managerId, setManagerId] = useState(initialData?.managerId || '');
  const [deadline, setDeadline] = useState<Date | undefined>(
    initialData?.deadline ? new Date(initialData.deadline) : undefined
  );
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>(initialData?.priority || 'MEDIUM');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [members, setMembers] = useState<string[]>(initialData?.members || []);
  const [imageBanner, setImageBanner] = useState(initialData?.imageBanner || '');
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
    
    if (!name.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const projectData = {
      ...initialData,
      name,
      description,
      managerId,
      managerName: users.find(u => u.id === managerId)?.name || '',
      managerContact: users.find(u => u.id === managerId)?.email || '',
      deadline: deadline ? deadline.toISOString() : '',
      priority,
      tags,
      members,
      imageBanner
    };
    
    onSubmit(projectData);
    setIsSubmitting(false);
  };

  return (
    <Card className="p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">{isEditing ? 'Edit Project' : 'New Project'}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="project-name" className="text-base">Project Name</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="project-description" className="text-base">Description</Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project"
              rows={4}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project-manager" className="text-base">Project Manager</Label>
              <Select 
                value={managerId} 
                onValueChange={setManagerId}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select project manager" />
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
              <Label htmlFor="project-deadline" className="text-base flex items-center">
                <CalendarIcon size={16} className="mr-2" />
                Deadline
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left mt-1"
                  >
                    {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
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
            <Label htmlFor="project-priority" className="text-base">Priority</Label>
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
            <Label htmlFor="project-image-banner" className="text-base">Image Banner URL</Label>
            <Input
              id="project-image-banner"
              value={imageBanner}
              onChange={(e) => setImageBanner(e.target.value)}
              placeholder="Enter image URL for the project banner"
              className="mt-1"
            />
          </div>
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
