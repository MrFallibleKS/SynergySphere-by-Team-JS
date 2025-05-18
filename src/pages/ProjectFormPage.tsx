
import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ProjectForm from '@/components/ProjectForm';
import { useData } from '@/context/DataContext';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { Project } from '@/types';
import { ChevronLeft } from 'lucide-react';

const ProjectFormPage: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, users, addProject, updateProject } = useData();
  const { toast } = useToast();
  
  const isEditing = !!projectId;
  const project = isEditing 
    ? projects.find(p => p.id === projectId) 
    : undefined;

  const handleSubmit = (projectData: Partial<Project>) => {
    try {
      if (isEditing && project) {
        updateProject({
          ...project,
          ...projectData
        });
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        const newProject = {
          ...projectData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Ensure all required Project properties are present
          members: projectData.members || [],
          tasks: projectData.tasks || [],
        } as Project;
        
        addProject(newProject);
        toast({
          title: "Success",
          description: "Project created successfully",
        });
      }
      navigate('/projects');
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the project",
        variant: "destructive"
      });
      console.error("Error saving project:", error);
    }
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex items-center mb-6">
        <Link to="/projects" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={16} className="mr-1" />
          Projects
        </Link>
        <span className="mx-2 text-muted-foreground">&gt;</span>
        <span className="text-sm font-medium">{isEditing ? 'Edit Project' : 'New Project'}</span>
      </div>

      <ProjectForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={project}
        isEditing={isEditing}
        users={users}
      />
    </div>
  );
};

export default ProjectFormPage;
