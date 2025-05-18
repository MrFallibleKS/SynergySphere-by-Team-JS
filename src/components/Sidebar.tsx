
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { LayoutGrid, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar: React.FC = () => {
  const { projects, addProject } = useData();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const isMobile = useIsMobile();

  const handleCreateProject = () => {
    if (!name.trim()) return;
    
    addProject({
      name,
      description,
      members: [currentUser?.id || ''],
      tasks: [],
    });
    
    setName('');
    setDescription('');
    setIsOpen(false);
  };

  // Filter projects that the current user is a member of
  const userProjects = projects.filter(
    project => currentUser && project.members.includes(currentUser.id)
  );

  return (
    <div className="w-64 border-r border-gray-200 bg-white h-full flex flex-col">
      <div className="p-4 flex items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="url(#gradient)" />
              <path d="M22 12L16 7L10 12L10 22L22 22L22 12Z" fill="white" fillOpacity="0.5" />
              <path d="M16 7L10 12L16 17L22 12L16 7Z" fill="white" />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4776E6" />
                  <stop offset="1" stopColor="#8E54E9" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="text-xl font-bold">SynergySphere</h1>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md">
          <LayoutGrid className="h-5 w-5 text-gray-700" />
          <span className="font-medium">Projects</span>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start mt-2 text-gray-700" 
          onClick={() => setIsOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
        
        <div className="mt-4 space-y-1">
          {userProjects.map((project) => (
            <NavLink
              key={project.id}
              to={`/project/${project.id}`}
              className={({ isActive }) => 
                `flex items-center pl-10 pr-4 py-2 rounded-md ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                } transition-colors`
              }
            >
              <span className="truncate">{project.name}</span>
            </NavLink>
          ))}
          
          {userProjects.length === 0 && (
            <div className="px-3 py-6 text-center text-gray-500">
              <p>No projects yet</p>
              <p className="text-sm mt-1">Create your first project</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Project Creation Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project for your team to collaborate on.
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
  );
};

export default Sidebar;
