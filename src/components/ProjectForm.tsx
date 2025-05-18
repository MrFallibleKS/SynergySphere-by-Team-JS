
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Project } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from './ui/use-toast';

interface ProjectFormProps {
  onSubmit: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  initialData?: Partial<Project>;
  isEditing?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  isEditing = false
}) => {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [imageBanner, setImageBanner] = useState(initialData.imageBanner || '');
  const [managerName, setManagerName] = useState(initialData.managerName || '');
  const [managerContact, setManagerContact] = useState(initialData.managerContact || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentUser } = useAuth();
  const { toast } = useToast();

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
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const projectData = {
        name,
        description,
        imageBanner,
        managerName,
        managerContact,
        members: initialData.members || (currentUser ? [currentUser.id] : []),
        tasks: initialData.tasks || [],
      };
      
      onSubmit(projectData);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
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
