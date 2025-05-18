
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectForm from '@/components/ProjectForm';
import { useData } from '@/context/DataContext';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

const ProjectFormPage: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, users, addProject, updateProject } = useData();
  const { toast } = useToast();
  
  const isEditing = !!projectId;
  const project = isEditing 
    ? projects.find(p => p.id === projectId) 
    : undefined;

  const handleSubmit = (projectData: any) => {
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
        };
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
    <div className="container mx-auto px-4 py-8">
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
