
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { ListTodo, Plus } from 'lucide-react';
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
    <div className={`bg-sidebar h-full md:w-64 px-4 py-6 border-r border-gray-200 dark:border-gray-700 ${isMobile ? 'pt-0' : ''}`}>
      <div className="space-y-6">
        <div>
          <h2 className="px-2 mb-2 text-lg font-semibold tracking-tight">Projects</h2>
          <div className="space-y-1">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </DialogTrigger>
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
            
            <div className="mt-3 space-y-1">
              {userProjects.map((project) => (
                <NavLink
                  key={project.id}
                  to={`/project/${project.id}`}
                  className={({ isActive }) => 
                    `block px-3 py-2 rounded-md ${
                      isActive 
                        ? 'bg-synergy-100 text-synergy-900' 
                        : 'text-gray-700 hover:text-synergy-900 hover:bg-synergy-50'
                    } transition-colors`
                  }
                >
                  <div className="flex items-center">
                    <ListTodo className="mr-2 h-4 w-4" />
                    <span className="truncate">{project.name}</span>
                  </div>
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
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
