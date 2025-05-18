
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { LayoutGrid, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const isMobile = useIsMobile();

  // Store sidebar state in localStorage
  useEffect(() => {
    const collapsed = localStorage.getItem('sidebar-collapsed');
    if (collapsed !== null) {
      setIsCollapsed(collapsed === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

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

  // On mobile devices, the sidebar is hidden by default
  if (isMobile) {
    return null;
  }

  return (
    <>
      <div 
        className={`border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 h-full flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className={`p-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8">
                <img src="/lovable-uploads/20798b3f-8f2f-4eee-acc7-fa3d47c76467.png" alt="SynergySphere Logo" className="h-8 w-auto" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">SynergySphere</h1>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8">
              <img src="/lovable-uploads/20798b3f-8f2f-4eee-acc7-fa3d47c76467.png" alt="SynergySphere Logo" className="h-8 w-auto" />
            </div>
          )}
        </div>
        
        <div className={`p-4 ${isCollapsed ? 'px-2' : ''}`}>
          <div className={`flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <LayoutGrid className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            {!isCollapsed && <span className="font-medium">Projects</span>}
          </div>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start mt-2 text-gray-700 dark:text-gray-300 ${
              isCollapsed ? 'px-0 justify-center' : ''
            }`}
            onClick={() => setIsOpen(true)}
          >
            <Plus className={`${isCollapsed ? '' : 'mr-2'} h-4 w-4`} />
            {!isCollapsed && 'New Project'}
          </Button>
          
          <div className="mt-4 space-y-1">
            {userProjects.map((project) => (
              <NavLink
                key={project.id}
                to={`/project/${project.id}`}
                className={({ isActive }) => 
                  `flex items-center ${isCollapsed ? 'justify-center px-2' : 'pl-10 pr-4'} py-2 rounded-md ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  } transition-colors`
                }
              >
                {isCollapsed ? (
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs">
                    {project.name.charAt(0)}
                  </span>
                ) : (
                  <span className="truncate">{project.name}</span>
                )}
              </NavLink>
            ))}
            
            {userProjects.length === 0 && !isCollapsed && (
              <div className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">
                <p>No projects yet</p>
                <p className="text-sm mt-1">Create your first project</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Toggle button */}
        <div className="mt-auto p-4 flex justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="rounded-full h-8 w-8 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isCollapsed ? 
              <ChevronRight className="h-4 w-4" /> : 
              <ChevronLeft className="h-4 w-4" />
            }
          </Button>
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
    </>
  );
};

export default Sidebar;
